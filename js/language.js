class Language {
    constructor(lang) {
        var __construct = function (){
            if (eval('typeof ' + lang) == 'undefined'){
                lang = "en";
            }
            return;
        };
        this.getStr = function (str){
            var retStr = eval('eval(lang).' + str);
            if (typeof retStr != 'undefined'){
                return retStr;
            } else {
                return str;
            }
        };
    }
}

var en = {
    NewGame:"New game.",
    Settings:"Settings",
    Help: "Help",
    Name: "Name",
    Music: "Music",
    DiceSound: "Dice sound",
    Sounds: "Sounds",
    Save: "Save",
    HelpText1: "The golf board game where the dice determine the length of your shot, and you control the direction.",
    HelpText2: "After rolling the dice, choose the destination of the golf ball. You start at the tee and, for each shot, move the ball either straight or diagonally a number of tiles equal to the roll. Different surfaces apply bonuses or penalties to determine the final distance. If the final distance is 0 or less, you miss the ball, and it still counts as a shot. Water and forest tiles are invalid and cannot be landed on. The green sourounding the flag also give your the option of a short 1 tile safe shot.",
    HelpText3: "The goal is to reach the golf hole, marked by the flag, in the fewest number of shots.",
    Close: "Close",
    InstallPwaHeadline: "How to install the game as an app",
    InstallPwaHTextIos: 'Click the share button (<img src="help/apple_share.svg" style="width:2vh" />) and select <b>Add to home screen</b>. Finally click <b>Add</b> in the upper right corner.',
    InstallPwaHTextAndroid: 'Click the menu button (<img src="help/android_menu.svg" style="width:2vh" />) in the upper right corner, scroll down and select <b>Install app</b> or <b>Add to homescreen</b> depending on your browser. Then click the <b>Install</b> button.',
    Editor: "Back to editor",
    NextHole: "Next hole",
    AbandonGame: "Abandon game",
    Hole: "Hole",
    Stroke: "Stroke",
    Strokes: "Strokes",
    Total: "Total"
};

var da = {
    NewGame: "Nyt spil.",
    Settings: "Indstillinger",
    Help: "Hjælp",
    Name: "Navn",
    Music: "Musik",
    DiceSound: "Terningelyd",
    Sounds: "Lyde",
    Save: "Gem",
    HelpText1: "Golf brætspillet hvor terningen bestemmer længden af dit slag, og du styrer retningen.",
    HelpText2: "Efter at have kastet terningen, vælger du destinationen for golfbolden. Du starter ved tee og for hvert slag flytter du bolden enten lige eller diagonalt et antal felter svarende til terningen. Forskellige overflader giver bonusser eller strafpoint, som bestemmer den endelige afstand. Hvis den endelige afstand er 0 eller mindre, misser du bolden, og det tæller stadig som et slag. Vand og skovfelter er ugyldige og kan ikke landes på. Green området omkring flaget giver dig også mulighed for et sikkert slag på 1 felt.",
    HelpText3: "Målet er at nå golfhullet, markeret med flaget, på færrest mulige slag.",
    Close: "Luk",
    InstallPwaHeadline: "Sådan installeres spillet som en app",
    InstallPwaHTextIos: 'Klik på delingsknappen (<img src="help/apple_share.svg" style="width:2vh" />) og vælg <b>Føj til hjemmeskærm</b>. Klik til sidst på <b>Tilføj</b> i øverste højre hjørne.',
    InstallPwaHTextAndroid: 'Klik på menuknappen (<img src="help/android_menu.svg" style="width:2vh" />) i øverste højre hjørne, scroll ned og vælg <b>Installer app</b> eller <b>Tilføj til startsskærm</b> afhængigt af din browser. Klik derefter på <b>Installer</b> knappen.',
    Editor: "Tilbage til redigering",
    NextHole: "Næste hul",
    AbandonGame: "Afslut spil",
    Hole: "Hul",
    Stroke: "Slag",
    Strokes: "Slag",
    Total: "I alt"
};
