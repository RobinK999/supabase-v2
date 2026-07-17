function getGameData() {
   const pumpeIndex = 0;

// Pumpenkönig berechnen
let pumpenkoenig = -1;
let maxPumpe = -1;

spieler.forEach((_, i) => {

    if (i >= BASE_SPIELER_ANZAHL) return;

    if (clicks[pumpeIndex][i] > maxPumpe) {
        maxPumpe = clicks[pumpeIndex][i];
        pumpenkoenig = i;
    }

});

// Zwischenbilanz
const summen = spieler.map((_, j) =>
    strafen.reduce((sum, [_, betrag], i) =>
        sum + clicks[i][j] * betrag, 0)
);

// Ranking berechnen
const gesamtBasis = spieler.map((_, i) => {

    const strafe = summen[i];
    const beitrag = (spieler[i] === guestPlayer) ? 0 : 15;
    const ausstandWert = ausstand[i] === "2.50" ? 2.5 : 0;
    const spielstrafe = spielstrafen.reduce(
        (sum, r) => sum + (parseFloat(r[i]) || 0),
        0
    );

    const offen = parseFloat(offeneStrafen[i]) || 0;

    return strafe + beitrag + ausstandWert + spielstrafe;

});

const rankingAktiv = gesamtBasis
    .map((wert, index) => ({ index, wert }))
    .filter(o =>
        aktiv[o.index] &&
        o.index < BASE_SPIELER_ANZAHL
    )
    .sort((a, b) => a.wert - b.wert);

const platz2 = rankingAktiv[1]?.index ?? -1;

// Durchschnitt aktiver Spieler
const aktiveIndices = spieler
    .map((_, i) => i)
    .filter(i => aktiv[i]);

const gesamtAktive = aktiveIndices.map(i => {

    const strafe = summen[i];
    const beitrag = (spieler[i] === guestPlayer) ? 0 : 15;
    const ausstandWert = ausstand[i] === "2.50" ? 2.5 : 0;

    let extra = 0;
    if (i === pumpenkoenig) extra += 5;
    else if (i === platz2) extra += 2;

    const spielstrafe = spielstrafen.reduce(
        (sum, r) => sum + (parseFloat(r[i]) || 0),
        0
    );

    const offen = parseFloat(offeneStrafen[i]) || 0;

    return strafe + beitrag + ausstandWert + spielstrafe + extra;

});

const durchschnittAktiv =
    gesamtAktive.length
        ? gesamtAktive.reduce((a, b) => a + b, 0) / gesamtAktive.length
        : 0;

// Gesamtstrafen speichern
const gesamtstrafen = spieler.map((_, i) => {

    const strafe = summen[i];
    const beitrag = (spieler[i] === guestPlayer) ? 0 : 15;
    const ausstandWert = ausstand[i] === "2.50" ? 2.5 : 0;

    let extra = 0;
    if (i === pumpenkoenig) extra += 5;
    else if (i === platz2) extra += 2;

    const spielstrafe = spielstrafen.reduce(
        (sum, r) => sum + (parseFloat(r[i]) || 0),
        0
    );

    const offen = parseFloat(offeneStrafen[i]) || 0;

    const gesamt =
        strafe +
        beitrag +
        ausstandWert +
        spielstrafe +
        offen +
        extra;

    return aktiv[i]
    ? Math.round(gesamt)
    : Math.round(durchschnittAktiv);

});

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
        gesamtstrafen,
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