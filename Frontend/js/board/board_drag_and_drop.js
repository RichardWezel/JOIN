
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
    await patchTaskStatus(currentDraggedElement, status);
    deleteBorderStyles();
    init_board();
}

/**
 * Marks the column the dragged card is hovering as the drop target.
 * Used by the mouse (dragover) and the touch path (handleTouchMove) alike.
 * @param {HTMLElement|null} column - the .board_column element, or null to clear.
 */
function highlightColumn(column) {
    let container = column ? column.querySelector('.task_container') : null;
    if (container && container.classList.contains('drop_target')) return;
    document.querySelectorAll('.task_container.drop_target')
        .forEach(element => element.classList.remove('drop_target'));
    if (container) container.classList.add('drop_target');
}

/**
 * Clears the drop marker when the pointer really leaves the column -
 * dragleave also fires when moving between the column's own children.
 * @param {DragEvent} event
 * @param {HTMLElement} column - the .board_column element.
 */
function unhighlightColumn(event, column) {
    if (!column.contains(event.relatedTarget)) {
        column.querySelector('.task_container').classList.remove('drop_target');
    }
}

/**
 * Deletes the border styles from all columns, clears the drop marker and hides the status bar.
 */
function deleteBorderStyles() {
    let columns = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    columns.forEach(column => {
        let changedColumn = column.charAt(0).toUpperCase() + column.slice(1);
        let columnId = 'task_container_' + changedColumn;
        document.getElementById(columnId).style.border = 'none';
    });
    highlightColumn(null);
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
