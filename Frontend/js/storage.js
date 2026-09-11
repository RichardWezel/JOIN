// ***** shared view helpers ***** //

/**
 * Escapes user supplied text so the browser renders it as characters
 * instead of markup. Use it for every value that goes into innerHTML.
 *
 * @param {String} value - raw text coming from the API.
 * @returns {String} - the same text, safe to embed in HTML.
 */
function escapeHtml(value) {
  const element = document.createElement('div');
  element.textContent = value ?? '';
  return element.innerHTML;
}

/**
 * Returns a colour only when it is a plain hex value. escapeHtml does not
 * escape quotes, so an unchecked colour could break out of a style attribute.
 *
 * @param {String} value - colour coming from the API.
 * @returns {String} - the colour, or the server side default.
 */
function safeColor(value) {
  return /^#[0-9a-fA-F]{3,8}$/.test(value ?? '') ? value : '#FFC700';
}

/**
 * Resolves after the given number of milliseconds. Shared by every page,
 * so it lives here instead of being copied into each script.
 *
 * @param {Number} ms - Time to wait.
 * @returns {Promise<void>}
 */
function timeout(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// ***** low level API helpers ***** //

const TOKEN_KEY = 'join_token';

/**
 * Retrieves the authentication token from localStorage.
 * @returns {String|null} - The authentication token or null if not found.
 */
function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Sets the authentication token in localStorage.
 * @param {String|null} token - The authentication token or null to remove it.
 */
function setAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Removes the authentication token from localStorage.
 */
function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Calls the Join API and returns the parsed JSON body.
 * Adds the auth token automatically when one is stored.
 *
 * @param {String} path - path relative to API_BASE_URL, e.g. '/tasks/'
 * @param {Object} options - fetch options (method, body as plain object)
 */
async function apiRequest(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (response.status === 204) {
    return null;
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error('API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

/**
 * Small localStorage-backed key/value shim, used for purely client-side
 * UI flags (e.g. which column a new task should land in) that never
 * needed to live on a server.
 */
async function setItem(key, value) {
  const serialized = JSON.stringify(value);
  localStorage.setItem(key, serialized === undefined ? 'null' : serialized);
}

async function getItem(key) {
  const raw = localStorage.getItem(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}


// ***** date format helpers ***** //

/**
 * Converts an ISO date (yyyy-mm-dd, as used by the backend and <input type="date">)
 * to the dd/mm/yy format used throughout the existing frontend code.
 */
function isoDateToLegacy(isoDate) {
  if (!isoDate) return '';
  let [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year.slice(2)}`;
}

/**
 * Converts a dd/mm/yy date (used throughout the frontend) to ISO yyyy-mm-dd.
 */
function legacyDateToIso(legacyDate) {
  if (!legacyDate) return '';
  let [day, month, year] = legacyDate.split('/');
  return `20${year}-${month}-${day}`;
}


// ***** contacts ***** //

/**
 * Main contact storage for the program, in the legacy shape the UI code expects:
 * { id, name: { firstName, secondName, color }, mail, phone }
 */
let contacts_global = [];

/**
 * Maps a contact object from the API shape to the legacy contact shape.
 * @param {Object} contact - The contact object from the API.
 * @returns {Object} - The mapped contact object.
 */
function mapContactFromApi(contact) {
  return {
    id: contact.id,
    name: {
      firstName: contact.first_name,
      secondName: contact.last_name,
      color: contact.color,
    },
    mail: contact.email,
    phone: contact.phone,
  };
}

/**
 * Maps a contact object from the legacy shape to the API shape.
 * @param {Object} contact - The contact object in the legacy shape.
 * @returns {Object} - The mapped contact object for the API.
 */
function mapContactToApi(contact) {
  return {
    first_name: contact.firstName,
    last_name: contact.secondName || '',
    email: contact.mail || '',
    phone: contact.phone || '',
    color: contact.color,
  };
}

/**
 * Fetches all contacts from the server and updates the contacts_global variable.
 */
async function getContactsFromServer() {
  try {
    const data = await apiRequest('/contacts/');
    contacts_global = data.map(mapContactFromApi);
    sortContacts();
  } catch (e) {
    console.warn('Could not load contacts!');
  }
}

/**
 * Sorts the contacts_global array alphabetically by first name.
 */
function sortContacts() {
  contacts_global.sort((a, b) => {
    const firstNameA = a.name.firstName.toLowerCase();
    const firstNameB = b.name.firstName.toLowerCase();
    if (firstNameA < firstNameB) return -1;
    if (firstNameA > firstNameB) return 1;
    return 0;
  });
}

/**
 * Creates a new contact on the server.
 * @param {Object} contact - The contact object to create.
 * @returns {Promise} - A promise resolving to the result of the API request.
 */
async function createContactOnServer(contact) {
  return apiRequest('/contacts/', { method: 'POST', body: mapContactToApi(contact) });
}

/**
 * Updates a contact on the server.
 * @param {string} id - The ID of the contact to update.
 * @param {Object} contact - The updated contact object.
 * @returns {Promise} - A promise resolving to the result of the API request.
 */
async function updateContactOnServer(id, contact) {
  return apiRequest(`/contacts/${id}/`, { method: 'PATCH', body: mapContactToApi(contact) });
}

/**
 * Deletes a contact from the server by its ID.
 * @param {string} id - The ID of the contact to delete.
 * @returns {Promise} - A promise resolving to the result of the API request.
 */
async function deleteContactOnServerById(id) {
  return apiRequest(`/contacts/${id}/`, { method: 'DELETE' });
}


// ***** tasks ***** //

/**
 * Main task storage for the program, in the legacy shape the UI code expects.
 *
 * @type {Array}
 */
let tasks = [];

function getTaskById(id) {
  return tasks.find((task) => task.id === id);
}

/**
 * Maps a task object from the API to the legacy task shape.
 * @param {Object} task - The task object from the API.
 * @returns {Object} - The mapped task object.
 */
function mapTaskFromApi(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    category: task.category,
    dueDate: isoDateToLegacy(task.due_date),
    priority: task.priority,
    status: task.status,
    contacts: task.contacts_detail.map((contact) => ({
      firstName: contact.first_name,
      secondName: contact.last_name,
      color: contact.color,
    })),
    subtasks: task.subtasks.map((subtask) => ({
      id: subtask.id,
      name: subtask.title,
      done: subtask.done,
    })),
  };
}

/**
 * Resolves the {firstName, secondName} contact copies used throughout the
 * frontend back to the real contact ids the backend needs.
 */
function resolveContactIds(taskContacts) {
  return (taskContacts || [])
    .map((contact) => {
      const match = contacts_global.find(
        (c) => c.name.firstName === contact.firstName && c.name.secondName === contact.secondName
      );
      return match ? match.id : null;
    })
    .filter((id) => id !== null);
}

/**
 * Maps a task object to the API shape.
 * @param {Object} task - The task object to map.
 * @returns {Object} - The mapped task object.
 */
function mapTaskToApi(task) {
  return {
    title: task.title,
    description: task.description,
    category: task.category,
    due_date: legacyDateToIso(task.dueDate),
    priority: task.priority,
    status: task.status,
    contacts: resolveContactIds(task.contacts),
    subtasks: (task.subtasks || []).map((subtask) => ({
      title: subtask.name,
      done: !!subtask.done,
    })),
  };
}

/**
 * Fetches all tasks from the server and updates the tasks variable.
 */
async function getTasksFromServer() {
  try {
    const data = await apiRequest('/tasks/');
    tasks = data.map(mapTaskFromApi);
  } catch (e) {
    console.warn('Could not load tasks!');
  }
}

/**
 * Creates a new task on the server.
 * @param {Object} task - The task object to create.
 * @returns {Promise} - A promise resolving to the result of the API request.
 */
async function createTaskOnServer(task) {
  return apiRequest('/tasks/', { method: 'POST', body: mapTaskToApi(task) });
}

/**
 * Updates a task on the server.
 * @param {string} id - The ID of the task to update.
 * @param {Object} task - The updated task object.
 * @returns {Promise} - A promise resolving to the result of the API request.
 */
async function updateTaskOnServer(id, task) {
  return apiRequest(`/tasks/${id}/`, { method: 'PATCH', body: mapTaskToApi(task) });
}

/**
 * Deletes a task from the server by its ID.
 * @param {string} id - The ID of the task to delete.
 * @returns {Promise} - A promise resolving to the result of the API request.
 */
async function deleteTaskOnServerById(id) {
  return apiRequest(`/tasks/${id}/`, { method: 'DELETE' });
}

/**
 * Patches the status of a task on the server.
 * @param {string} id - The ID of the task to patch.
 * @param {string} status - The new status of the task.
 * @returns {Promise} - A promise resolving to the result of the API request.
 */
async function patchTaskStatus(id, status) {
  return apiRequest(`/tasks/${id}/`, { method: 'PATCH', body: { status } });
}

/**
 * Toggles the completion status of a subtask on the server.
 * @param {string} subtaskId - The ID of the subtask to toggle.
 * @param {boolean} done - The new completion status of the subtask.
 * @returns {Promise} - A promise resolving to the result of the API request.
 */
async function toggleSubtaskOnServer(subtaskId, done) {
  return apiRequest(`/tasks/subtasks/${subtaskId}/`, { method: 'PATCH', body: { done } });
}


// ***** auth / current user ***** //

/**
 * Contains the currently logged in user, in legacy shape:
 * { id, name: { firstName, secondName, color }, mail } or [] when logged out.
 */
let currentUser = [];

/**
 * Raw current-user payload returned by the API. This stores the complete
 * user JSON from the backend so the frontend can reuse it without another
 * /auth/me/ fetch in every page.
 */
let currentUserProfile = null;

/**
 * Id of the contact (in contacts_global) representing the current user, or 999 for guests.
 */
let currentUserId = '';

/**
 * Maps a user object to the legacy current user shape.
 * @param {Object} user - The user object to map.
 * @returns {Object} - The mapped user object.
 */
function mapUserToLegacyCurrentUser(user) {
  return {
    id: user.id,
    name: { 
      firstName: user.first_name, 
      secondName: user.last_name, 
      color: user.color 
    },
    mail: user.email,
  };
}

/**
 * Saves the API user payload in the shared frontend store and mirrors
 * the older UI shape into currentUser for the existing legacy pages.
 */
function storeCurrentUserProfile(user) {
  currentUserProfile = user || null;
  currentUser = user ? mapUserToLegacyCurrentUser(user) : [];
}

/**
 * Registers a new user.
 * @param {Object} param0 - The user details.
 * @param {string} param0.firstName - The first name of the user.
 * @param {string} param0.secondName - The second name of the user.
 * @param {string} param0.mail - The email of the user.
 * @param {string} param0.password - The password of the user.
 * @returns {Object} - The registered user object.
 */
async function registerUser({ firstName, secondName, mail, password }) {
  const data = await apiRequest('/auth/register/', {
    method: 'POST',
    body: {
      first_name: firstName,
      last_name: secondName,
      email: mail,
      password: password,
      repeated_password: password,
    },
  });
  setAuthToken(data.token);
  storeCurrentUserProfile(data.user);
  return currentUser;
}

async function loginUser(email, password) {
  const data = await apiRequest('/auth/login/', { method: 'POST', body: { email, password } });
  setAuthToken(data.token);
  storeCurrentUserProfile(data.user);
  return currentUser;
}

async function guestLogin() {
  const data = await apiRequest('/auth/guest-login/', { method: 'POST' });
  setAuthToken(data.token);
  storeCurrentUserProfile(data.user);
  currentUserId = 999;
  return currentUser;
}

/**
 * Fetches the current user from the server and updates the currentUser variable.
 * @returns 
 */
async function getCurrentUserFromServer() {
  if (!getAuthToken()) {
    currentUser = [];
    currentUserProfile = null;
    return;
  }
  try {
    const data = await apiRequest('/auth/me/');
    storeCurrentUserProfile(data);
  } catch (e) {
    currentUser = [];
    currentUserProfile = null;
    console.warn('Could not load currentUser!');
  }
}

/**
 * Finds the contact id (in contacts_global) that represents the current user.
 * Sets currentUserId to 999 for guests or when no matching contact exists.
 */
async function getCurrentUserIdFromServer() {
  if (!getAuthToken() || currentUser === '' || currentUser.length === 0) {
    currentUserId = 999;
    return;
  }
  await getContactsFromServer();
  const email = currentUserProfile?.email ?? currentUser.mail;
  const match = contacts_global.find((contact) => contact.mail === email);
  currentUserId = match ? match.id : 999;
}

/**
 * Returns the contact (in contacts_global) representing the current user, or undefined.
 */
function getCurrentUserContact() {
  return contacts_global.find((contact) => contact.id === currentUserId);
}


// ***** newTask status (client-side only UI flag) ***** //

let newTask_status = false;

async function getNewTask_statusFromServer() {
  const value = await getItem('newTask_status');
  newTask_status = value === null ? false : value;
}

async function setNewTask_status_false() {
  await setItem('newTask_status', 'false');
}


// ***** status of new task added via column button (client-side only UI flag) ***** //

let statusBymobile_addTask_board = 'toDo';

async function setStatusToServer() {
  await setItem('status', statusBymobile_addTask_board);
}

async function getStatusFromServer() {
  const value = await getItem('status');
  statusBymobile_addTask_board = value === null ? 'toDo' : value;
}
