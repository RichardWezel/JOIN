/**
 * Main json structure of new task.
 */
let newTask = {
  "title": "",
  "description": "",
  "category": "",
  "contacts": [],
  "dueDate": "",
  "priority": "",
  "subtasks": [],
  "status": "",
};

/**
 * Initializes creating a new task.
 */
async function initNewTask() {
  validateInputs();
  if (
    validation('titleAddtask', 'validation_text_title') == true &&
    validation('AddTaskDate', 'validation_text_due_date') == true &&
    validation('categoryDropDownBtn', 'validation_text_category') == true) {
    console.log('All required inpiut fields are valide!')
    await createNewTask();
  }
}

/**
 * Initializes the validation functions for title, due date and category.
 */
function validateInputs() {
  validation('titleAddtask', 'validation_text_title');
  validation('AddTaskDate', 'validation_text_due_date');
  validation('categoryDropDownBtn', 'validation_text_category');
}

/**
 * Validates the input fields of the transmitted ids to see whether an input is present. 
 * If there is no input, a red border is added, an error text appears and it returns false.
 * If an input is present, the red border, the error text are removed amd it returns true. 
 * 
 * @param {String} inputId - id of input element which is to validate
 * @param {String} errortextId - id of error text element witch appears in case of non valide
 * @returns {Boolean} - Marks whether the all is valide or not.
 */
function validation(inputId, errortextId) {
  let input = document.getElementById(inputId);
  let errortext = document.getElementById(errortextId);
  if (!input || !errortext) {
    console.error("Input oder Errortext nicht gefunden.");
    return false;
  }
  if (input.value === '' ) {
    window.location.hash = inputId;
    input.classList.add('red-border');
    errortext.style.visibility = "visible";
    return false;
  } else {
    input.classList.remove('red-border');
    errortext.style.visibility = "hidden";
    return true;
  }
}
  
/**
 * Initials the functions to save the new task.
 * Sets the newTask status on true to start the toast message on borad html.
 * Changes to board.html
 */
async function createNewTask() {
  await saveNewTask();
  await deleteNewTaskContent();
  await removeAllInputes();
  newTask_status = 'true';
  await setItem('newTask_status', newTask_status);
  changeWindow();
}

/**
 * Initials the functions to saves the new task.
 */
async function saveNewTask() {
  await getAllSettingsOfNewTask();
  await pushNewTaskToTasks();
  await setTasksToServer();
  await getTasksFromServer();
}

/**
 * Change to bord.html
 */
function changeWindow() {
  window.location.href = "board.html";
}

/**
 * Calls all functions which getting the values of the new task.
 */
async function getAllSettingsOfNewTask() {
  await getTextInputValues();
  await dueDate_newTask_addTask();
  await getCategory();
  await getContacts();
  await getPrio();
  await getSubtask();
  await getStatus();
}

/**
 * Saves the input values in variables.
 */
function getTextInputValues() {
  let title = document.getElementById('titleAddtask').value;
  let description = document.getElementById('description').value;
  newTask.title = title;
  newTask.description = description;
}

/**
 * Adds the due date from Input to newTask.dueDate with the right format dd/mm/yy.
 */
function  dueDate_newTask_addTask() {
  let duedateInput = document.getElementById('AddTaskDate').value;
  duedateInput = duedateInput.split('-');
  let year = parseInt(duedateInput[0]); 
  year = year - 2000;
  let newDate = duedateInput[2] + '/' + duedateInput[1] + '/' + year;
  newTask.dueDate = newDate;
}

/**
 * Saves the choosen category to the new array.
 */
function getCategory() {
  newTask.category = pushCategory;
}

/**
 * Saves the choosen contacts to the new task.
 */
function getContacts() {
  let selected_contacts = [];
  for (let i = 0; i < contacts_addTask.length; i++) {
    let contact = contacts_addTask[i];
    if (contact.select_status == true) {
      delete contact.select_status;
      selected_contacts.push(contact.name);
    }
  newTask.contacts = selected_contacts;
  }
}

/**
 * Saves the choosen priority to the new task.
 */
function getPrio() {
  newTask.priority = prio;
}

/**
 * Saves the subtasks to the new task.
 */
function getSubtask() {
  newTask.subtasks = subtasklists;
}

/**
 * Saves the status of the new task.
 */
async function getStatus() {
  await getStatusFromServer();
  newTask.status = statusBymobile_addTask_board;
}

/**
 * Pushes the new task to the main tasks array.
 */
function pushNewTaskToTasks() {
  tasks.push(newTask);
}

/**
 * Resets the newTask array.
 */
async function deleteNewTaskContent() {
  newTask = {
    "title": "",
    "description": "",
    "category": "",
    "contacts": [],
    "dueDate": "",
    "priority": "",
    "subtasks": [],
    "status": ""
  }
  statusBymobile_addTask_board = "toDo";
  await setStatusToServer();
}

/**
 * clear the content of the new task page.
 */
function removeAllInputes() {
  // Remove the Add Task inputs
  prio = [];
  pushCategory = [];
  subtasklists = [];
  rendersubtasklist();
  document.getElementById('titleAddtask').value = '';
  document.getElementById('AddTaskDate').value = '';
  document.getElementById('description').value = '';
  document.getElementById('categoryDropDownBtn_text').innerHTML = 'Select task category';
  closeCategoryDropdown();
  changePriority("Medium");
  deleteSelectedContacts()
}

/**
 * Deletes the selected Contacts.
 */
function deleteSelectedContacts() {
  for (let i = 0; i < contacts_addTask.length; i++) {
    if (contacts_addTask[i].select_status == true) {
      contacts_addTask[i].select_status = false;
      document.getElementById(`contact${i}`).classList.remove('selected');
      document.getElementById(`selected_img${i}`).innerHTML = checkboxHTML_unchecked();
    }
  }
  renderSelectedContactsRow();
}
