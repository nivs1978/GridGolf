class Options {
    constructor() {
        this.music = true;
        this.diceSound = true;
        this.sounds = true;
        this.showPwaHelp = true;
        this.playerName = "Player1";

        this.#load()
    }

    #load() {
        let data = localStorage.getItem("options");
        if (data) {
            var options = JSON.parse(data);
            this.music = options.music === true;
            this.diceSound = options.diceSound === true;
            this.sounds = options.sounds === true;
            this.playerName = options.playerName;
        }
    }

    save() {
        localStorage.setItem("options", JSON.stringify(this));
    }
}