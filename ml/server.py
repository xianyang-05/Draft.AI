from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
import uvicorn
import json
import sys

# Reconfigure stdout and stderr to use utf-8 to prevent cp1252 encoding crashes on Windows
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

app = FastAPI(title="Draft.AI Prediction API")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Global variables to store the loaded models
lgb_model = None
cb_model = None
calibrator = None
le = None
model_json_data = None

# Role mapping helper
ROLE_MAP = {
    'TOP': 'top',
    'JUNGLE': 'jng',
    'MID': 'mid',
    'ADC': 'bot',
    'SUPPORT': 'sup'
}

ROLE_COLS = [
    'blue_top', 'blue_jng', 'blue_mid', 'blue_bot', 'blue_sup',
    'red_top',  'red_jng',  'red_mid',  'red_bot',  'red_sup'
]

ENCODED_COLS = [f'{col}_enc' for col in ROLE_COLS]

@app.on_event("startup")
def load_models():
    global lgb_model, cb_model, calibrator, le, model_json_data
    try:
        # Load from ml/ directory
        lgb_model = joblib.load("lgb_model.pkl")
        cb_model = joblib.load("cb_model.pkl")
        calibrator = joblib.load("calibrated_ensemble.pkl")
        le = joblib.load("label_encoder.pkl")
        
        # Load the exported JSON lookup for incomplete drafts and recommendations
        json_path = "../src/data/draft_model.json"
        if os.path.exists(json_path):
            with open(json_path, "r", encoding="utf-8") as f:
                model_json_data = json.load(f)
        
        print("✅ All model checkpoints and data loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        # If running from root directory instead of ml/
        try:
            lgb_model = joblib.load("ml/lgb_model.pkl")
            cb_model = joblib.load("ml/cb_model.pkl")
            calibrator = joblib.load("ml/calibrated_ensemble.pkl")
            le = joblib.load("ml/label_encoder.pkl")
            with open("src/data/draft_model.json", "r", encoding="utf-8") as f:
                model_json_data = json.load(f)
            print("✅ Model checkpoints loaded from root folder!")
        except Exception as err:
            print(f"❌ Critical error loading models: {err}")

class TeamSlot(BaseModel):
    role: str
    champion: dict | None = None

class PredictionRequest(BaseModel):
    blueTeam: list[TeamSlot]
    redTeam: list[TeamSlot]

@app.post("/predict")
def predict_draft(request: PredictionRequest):
    if lgb_model is None or cb_model is None or calibrator is None or le is None:
        raise HTTPException(status_code=500, detail="Models are not loaded on backend server.")

    # 1. Map request slots to role structure
    blue_slots = {slot.role: slot.champion['name'] if slot.champion else None for slot in request.blueTeam}
    red_slots = {slot.role: slot.champion['name'] if slot.champion else None for slot in request.redTeam}
    
    # 2. Count picked champions
    blue_picked = [name for name in blue_slots.values() if name is not None]
    red_picked = [name for name in red_slots.values() if name is not None]
    total_picked = len(blue_picked) + len(red_picked)

    # 3. Handle incomplete drafts (fallback to Bayesian empirical lookup)
    if total_picked < 10:
        return calculate_incomplete_prediction(blue_slots, red_slots)

    # 4. If draft is complete (all 10 picked), run the ML models
    try:
        # Prepare input dict
        input_data = {}
        for role_name, key in ROLE_MAP.items():
            input_data[f'blue_{key}'] = blue_slots.get(role_name)
            input_data[f'red_{key}'] = red_slots.get(role_name)
        
        # Encode values using the LabelEncoder
        encoded_input = []
        for col in ROLE_COLS:
            val = input_data[col]
            if val not in le.classes_:
                # Fallback for unknown champion names (e.g. mapping to first class)
                encoded_input.append(0)
            else:
                encoded_input.append(int(le.transform([val])[0]))

        # Predict using ensemble
        X = pd.DataFrame([encoded_input], columns=ENCODED_COLS)
        
        # Get probabilities from classifiers
        lgb_prob = float(lgb_model.predict_proba(X)[:, 1][0])
        cb_prob = float(cb_model.predict_proba(X)[:, 1][0])
        
        ens_prob = (lgb_prob + cb_prob) / 2
        
        # Apply Isotonic Calibration
        calibrated_prob = float(calibrator.transform([ens_prob])[0])
        
        # Clip to realistic draft probability margins (15% to 85%)
        final_prob = max(0.15, min(0.85, calibrated_prob))
        win_chance_percentage = int(round(final_prob * 100))

        # Get recommendations
        recommendations = get_recommendations_from_json(blue_picked + red_picked)

        return {
            "source": "ML Ensemble Model (Calibrated)",
            "blueWinChance": win_chance_percentage,
            "recommendedPicks": recommendations["picks"],
            "recommendedBans": recommendations["bans"]
        }
    except Exception as e:
        print(f"Prediction failed, falling back to empirical. Error: {e}")
        return calculate_incomplete_prediction(blue_slots, red_slots)

def calculate_incomplete_prediction(blue_slots, red_slots):
    """Fallback calculation using Bayesian-smoothed empirical rates."""
    if model_json_data is None:
        return {
            "source": "Default Baseline",
            "blueWinChance": 53,
            "recommendedPicks": [],
            "recommendedBans": []
        }
        
    metadata = model_json_data.get("metadata", {})
    champion_values = model_json_data.get("champion_values", {})
    base_rate = metadata.get("base_blue_win_rate", 0.5316)
    
    blue_contribution = 0.0
    red_contribution = 0.0
    
    # Calculate blue picks
    for role_name, champ_name in blue_slots.items():
        if champ_name:
            model_role = ROLE_MAP.get(role_name)
            champ_data = champion_values.get(champ_name, {})
            val = champ_data.get("blue", {}).get(model_role, {}).get("value", 0.0)
            blue_contribution += val
            
    # Calculate red picks
    for role_name, champ_name in red_slots.items():
        if champ_name:
            model_role = ROLE_MAP.get(role_name)
            champ_data = champion_values.get(champ_name, {})
            val = champ_data.get("red", {}).get(model_role, {}).get("value", 0.0)
            red_contribution += val
            
    raw_prob = base_rate + blue_contribution + red_contribution
    final_prob = max(0.15, min(0.85, raw_prob))
    win_chance_percentage = int(round(final_prob * 100))
    
    all_picked = [name for name in list(blue_slots.values()) + list(red_slots.values()) if name]
    recommendations = get_recommendations_from_json(all_picked)
    
    return {
        "source": "Empirical Bayesian Prior Lookup",
        "blueWinChance": win_chance_percentage,
        "recommendedPicks": recommendations["picks"],
        "recommendedBans": recommendations["bans"]
    }

def get_recommendations_from_json(picked_champs):
    if model_json_data is None:
        return {"picks": [], "bans": []}
        
    all_champs = model_json_data.get("champion_stats", {})
    picked_set = set(picked_champs)
    
    sorted_champs = []
    for name, stats in all_champs.items():
        if name not in picked_set and stats.get("total_picks", 0) >= 50:
            sorted_champs.append({
                "name": name,
                "overall_win_rate": stats.get("overall_win_rate", 0.5)
            })
            
    sorted_champs.sort(key=lambda x: x["overall_win_rate"], reverse=True)
    picks = [c["name"] for c in sorted_champs[:3]]
    bans = [c["name"] for c in sorted_champs[3:5]]
    
    return {"picks": picks, "bans": bans}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
