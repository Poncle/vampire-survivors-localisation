const fs = require('fs');
const excelToJson = require('convert-excel-to-json');
const langsTemplate = require('./langs/langs.json');
const result = excelToJson({ sourceFile: './xlsx/input.xlsx' });

// Output path - NOTE: all paths are from the root.
var outputPath = "./out/";

// These are the sheet names that should be processed - some sheets do not follow the correct formatting so they are excluded.
var sheetsToProcess = [
    "achievementLang",
    "itemLang",
    "powerUpLang",
    "stageLang",
    "weaponLang",
    "characterLang",
    "lang"
];

// Make sure the out folder exists first
if (!fs.existsSync(outputPath)) { fs.mkdirSync(outputPath); }

for (let sectionName in result) {
    // Don't process sheets that shouldn't be...
    if (sheetsToProcess.indexOf(sectionName) < 0) { continue; }
    // Grab data needed to process
    let section = result[sectionName];
    let langs = section[0];
    let numKeys = section.length - 1;
    // Make a clone of the template languages file
    let newJson = JSON.parse(JSON.stringify(langsTemplate));
    // Start iterating to build up export data
    for (let obj in langs) {
        let lang = langs[obj];
        let langKey = obj;
        for (let i = 1; i < numKeys; i++) {
            if (section[i].A.indexOf('{') > -1) {
                let keys = section[i].A.replace('{', '').split('}');
                let group = keys[0];
                let key = keys[1];
                if(!newJson[lang]){
                    console.log(lang)
                    continue;
                }
                if (!newJson[lang].translations[group]) {
                    newJson[lang].translations[group] = {};
                }
                newJson[lang].translations[group][key] = section[i][langKey];
            } else {
                let key = section[i].A;
                newJson[lang].translations[key] = section[i][langKey];
            }
        }
    }
    // Save out to the correct path
    let data = JSON.stringify(newJson, null, 2);
    data = data.replace(/\\\\n/g, "\\n");
    fs.writeFileSync(outputPath + sectionName + '.json', data);
}