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
  clearAuthToken();
  toastMessageLogOut();
  await timeout (750);
  await closeLogoutToast();
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
 * Hides the toast message box
 */
function closeLogoutToast() {
  let container = document.getElementById('toastMessageLogOut'); 
  container.classList.add('d-none');
}  