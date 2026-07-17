document.getElementById("gameTitle").textContent =
    new Date().toLocaleDateString("de-DE");

    let spieler = ["Leon", "Fabian", "Felix", "Daniel", "Stevo", "Max", "Linus", "Robin", "Mike", "Marvin"];
    const BASE_SPIELER_ANZAHL = 10;
    const aktiv = Array(spieler.length).fill(true);
    const strafen = [
  [
    "Pumpe",
    0.2
  ],
  [
    "Alle 9ne",
    1.0
  ],
  [
    "Kranz",
    5.0
  ],
  [
    "Lust & Frustwurf",
    1.0
  ],
  [
    "Durchwurf",
    0.5
  ],
  [
    "Klinge berühren",
    0.5
  ],
  [
    "Kugel fallen lassen",
    2.0
  ],
  [
    "Spiel verloren",
    2.0
  ],
  [
    "Aufs Maul legen",
    2.0
  ],
  [
    "Randalieren auf der Bahn",
    1.0
  ],
  [
    "Handynutzung",
    1.0
  ],
  [
    "Kugel hat die Bahn verlassen",
    2.0
  ],
  [
    "Kugel gebracht bekommen",
    1.0
  ],
  [
    "Kugel rollt zurück",
    1.0
  ],
  [
    "Zu frühes Werfen",
    1.0
  ],
  [
    "Falsches Kugel bringen",
    1.0
  ],
  [
    "Falsches Aufschreiben",
    0.3
  ],
  [
    "Unberechtigte Diskussion",
    1.0
  ],
  [
    "Glas umwerfen",
    1.0
  ],
  [
    "Glas zerstören",
    2.0
  ],
  [
    "Brechen auf der Bahn",
    20.0
  ],
  [
    "Kegel vergessen",
    5.0
  ],
  [
    "Verspätung je 5 Minuten",
    1.0
  ],
  [
    "Zu spätes Abmelden",
    5.0
  ],
  [
    "Nicht erscheinen",
    20.0
  ]
];

    let guestPlayer = null;


    const clicks = Array.from({length: strafen.length}, () => Array(spieler.length).fill(0));
    let specialTriggers = { "Alle 9ne": 0, "Kranz": 0 };
    let teamCounts = { Marvin: 0, Leon: 0 };

    // Feste Teamzuweisung (Standard; kann leicht angepasst werden)
    const teams = {
      Marvin: [5, 6, 7, 8, 9], // Mike, Stevo, Fabian, Felix, Linus
      Leon: [0, 1, 2, 3, 4]  // Robin, Leon, Max, Marvin, Daniel
    };

    const spielstrafen = [Array(spieler.length).fill(""), Array(spieler.length).fill("")];
    spielstrafen[0][0] = "3.00"; spielstrafen[1][0] = "2.00";
    const spielstrafenLocked = [Array(spieler.length).fill(false), Array(spieler.length).fill(false)];
    const ausstand = Array(spieler.length).fill("");
    const ausstandLocked = Array(spieler.length).fill(false);
    const gezahlt = Array(spieler.length).fill("");
    let history = [];
    const offeneStrafen = Array(spieler.length).fill("");

    const eingabetext = {
    Kegelbahn: Array(spieler.length).fill("")
    };

    const textLocked = {
    Kegelbahn: Array(spieler.length).fill(false)
    };
    
   async function initGame() {

    const gameId = getCurrentGameId();

    if (!gameId)
        return;

    const game = await loadGameFromCloud(gameId);

    if (!game)
        return;

    // Status übernehmen
    GAME_FINISHED = game.status === "finished";

    document.getElementById("gameTitle").textContent = game.title;

    if (game.game_data) {
        applyGameData(game.game_data);
    }
}

initGame();
