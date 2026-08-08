// =========================
// Cone Club – Zugriffsschutz
// =========================

let USER_LOGGED_IN =
    localStorage.getItem("coneClubLoggedIn") === "true";

function isUserLoggedIn() {
    return USER_LOGGED_IN;
}

function setLoggedIn(value) {

    USER_LOGGED_IN = value;

    if (value) {
        localStorage.setItem("coneClubLoggedIn", "true");
    } else {
        localStorage.removeItem("coneClubLoggedIn");
    }

    updateAccessUI();
}

function logoutUser() {

    setLoggedIn(false);

    alert("Du bist abgemeldet.");
}

function updateAccessUI() {

    document.body.classList.toggle(
        "readonly-mode",
        !USER_LOGGED_IN
    );

    const loginButton =
        document.getElementById("loginButton");

    if (loginButton) {

       if (USER_LOGGED_IN) {
    loginButton.textContent = "✓ Abmelden";
    loginButton.onclick = logoutUser;
} else {
    loginButton.textContent = "Anmelden";
    loginButton.onclick = openLoginModal;
}

    }
}

function requireLogin() {

    if (USER_LOGGED_IN) {
        return true;
    }

    alert("Bitte zuerst anmelden.");
    return false;
}


// =========================
// Klickschutz
// =========================




// Beim Laden Zustand anwenden
document.addEventListener("DOMContentLoaded", function() {
    updateAccessUI();
});