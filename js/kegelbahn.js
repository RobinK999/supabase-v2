const spieler = [
"Leon",
"Fabian",
"Felix",
"Daniel",
"Stevo",
"Max",
"Linus",
"Robin",
"Mike",
"Marvin"
];

let currentGame = null;

async function loadKegelbahn() {

    const container =
        document.getElementById("kegelbahnContainer");

    container.innerHTML = "";

    const { data, error } = await supabaseClient
    .from("games")
    .select("*");

if (error) {
    console.error(error);
    return;
}

const heute = new Date();
heute.setHours(0, 0, 0, 0);

data.sort((a, b) => {

    const da = new Date(a.title.split(".").reverse().join("-"));
    const db = new Date(b.title.split(".").reverse().join("-"));

    return da - db;

});

    data.forEach(game => {

       const row = document.createElement("div");

row.style.display = "flex";
row.style.alignItems = "center";
row.style.gap = "14px";
row.style.marginBottom = "14px";

        const date = document.createElement("button");

        date.className = "btn";

        date.style.width = "160px";
date.style.cursor = "default";
date.style.flexShrink = "0";

        date.style.cursor = "default";

        date.innerHTML = game.title;

        row.appendChild(date);

        const payer = document.createElement("button");

        payer.className = "btn";

        payer.style.width = "180px";
payer.style.flexShrink = "0";

        
        const spielDatum = new Date(
    game.title.split(".").reverse().join("-")
);

spielDatum.setHours(0,0,0,0);

const vergangen = spielDatum < heute;

const zahler = game.game_data?.lanePayer;

if (zahler) {

    payer.innerHTML = zahler;

    if (vergangen) {
        payer.innerHTML += " ✅";
    }

} else {

    payer.innerHTML = "➕";

}

        payer.onclick = () =>
            openPayerModal(game);

        row.appendChild(payer);

        container.appendChild(row);

    });

}

function openPayerModal(game){

    currentGame = game;

    const div =
        document.getElementById("payerButtons");

    div.innerHTML = "";

    spieler.forEach(name=>{

        const b=document.createElement("button");

        b.className="btn";

        b.style.display="block";

        b.style.marginBottom="8px";

        b.style.width="100%";

        b.innerHTML=name;

        b.onclick=()=>savePayer(name);

        div.appendChild(b);

    });

    document.getElementById("payerModal").style.display="block";

}

function closePayerModal(){

    document.getElementById("payerModal").style.display="none";

}

async function savePayer(name){

    const gameData =
        currentGame.game_data || {};

    gameData.lanePayer = name;

    await supabaseClient

        .from("games")

        .update({

            game_data: gameData

        })

        .eq("id",currentGame.id);

    closePayerModal();

    loadKegelbahn();

}

loadKegelbahn();
