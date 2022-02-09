# vampire-survivors-localisation
This tooling is used to automate converting .xlsx localisation to in-game compatible .json files for the game Vampire Survivors.

<br>

## Usage

<br>

- **Firstly, clone the repo and run:**
    ``` sh
    npm install
    ```
<br>

<br>

- **Download the public localisation file as .xlsl:**    
    https://docs.google.com/spreadsheets/d/1niekzGKaM08M9oYP0wLqHYg5WU7h1iy3nLJL1XGDdJM
<br>

- **Before running the conversion, please ensure you have placed the public loaclisation file into the correct path:**
    - You should locate the following directory `./xlsx/` (or create it if not present) 
    - Then place the loacalisation file into this directory using the required filename: `input.xlsx`
    
<br>

- **If you need to add a new language, please check the `./langs/langs.json` template file and add the appropriate section for your new language including the correct locale code and name.**

<br>

- **Once this is all setup, simply run the conversion using the following command:**
    ``` sh
    npm run convert-lang
    ```
<br>

- **You will now have an output folder at `./out/` which contains the converted .json files that are able to be used directly in the game.**