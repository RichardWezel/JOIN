
/**
 * Registers the ID of the currently dragged task.
 * @param {string} taskId - The ID of the task being dragged.
 */
function registerTaskId(taskId) {
    currentDraggedElement = taskId;
}

/**
 * Marks columns as addable by changing their border style.
 * @param {string} status - The current status of the task being dragged.
 */
function markAddableColumns(status) {
    let columns = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    columns.splice(columns.indexOf(status), 1);
    columns.forEach(column => {
        let changedColumn = column.charAt(0).toUpperCase() + column.slice(1);
        let columnId = 'task_container_' + changedColumn;
        document.getElementById(columnId).style.border = 'dotted var(--bgdarkblue) 1px';
    });
}

/**
 * Moves the current task to a new status and updates the server and board.
 * @param {string} status - The new status to move the task to.
 * @returns {Promise<void>} - A promise that resolves when the task is moved.
 */
async function moveTo(status) {
    tasks[currentDraggedElement].status = status;
    await setAndGetToServer();
    deleteBorderStyles();
    init_board();
}

/**
 * Deletes the border styles from all columns and hides the status bar.
 */
function deleteBorderStyles() {
    let columns = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    columns.forEach(column => {
        let changedColumn = column.charAt(0).toUpperCase() + column.slice(1);
        let columnId = 'task_container_' + changedColumn;
        document.getElementById(columnId).style.border = 'none';
    });
    document.getElementById('status_bar_id').style.display = 'none';
}

/**
 * Highlights a status area by adding a class to it.
 * @param {string} id - The ID of the status area to highlight.
 */
function highlight(id) {
    let status_area = document.getElementById(id);
    status_area.classList.add('status_selected');
}

/**
 * Removes the highlight from a status area by removing a class from it.
 * @param {string} id - The ID of the status area to remove the highlight from.
 */
function removeHighlight(id) {
    let status_area = document.getElementById(id);
    status_area.classList.remove('status_selected');
}

/**
 * Allows an element to be dropped by preventing the default behavior.
 * @param {Event} event - The event object representing the drop event.
 */
function allowDrop(event) {
    event.preventDefault();
}
