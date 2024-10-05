/**
 * Lets appear ode rdisappear the menu of 
 */
function footerToggle() {
  let footerNotice = document.getElementById('navbar');
  footerNotice.classList.toggle('show');
}

/**
 * Appears or disappears the menu. 
 */
function hideFooterMenu() {
  let footerNotice = document.getElementById('navbar');
  footerNotice.classList.remove('show');
}

/**
 * Logs out the current user and link to the log in (index.html) side.
 */
async function logOut() {
  currentUser = [];
  saveCurrentUserOnServer();
  toastMessageLogOut();
  await timeout (750);
  await closeToast();
  window.location.href = "index.html";
}

/**
   * Makes the element saying "Task added to board" appear and disappear after 1 s and 20 ms.
   */
function toastMessageLogOut() {
  let container = document.getElementById('toastMessageLogOut');
  container.classList.remove('d-none');
}

/**
 * Starts a timeout.
 * 
 * @param {Number} ms - Time of timeout
 * @returns {TimeRanges}
 */
function timeout(ms) {
  return new Promise(res => setTimeout(res,ms));
}

/**
 * Hides the toast message box
 */
function closeToast() {
  let container = document.getElementById('toastMessageLogOut'); 
  container.classList.add('d-none');
}  