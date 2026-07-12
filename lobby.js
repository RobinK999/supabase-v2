const season2026 = [
    "2026-01-26",
    "2026-02-23",
    "2026-03-23",
    "2026-04-20",
    "2026-05-18",
    "2026-06-15",
    "2026-07-13",
    "2026-08-10",
    "2026-09-07",
    "2026-10-05",
    "2026-11-02",
    "2026-11-30",
    "2026-12-28"
];

async function createSeason2026() {

    for (const date of season2026) {

        const { data } = await supabaseClient
            .from("games")
            .select("id")
            .eq("date", date);

        if (data.length > 0)
            continue;

        await supabaseClient
         .from("games")
         .insert({

             title: formatGermanDate(date),

             date: date,

             special: false,

             status: "new",

             join_code: generateJoinCode(),

             game_data: {}

    });

    }

}

function formatGermanDate(date) {

    return new Date(date)
        .toLocaleDateString("de-DE");

}

function generateJoinCode() {

    return Math.random()
        .toString(36)
        .substring(2,8)
        .toUpperCase();

}

async function loadGames() {

    const { data, error } = await supabaseClient
        .from("games")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    renderGames(data);
}

function renderGames(games) {

    const seasonContainer =
        document.getElementById("season-games");

    const specialContainer =
        document.getElementById("special-games");

    seasonContainer.innerHTML = "";
    specialContainer.innerHTML = "";

    games
        .sort((a,b)=>new Date(a.date)-new Date(b.date))
        .forEach(game=>{

            const card = createGameCard(game);

            if(game.special){

                specialContainer.appendChild(card);

            }else{

                seasonContainer.appendChild(card);

            }

        });

}

function createGameCard(game) {

    const card = document.createElement("div");
    card.className = "game-card";

    let statusClass = "status-new";
let statusText = "Nicht begonnen";

if(game.status==="active"){
    statusClass="status-active";
    statusText="In Bearbeitung";
}

if(game.status==="finished"){
    statusClass="status-finished";
    statusText="Abgeschlossen";
}

    if (game.status === "active")
        statusText = "🟡 In Bearbeitung";

    if (game.status === "finished")
        statusText = "🔴 Abgeschlossen";

    if (game.special)
        statusText = "⭐ Spezial-Kegeln";

    card.innerHTML = `
<div class="card-icon">
    ${game.special ? "⭐" : "🎳"}
</div>

<h2>${game.title}</h2>

<div class="status ${statusClass}">
    ${statusText}
</div>
`;

    card.onclick = () => {


    
        window.location.href =
        `game.html?id=${game.id}`;

};

return card;
}

async function initLobby() {

    await createSeason2026();

    await loadGames();

}

initLobby();

