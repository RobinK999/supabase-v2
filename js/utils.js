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

function showSyncStatus(text, color="#0b8f43") {

    const el = document.getElementById("syncStatus");

    if(!el)
        return;

    el.textContent = text;

    el.style.color = color;

}