function getGameData() {
   return {
        spieler,
        clicks,
        aktiv,
        eingabetext,
        textLocked,
        spielstrafen,
        spielstrafenLocked,
        ausstand,
        ausstandLocked,
        gezahlt,
        offeneStrafen,
        specialTriggers,
        teamCounts,
        guestPlayer: guestPlayer,
    };
}

function resetGameData() {

    clicks.forEach(row => row.fill(0));

    aktiv.fill(true);

    ausstand.fill(0);
    gezahlt.fill(0);
    offeneStrafen.fill(0);

    ausstandLocked.fill(false);

    

   

    spielstrafen.forEach(row => row.fill(""));
    spielstrafenLocked.forEach(row => row.fill(false));

    specialTriggers = {
        alle9: 0,
        kranz: 0
    };

    teamCounts = {
        Marvin: 0,
        Leon: 0
    };

}

function applyGameData(data) {
     if (data.spieler && Array.isArray(data.spieler)) {
        spieler = [...data.spieler];
    }

    aktiv.length = spieler.length;
    ausstand.length = spieler.length;
    ausstandLocked.length = spieler.length;
    gezahlt.length = spieler.length;
    offeneStrafen.length = spieler.length;
    guestPlayer = data.guestPlayer || null;

   



    spielstrafen.forEach(r => r.length = spieler.length);
    spielstrafenLocked.forEach(r => r.length = spieler.length);

    clicks.forEach(r => r.length = spieler.length);

    Object.assign(clicks, data.clicks);
    Object.assign(eingabetext, data.eingabetext);
    Object.assign(textLocked, data.textLocked);
    Object.assign(spielstrafen, data.spielstrafen);
    Object.assign(spielstrafenLocked, data.spielstrafenLocked);
    Object.assign(ausstand, data.ausstand);
    Object.assign(ausstandLocked, data.ausstandLocked);
    Object.assign(gezahlt, data.gezahlt);

    if (data.offeneStrafen)
        Object.assign(offeneStrafen, data.offeneStrafen);

    if (data.specialTriggers)
        specialTriggers = data.specialTriggers;

    if (data.teamCounts)
        teamCounts = data.teamCounts;

    if (Array.isArray(data.aktiv)) {
    data.aktiv.forEach((v, i) => aktiv[i] = v);
}

    updateTeamZaehler();
    render();
}

function setGameData(data) {
    applyGameData(data);
}
