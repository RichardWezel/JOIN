/**
 * Input-element "mail"
 */
let mail = document.getElementById("mail");

/**
 * Input-element "password"
 */
let password = document.getElementById("password");

/**
 * Logs in via the backend with the entered email/password.
 * By not matching appears the message "E-Mail or Password not exist".
 */
async function handleLogIn() {
  try {
    await loginUser(mail.value, password.value);
    window.location.href = "summary.html";
  } catch (e) {
    showToastMessage_UserOrMailNotExist();
  }
}

/* Guest Login */

/**
 * Logs in as the shared guest account.
 */
async function handleGuestLogIn() {
  await guestLogin();
  window.location.href = "summary.html";
}

/* Toast Message */

/**
 * Shows the toast message "E-Mail or Password not exist" for 3 seconds.
 */
async function showToastMessage_UserOrMailNotExist() {
  // mail.value = '';
  // password.value = '';
  await openToastMessageIndex();
  await timeout(3000);
  await closeToast();
}

/**
 * Makes the element saying "E-Mail or Password not exist" appear.
 */
function openToastMessageIndex() {
  let container = document.getElementById("toastMessage_Index");
  container.classList.remove("d-none");
}

/**
 * Starts a timeout.
 *
 * @param {Number} ms - Time of timeout
 * @returns {TimeRanges}
 */
function timeout(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Hides the toast message box saying "E-Mail or Password not exist"
 */
function closeToast() {
  let container = document.getElementById("toastMessage_Index");
  container.classList.add("d-none");
}
