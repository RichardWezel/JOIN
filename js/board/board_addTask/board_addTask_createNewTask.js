// *** Create new Task Button *** //

/**
 * Main json structure of new task.
 */
let newTask_board = {
    "title": "",
    "description": "",
    "category": "",
    "contacts": [],
    "dueDate": "",
    "priority": "",
    "subtasks": [],
    "status": "toDo"
};

/**
 * Adds the status to newTask.status. 
 * It is used by the addTask buttons of the column header.
 * 
 * @param {String} status - status of the new task to be created
 */
function addStatus(status) {
    newTask_board.status = status;
}

/**
 * Validates the required inputs, jump to the invalide section/input and mark the border red if the input isn't valide.
 * The function is triggered by pressing the "Create Task" button in add task dialog.
 */
async function validationOfAllInputs() {
    let titleInput = document.getElementById('input_title_addTask_dialog');
    let duedateInput = document.getElementById('edit_input_dueDate_addTask');
    if (titleInput.value == '') {
        window.location.hash='input_title_addTask_dialog';
        checkFormValidation_title_addTask();
    } else 
    
    if (duedateInput.value == '') {
        window.location.hash='edit_input_dueDate_addTask';
        DueDatevalidation_addTask();
        document.getElementById('edit_input_dueDate_addTask').classList.add('non_valide');
    } else 

    if (selectedCategory == '') {
        window.location.hash='addTask_dialog_category';
        document.getElementById('category_addTask_dialog').classList.add('non_valide');
    } else {
        await initCreateNewTask()
    }
}

/**
 * Initiates the creation of a new task.
 */
async function initCreateNewTask() {
    saveNewTask();
    await tasks.push(newTask_board); // @storage.js:32
    await setAndGetToServer(); // @board_main.js:498
    await toastmessage();
    resetSettings();
    await closeDialog(); // @board_dialog_taskdetails.js:25
}

async function toastmessage() {
    await openToastMessageAddTask();
    await timeout (1200);
    closeToast();
}

/**
 * Hides the toast message box
 */
function closeToast() {
    let container = document.getElementById('toastMessageAddTask'); //@board.html:43
    container.classList.add('d-none');
}


/**
 * Calls the functions that store the inputs of the "addTask dialog" in the newTask JSON-array.
 */
function saveNewTask() {
    title_newTask();
    description_newTask();
    category_newTask();
    contacts_newTask();
    dueDate_newTask();
    priority_newTask();
    subtasks_newTask();
    status_newTask();
}

/**
 * Makes the element saying "Task added to board" appear and disappear after 1 s and 20 ms.
 */
function openToastMessageAddTask() {
    let container = document.getElementById('toastMessageAddTask');
    container.classList.remove('d-none');
}

/**
 * Resets all elements of the dialog that were changed by the inputs.
 * 
 */
function resetSettings() {
    clearInputsAddTaskDialog(); // @board_addTask.js:311
    resetNewTask();
    // document.getElementById('task_dialog_container').style.width = '525px';
    // document.getElementById('task_dialog_container').style.paddingTop = '48px';
}

/**
 * Resets the newTask JSON-array and clear the content of the keys.
 */
function resetNewTask() {
    newTask_board = {
        "title": "",
        "description": "",
        "category": "",
        "contacts": [],
        "dueDate": "",
        "priority": "",
        "subtasks": [],
        "status": "toDo"
    };
}

/**
 * Adds the value of input from title to newTask.title.
 */
function title_newTask() {
    let titleInput = document.getElementById('input_title_addTask_dialog');
    newTask_board.title = titleInput.value;
}

/**
 * Adds the value of input from description to newTask.description.
 */
function description_newTask() {
    let descriptionInput = document.getElementById('input_description_addTask_dialog');
    newTask_board.description = descriptionInput.value;
}

/**
 * Adds the selected category from selectedCategory to newTask.category.
 * SelectedCategory is a global variable which is used @board_addTask.js:193 to save the choosen Category.
 */
function category_newTask() {
    newTask_board.category = selectedCategory;
}

/**
 * Adds the contacts which are selected for the task to newTask.contacts.
 */
function contacts_newTask() {
    for (let i = 0; i < contacts_addTask.length; i++) {
        let contact = contacts_addTask[i];
        if (contact.select_status == true) {
            newTask_board.contacts.push(
            {
                "firstName": contact.firstName,
                "secondName": contact.secondName,
                "color": contact.color
            }
            )
        }
    }
}

/**
 * Adds the due date from Input to newTask.dueDate with the right format dd/mm/yy.
 */
function  dueDate_newTask() {
    let duedateInput = document.getElementById('edit_input_dueDate_addTask').value;
    duedateInput = duedateInput.split('-');
    let year = parseInt(duedateInput[0]); 
    year = year - 2000;
    let newDate = duedateInput[2] + '/' + duedateInput[1] + '/' + year;
    newTask_board.dueDate = newDate;
}

/**
 * Adds the priority choice from prio_addTask to newTask.priority.
 * prio_addTask is a global variable @board_addTask_priority.js:3
 */
function priority_newTask() {
    newTask_board.priority = prio_addTask;
}

/**
 * Adds the subtasks from new_subtask_addTask_dialog to newTask.subtasks.
 * new_subtask_addTask_dialog is a global variable @board_addTask_subtask.js:2
 */
function subtasks_newTask() {
    if (new_subtask_addTask_dialog.length > 0) {
    newTask_board.subtasks = new_subtask_addTask_dialog;
    }
}

/**
 * Sorts the task into "to do" if the task was added using the "add task" button. 
 * Otherwise the task will be added to the correct column via the openAddTaskDialog(status) function @board_addTask.js:3.
 */
function status_newTask() {
    if(!newTask_board.status == "toDo") {
        newTask_board.status = "toDo";
    }
}