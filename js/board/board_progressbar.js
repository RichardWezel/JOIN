
/**
 * Calls the functions which render the progressbar elements 
 * or let the progressbar-field disappear if there are no subtasks.
 * 
 * @param {Number} taskId - Index of task in tasks array
 */
function showprogressbar(taskId) {
    let container = document.getElementById(`task_progressbar${taskId}`)
    let task = tasks[taskId];
    if (task.subtasks.length > 0) {
        container.innerHTML = subtaskHTML(taskId);
        renderSubtaskAmounts(taskId);
        renderBlueProgressbar(taskId);
        renderHoverTextProgressbar(taskId);
    } else {
        container.classList.add('d-none')
    }
}

/**
 * HTML structure of progressbar of completed tasks.
 * 
 * @param {Number} taskId - Index of task in tasks array
 * @returns {String} - HTML structure of progressbar
 */
function subtaskHTML(taskId) {
    return `
    <div class="progressbar_section">
        <div  class="progressbar">
            <div id="blue_progressbar${taskId}" class="progressbar_blue"></div>
        </div>
        <div class="progressbar_text"> 
            <span id="subtasks_todo${taskId}"></span> / <span id="subtasks_total${taskId}"></span> Subtasks
        </div>
    </div>
    <div id="hover_text_progressbar_${taskId}" class="hover_text_progressbar">5 von 7 Subtasks erledigt</div>
    `;
}

/**
 * Updating the progress bar based on completed tasks.
 * 
 * @param {Number} taskId - Index of task in tasks array
 */
function renderBlueProgressbar(taskId) {
    let container = document.getElementById(`blue_progressbar${taskId}`)
    let amountOfOpenTasks = calcSubtaskAmount(taskId);
    let totalSubtasks = tasks[taskId].subtasks.length;
    if (totalSubtasks > 0) {
        if (amountOfOpenTasks == 0 && container.style) {
            container.style.width = '0px';
        } else if (amountOfOpenTasks == tasks[taskId].subtasks.length) {
            container.style.width = '128px';
        } else {
            let progress = calcProgressbar(totalSubtasks) * amountOfOpenTasks;
            container.style.width = `${progress}px`;
        }
    }
}

/**
 * Creates the content of toast message hovering subtask progressbar
 * 
 * @param {Number} taskId - Index of task in tasks array
 */
function renderHoverTextProgressbar(taskId) {
    let container = document.getElementById(`hover_text_progressbar_${taskId}`);
    let closed_subtasks = calcSubtaskAmount(taskId);
    let subtasks_total = tasks[taskId].subtasks.length;
    container.innerHTML = `${closed_subtasks} von ${subtasks_total} Subtasks erledigt`;
}

/**
 * Calculate the level of the progressbar as pixel amount
 * 
 * @param {number} totalSubtasks - the amount of all subtasks in the task
 * @returns {number} - calculated pixel of progressbar level
 */
function calcProgressbar(totalSubtasks){
    let progressTotal = 128 / totalSubtasks;
    return +progressTotal; 
}

/**
 * Counts the completed subtasks and returns the amount
 * 
 * @param {Number} taskId - Index of task in tasks array
 * @returns {number} - amount of completed subtasks
 */
function calcSubtaskAmount(taskId) {
    let task = tasks[taskId];
    let subtask = task.subtasks;
    let subtask_amount_todo = 0;
    for (let i = 0; i < subtask.length; i++) {
        if(subtask[i].done == true) {
            subtask_amount_todo++;
        } 
    }
    return subtask_amount_todo;
}

/**
 * Render the labeling of progressbar.
 * 
 * @param {Number} taskId - Index of task in tasks array
 */
function renderSubtaskAmounts(taskId) {
    let sub_todo = document.getElementById(`subtasks_todo${taskId}`);
    let sub_total = document.getElementById(`subtasks_total${taskId}`);
    let amountOfOpenTasks = calcSubtaskAmount(taskId);
    sub_todo.innerHTML = amountOfOpenTasks;
    sub_total.innerHTML = tasks[taskId].subtasks.length;
}