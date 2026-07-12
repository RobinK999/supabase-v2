let GAME_FINISHED = false;

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

    const hasChanges =
        gameData.clicks.flat().some(v => v > 0) ||
        gameData.eingabetext.Kegelbahn.some(v => v) ||
        gameData.eingabetext.Runden.some(v => v);

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

await saveGameToCloud();

showSyncStatus("🔒 Abgeschlossen");

render();
}