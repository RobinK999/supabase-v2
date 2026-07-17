function getCurrentGameId() {

    const params = new URLSearchParams(window.location.search);

    return params.get("id");

}
const SUPABASE_URL = "https://suexrrdsujyejfqvcnep.supabase.co";
const SUPABASE_KEY = "sb_publishable_6n8gNTrQ12VR6xbvdTwn5w_gsPfltOj";
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function testSupabase() { 
    const { data, error } = await supabaseClient
        .from("games")
        .select("*");

    if (error) {
        console.error(error);
    } else {
       
    }
}

async function saveGameToCloud() {

    const gameId = getCurrentGameId();
    const gameData = getGameData();

    // Hat sich im Spiel etwas geändert?
    const hasChanges =
        gameData.clicks.flat().some(v => v > 0);

    // Status NICHT überschreiben, wenn Feierabend
    let status;

    if (GAME_FINISHED) {
        status = "finished";
    } else {
        status = hasChanges ? "active" : "new";
    }

    const { data: result, error } = await supabaseClient
        .from("games")
        .update({
            game_data: gameData,
            status: status
        })
        .eq("id", gameId)
        .select();

    if (error) {
        console.error(error);
        showSyncStatus("❌ Fehler", "#d32f2f");
    } else {
        showSyncStatus("☁️ Synchronisiert", "#0b8f43");
    }
}

async function loadGameFromCloud(gameId){

    const { data, error } =
        await supabaseClient
            .from("games")
            .select("*")
            .eq("id", gameId)
            .single();

    if(error){

        console.error(error);

        return null;

    }

    return data;

}

async function finishGame() {

    if (!confirm("Kegelabend wirklich abschließen?\nDanach kann nichts mehr geändert werden.")) {
        return;
    }

    const gameId = getCurrentGameId();

    const { data, error } = await supabaseClient
        .from("games")
        .update({
            status: "finished",
            game_data: getGameData()
        })
        .eq("id", gameId)
        .select();

    if (error) {
        console.error(error);
        alert("Fehler beim Abschließen.");
        return;
    }

    GAME_FINISHED = true;
// Offene Beträge in payments speichern
const rows = [];

const summen = spieler.map((_, j) =>
    strafen.reduce((s, [_, b], i) => s + clicks[i][j] * b, 0)
);

spieler.forEach((_, i) => {

    const beitrag = (spieler[i] === guestPlayer) ? 0 : 15;
    const ausstandWert = ausstand[i] === "2.50" ? 2.5 : 0;

    let extra = 0;

    if (i === pumpenkoenig)
        extra += 5;

    if (i === platz2)
        extra += 2;

    const spielstrafe = spielstrafen.reduce(
        (sum, r) => sum + (parseFloat(r[i]) || 0),
        0
    );

    const offen = parseFloat(offeneStrafen[i]) || 0;

    const gesamt =
        summen[i] +
        beitrag +
        ausstandWert +
        spielstrafe +
        offen +
        extra;

    rows.push({
        game_id: gameId,
        player_name: spieler[i],
        amount: gesamt,
        paid: gesamt <= 0
    });

});

const { error: paymentError } = await supabaseClient
    .from("payments")
    .insert(rows);

if (paymentError) {
    console.error(paymentError);
}
await saveGameToCloud();

showSyncStatus("🔒 Abgeschlossen");

render();
}

async function savePayments(gameId, gameData) {

    // Alte Einträge dieses Spiels löschen (Sicherheit)
    await supabaseClient
        .from("payments")
        .delete()
        .eq("game_id", gameId);

    const rows = [];

    gameData.spieler.forEach((name, i) => {

        const betrag = parseFloat(gameData.gesamtsumme[i]) || 0;

        rows.push({
            game_id: gameId,
            player_name: name,
            amount: betrag,
            paid: betrag <= 0
        });

    });

    const { error } = await supabaseClient
        .from("payments")
        .insert(rows);

    if (error) {
        console.error(error);
        throw error;
    }
}

let GAME_FINISHED = false;