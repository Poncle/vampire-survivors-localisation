const fs = require('fs');
const wget = require('node-wget');

let inputPath = './xlsx/'
// Make sure the input folder exists first
if (!fs.existsSync(inputPath)) { fs.mkdirSync(inputPath); }
const spreadsheetLink = 'https://docs.google.com/spreadsheets/d/1niekzGKaM08M9oYP0wLqHYg5WU7h1iy3nLJL1XGDdJM/export?format=xlsx';

wget({
    url: spreadsheetLink,
    dest: inputPath + 'Original.xlsx'
}, () => {
    const timeoutForDownload = 5000;
    // beacuase of node-wget wirtes file with createWriteStream,
    setTimeout(() => {
        const excelToJson = require('convert-excel-to-json');
        const langsTemplate = require('./langs/langs.json');
        const result = excelToJson({ sourceFile: './xlsx/input.xlsx'});

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
            if (sheetsToProcess.indexOf(sectionName) < 0) {
                continue;
            }
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
                for (let i = 1; i <= numKeys; i++) {
                    if (section[i].A.indexOf('{') > -1) {
                        let keys = section[i].A.replace('{', '').split('}');
                        let group = keys[0];
                        let key = keys[1];
                        if (!newJson[lang]) {
                            continue;
                        }
                        if (!newJson[lang].translations[group]) {
                            newJson[lang].translations[group] = {};
                        }
                        newJson[lang].translations[group][key] = section[i][langKey];
                    } else {
                        let key = section[i].A;
                        if (newJson[lang]) {
                            newJson[lang].translations[key] = section[i][langKey];
                        }
                    }
                }
            }
            // Save out to the correct path
            let data = JSON.stringify(newJson, null, 2);
            data = data.replace(/\\\\n/g, "\\n");
            fs.writeFileSync(outputPath + sectionName + '.json', data);
        }
    }, timeoutForDownload)
})
