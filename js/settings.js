class Settings {
    constructor() {
        this.music = true;
        this.diceSound = true;
        this.sounds = true;
        this.showPwaHelp = true;
        this.playerName = "Player1";
        this.#load()
    }

    #load() {
        let data = localStorage.getItem("settings");
        if (data) {
            var settings = JSON.parse(data);
            this.music = settings.music === true;
            this.diceSound = settings.diceSound === true;
            this.sounds = settings.sounds === true;
            this.playerName = settings.playerName;
        }
    }

    save() {
        localStorage.setItem("settings", JSON.stringify(this));
    }
}