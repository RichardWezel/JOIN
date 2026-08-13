// ***** low level API helpers ***** //

const TOKEN_KEY = 'join_token';

function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

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

function mapContactToApi(contact) {
  return {
    first_name: contact.firstName,
    last_name: contact.secondName || '',
    email: contact.mail || '',
    phone: contact.phone || '',
    color: contact.color,
  };
}

async function getContactsFromServer() {
  try {
    const data = await apiRequest('/contacts/');
    contacts_global = data.map(mapContactFromApi);
    sortContacts();
  } catch (e) {
    console.warn('Could not load contacts!');
  }
}

function sortContacts() {
  contacts_global.sort((a, b) => {
    const firstNameA = a.name.firstName.toLowerCase();
    const firstNameB = b.name.firstName.toLowerCase();
    if (firstNameA < firstNameB) return -1;
    if (firstNameA > firstNameB) return 1;
    return 0;
  });
}

async function createContactOnServer(contact) {
  return apiRequest('/contacts/', { method: 'POST', body: mapContactToApi(contact) });
}

async function updateContactOnServer(id, contact) {
  return apiRequest(`/contacts/${id}/`, { method: 'PATCH', body: mapContactToApi(contact) });
}

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

async function getTasksFromServer() {
  try {
    const data = await apiRequest('/tasks/');
    tasks = data.map(mapTaskFromApi);
  } catch (e) {
    console.warn('Could not load tasks!');
  }
}

async function createTaskOnServer(task) {
  return apiRequest('/tasks/', { method: 'POST', body: mapTaskToApi(task) });
}

async function updateTaskOnServer(id, task) {
  return apiRequest(`/tasks/${id}/`, { method: 'PATCH', body: mapTaskToApi(task) });
}

async function deleteTaskOnServerById(id) {
  return apiRequest(`/tasks/${id}/`, { method: 'DELETE' });
}

async function patchTaskStatus(id, status) {
  return apiRequest(`/tasks/${id}/`, { method: 'PATCH', body: { status } });
}

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
 * Id of the contact (in contacts_global) representing the current user, or 999 for guests.
 */
let currentUserId = '';

function mapUserToLegacyCurrentUser(user) {
  return {
    id: user.id,
    name: { firstName: user.first_name, secondName: user.last_name, color: user.color },
    mail: user.email,
  };
}

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
  currentUser = mapUserToLegacyCurrentUser(data.user);
  return currentUser;
}

async function loginUser(email, password) {
  const data = await apiRequest('/auth/login/', { method: 'POST', body: { email, password } });
  setAuthToken(data.token);
  currentUser = mapUserToLegacyCurrentUser(data.user);
  return currentUser;
}

async function guestLogin() {
  const data = await apiRequest('/auth/guest-login/', { method: 'POST' });
  setAuthToken(data.token);
  currentUser = mapUserToLegacyCurrentUser(data.user);
  currentUserId = 999;
  return currentUser;
}

async function getCurrentUserFromServer() {
  if (!getAuthToken()) {
    currentUser = [];
    return;
  }
  try {
    const data = await apiRequest('/auth/me/');
    currentUser = mapUserToLegacyCurrentUser(data);
  } catch (e) {
    currentUser = [];
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
  const match = contacts_global.find((contact) => contact.mail === currentUser.mail);
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
