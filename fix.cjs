const fs = require('fs'); let css = fs.readFileSync('src/App.css', 'utf8'); css = css.replace(/\\\\\\//g, '\\/'); fs.writeFileSync('src/App.css', css);
