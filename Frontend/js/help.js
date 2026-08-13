/**
 * Loads initials in sidebar.
 */
async function initHelp() {
    await getCurrentUserIdFromServer();
    await setUserInitialsAtHeader();
}