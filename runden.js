const spieler=[
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

function openRoundModal() {

    const select = document.getElementById("roundPlayer");

    select.innerHTML = "";

    spieler.forEach(name => {

        const option = document.createElement("option");

        option.value = name;
        option.textContent = name;

        select.appendChild(option);

    });

    document.getElementById("roundReason").value = "";

    document.getElementById("roundDate").value =
        new Date().toISOString().split("T")[0];

    document.getElementById("roundModal").style.display = "block";

}

function closeRoundModal(){

    document.getElementById("roundModal").style.display="none";

}

async function saveRound(){

    const player =
        document.getElementById("roundPlayer").value;

    const reason =
        document.getElementById("roundReason").value.trim();

    const date =
        document.getElementById("roundDate").value;

    if(reason===""){
        alert("Bitte einen Grund eingeben.");
        return;
    }

    const { error } = await supabaseClient
        .from("rounds")
        .insert({

            player: player,

            round_date: date,

            reason: reason,

            status: "offen"

        });

    if(error){

        console.error(error);
        alert(error.message);
        return;

    }

    closeRoundModal();

    await loadRounds();

}

async function finishRound(id){

    if(!confirm("Runde erledigt?"))
        return;

    await supabaseClient
    .from("rounds")
    .update({

        status:"erledigt",

        completed_at:new Date()

    })
    .eq("id",id);

    loadRounds();

}

async function loadRounds() {

    const container = document.getElementById("roundsContainer");

    container.innerHTML = "";

    const counts = [];

    // Alle offenen Runden laden
    for (const player of spieler) {

        const { data, error } = await supabaseClient
            .from("rounds")
            .select("*")
            .eq("player", player)
            .eq("status", "offen")
            .order("round_date");

        if (error) {
            console.error(error);
            continue;
        }

        counts.push({
            player,
            rounds: data || []
        });
    }

    const offeneSpieler = counts
        .filter(p => p.rounds.length > 0)
        .sort((a, b) => b.rounds.length - a.rounds.length);

    if (offeneSpieler.length === 0) {

        container.innerHTML = `
            <div class="empty-rounds">
                <div class="emoji">🍻</div>
                <h2>Ihr Geringverdiener habt<br>keine Runden offen.</h2>
            </div>
        `;

        loadHistory();
        return;
    }

    offeneSpieler.forEach(item => {

        const row = document.createElement("div");
        row.className = "player-row";
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "12px";
        row.style.marginBottom = "14px";
        row.style.flexWrap = "nowrap";

        // Name
        const name = document.createElement("button");
        name.className = "btn";
        name.style.width = "90px";
        name.style.flexShrink = "0";
        name.style.cursor = "default";
        name.innerHTML = `<b>${item.player}</b>`;

        row.appendChild(name);

        // Alle offenen Runden
        item.rounds.forEach(r => {

            const btn = document.createElement("button");

            btn.className = "btn";

            btn.style.display = "flex";
            btn.style.flexDirection = "column";
            btn.style.alignItems = "center";
            btn.style.justifyContent = "center";
            btn.style.width = "120px";
            btn.style.flexShrink = "0";
            btn.style.padding = "12px";

            btn.innerHTML = `
                <div style="font-size:22px;">🍺</div>
                <div style="font-weight:700;margin-top:4px;">
                    ${r.reason}
                </div>
                <div style="font-size:12px;color:#777;margin-top:4px;">
                    ${new Date(r.round_date).toLocaleDateString("de-DE")}
                </div>
            `;

            btn.onclick = () => finishRound(r.id);

            row.appendChild(btn);

        });

        container.appendChild(row);

    });

    loadHistory();

}


async function loadHistory(){

    const container=
        document.getElementById("historyContainer");

    const {data}=await supabaseClient
    .from("rounds")
    .select("*")
    .eq("status","erledigt")
    .order("completed_at",
        {ascending:false});

    container.innerHTML="";

    data.forEach(r => {

    const row = document.createElement("div");

    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.marginBottom = "12px";

    const player = document.createElement("div");

    player.style.width = "90px";
    player.style.fontWeight = "700";
    player.textContent = r.player;

    row.appendChild(player);

    const reason = document.createElement("button");

    reason.className = "btn";

    reason.style.padding = "8px 14px";

    reason.innerHTML = `
        🍺 ${r.reason}<br>
        <small>${new Date(r.round_date).toLocaleDateString("de-DE")}</small>
    `;

    row.appendChild(reason);

    const done = document.createElement("div");

    done.style.marginLeft = "10px";
    done.style.color = "#0b8f43";
    done.style.fontWeight = "bold";
    done.innerHTML = "✅";

    row.appendChild(done);

    container.appendChild(row);

});

}

loadRounds();