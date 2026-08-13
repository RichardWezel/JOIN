/**
 * Link to the last side visited before.
 */
function back() {
    window.history.back();
}

/**
 * Link to the main contact list in the mobile version.
 */
function backMobile() {
    if (window.innerWidth <= 1000) {
        window.location.href = "contacts.html";
    }
}