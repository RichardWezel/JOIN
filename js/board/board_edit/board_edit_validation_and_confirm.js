
/**
 * Starts the functions that save and display the changed entries.
 * 
 * @param {Number} taskId - Index of task in tasks array
 */
async function confirmInputsOfEditDialog(taskId) {
    getInputValuesOfEditDialog(); 
    await loadChangedContentInTasksArray(taskId);
    await setAndGetToServer(); //@storage.js:55
    dialog_status = 'taskdetails';
    await deleteCurrentTaskContent();
    renderDialogTask(taskId); // @board_dialog_taskdetails.js:24     
}

/**
 * Validates the inputfields "due date" and "title" whether there is content and returns true or false.
 * 
 * @returns {Boolean} false by empty input field / true by content
 */
function input_value_validation(){
    let input_value_due_date = document.getElementById('edit_input_dueDate').value;
    let input_value_title = document.getElementById('title_edit').value;
    if (input_value_due_date == '' || input_value_title == '') {
        return false;
    } else {
        true;
    }
}

/**
 * Load content of title, description, due date inputs and priority choice in currentTaskContent.
 * Contacts of Assigned to section and subtasks section are always directly saved in currentTaskContent after changes.
 */
function getInputValuesOfEditDialog() {
    currentTaskContent.title = document.getElementById('title_edit').value;
    currentTaskContent.description = document.getElementById('edit_input_description').value;
    currentTaskContent.dueDate = changeDueDateFormatInShortYear();
    currentTaskContent.priority = prioStatusEdit;
}

/**
 * Chages the due date fomat from yyyy-mm-dd to dd/mm/yy
 * 
 * @returns {String} "dd/mm/yy"
 */
function changeDueDateFormatInShortYear() {
    let date = document.getElementById('edit_input_dueDate').value;
    date = date.split('-');
    let year = parseInt(date[0]); 
    year = year - 2000;
    let newDate = date[2] + '/' + date[1] + '/' + year;
    return newDate
}

/**
 * Loads the items of the new task to tasks
 * 
 * @param {Number} taskId - - Index of task in tasks array
 */
function loadChangedContentInTasksArray(taskId) {
    tasks[taskId] = currentTaskContent;
}

/**
 * Resets the currentTaskContent array.
 */
function deleteCurrentTaskContent() {
    currentTaskContent = '';
}

/**
 * Validates the input value. Controlls whether there is no content and add in red border and error text in case of true.
 */
function checkFormValidation_title() {
    let titleInput = document.getElementById('title_edit');
    let errormessage_title = document.getElementById('errormessage_title');
    if (titleInput.value === '' || titleInput.value == null) {
        titleInput.classList.add('non_valide'); // red border
        errormessage_title.innerHTML = 'This field is required'; // div is under the Input
        document.getElementById('errormessage_title').style.display = 'block'; // let div with text appear
        document.getElementById('close_section_edit').scrollIntoView({ behavior: 'smooth', block: 'start' }); // scroll to input
        document.getElementById('title_edit').focus();
  } else {
    titleInput.classList.remove('non_valide');
    errormessage_title.style.display = 'none';
  }
}

/**
 * Validates the due date input. Corlor the border and show a error message in case of there is no contaent at input.
 */
function checkFormValidation_DueDate() {
    let dueDateInput = document.getElementById('edit_input_dueDate');
    let errormessage_dueDate = document.getElementById('errormessage_due_date');
    if (dueDateInput.value == '') {
        dueDateInput.classList.add('non_valide'); // red border
        errormessage_dueDate.innerHTML = 'This field is required'; // div is under the Input
        document.getElementById('errormessage_due_date').style.display = 'block'; // let div with text appear
        document.getElementById('close_section_edit').scrollIntoView({ behavior: 'smooth', block: 'start' }); // scroll to input
        document.getElementById('edit_input_dueDate').focus();
  } else {
    dueDateInput.classList.remove('non_valide');
    errormessage_dueDate.style.display = 'none';
  }
}