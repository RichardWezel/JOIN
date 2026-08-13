// *** Clear-Button *** //

/**
 * Clears the inputs at the dialog and the content of arrays which only served as temporary storage.
 * Reloads the "addTask" dialog.
 */
function clearInputsAddTaskDialog() {
    let titleInput = document.getElementById('input_title_addTask_dialog');
    titleInput.value = '';
    let descriptionInput = document.getElementById('input_description_addTask_dialog');
    descriptionInput.value = '';
    contacts_addTask = [];
    let duedateInput = document.getElementById('edit_input_dueDate_addTask');
    duedateInput.value = '';
    prio_addTask = 'Medium';
    selectedCategory = '';
    new_subtask_addTask_dialog = [];
    renderAddTaskDialog()
}