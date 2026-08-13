/**
 * Marks whether the subtask input feld is activated or not.
 * False equals inactiv and true equals active.
 */
let subtask_status = false;

/**
 * Shows the subtask section.
 * 
 * @param {Number} taskId - Index of task in tasks global array
 */
function renderSubtasksEditDialog(taskId) {
    let container = document.getElementById('subtask_section_edit');
    container.innerHTML = subtaskListEditHTML(taskId);
    added_subtasks_edit(taskId);
}

/**
 * HTML main structure of subtask section.
 * 
 * @param {Number} taskId - Index of task in tasks global array
 * @returns {HTMLDivElement} header, input and dropdown section
 */
function subtaskListEditHTML(taskId) {
    return `
        <div class="header_text_edit_section">Subtasks</div>
        <div class="input_section_edit_subtask">
            <input onclick="changeAddIconSubtaskInputEdit(${taskId})" id="add_new_subtask_input" type="text" placeholder="Add new subtask">
            <div id="buttons_subtask_edit">
            <a class="add_btn_subtask_edit">
            <img src="assets/img/addSubtask_btn.svg">
        </a>
            </div>
        </div>
        <div class="unordered-list_subtasks">
            <ul id="added_subtasks_edit"></ul>
        </div>
    `;
}

/**
 * Shows the added subtasks.
 * 
 * @param {Number} taskId - Index of task in tasks global array
 */
function added_subtasks_edit(taskId) {
    let container = document.getElementById('added_subtasks_edit');
    container.innerHTML = '';
    let subtasks = currentTaskContent.subtasks;
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i].name;
        container.innerHTML += subtasklistEditHTML(subtask, i, taskId);
    }
}

/**
 * HTML structure of the subtask dropdown list
 * 
 * @param {JSON} subtask - currentTaskContent.subtasks content
 * @param {Number} subtaskId Index of subtask in currentTaskContent.subtasks
 * @param {Number} taskId - Index of task in tasks global array
 * @returns 
 */
function subtasklistEditHTML(subtask, subtaskId, taskId) {
    return `
            <div id="subtask_list_row_main${taskId}${subtaskId}" class="subtask_list_row_main">
                <div class="subtask_list_row" ondblclick="editSubtask('${subtask}', ${subtaskId}, ${taskId})">
                    <div id="subtask_name_edit_id${taskId}${subtaskId}" class="subtask_name_edit"><span class="point">&bull; </span> ${subtask}</div>
                        <div class="subtask_delete_and_edit_editDialog">
                        <a class="edit_btn_subtask" id="edit_img_subtask_edit${taskId}${subtaskId}" onclick="editSubtask('${subtask}', ${subtaskId}, ${taskId})">
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="#2A3647"/>
                            </svg>
                        </a>
                        <div class="line_subtask"></div>

                        <a class="delete_btn_subtask" onclick="deleteSubtask(${subtaskId}, ${taskId})">
                            <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
    `;
}

/**
 * Shows the editing mode of subtask
 * 
 * @param {JSON} subtask - currentTaskContent.subtasks content
 * @param {Number} subtaskId Index of subtask in currentTaskContent.subtasks
 * @param {Number} taskId - Index of task in tasks global array
 */
function editSubtask(subtask, subtaskId, taskId) {
    let container = document.getElementById(`subtask_list_row_main${taskId}${subtaskId}`);
    container.innerHTML = editSubtaskHTML(subtask, taskId, subtaskId);
}

/**
 * HTML structure of editing mode of subtask
 * 
 * @param {JSON} subtask - currentTaskContent.subtasks content
 * @param {Number} subtaskId Index of subtask in currentTaskContent.subtasks
 * @param {Number} taskId - Index of task in tasks global array 
 * @returns {HTMLDivElement}
 */
function editSubtaskHTML(subtask, taskId, subtaskId) {
    return `
    <div class="edit_mode_list_row_subtask">
            <div class="edit_input_list_row_main">
                <input id="edit_input_list_row_content" class="edit_input_list_row" type="text" value="${subtask}">
                <div class="edit_delete_and_confirm_list_row">
                    <a class="delete_btn_subtask_edit" onclick="deleteSubtask(${subtaskId}, ${taskId})">
                        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
                        </svg>
                    </a>
                    <div class="line_subtask_edit"></div>
                    <a onclick="take_over_new_content_of_Task(${subtaskId}, ${taskId})">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"         xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_75880_8847" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                                <rect x="0.000976562" width="24" height="24" fill="#D9D9D9"/>
                            </mask>
                            <g mask="url(#mask0_75880_8847)">
                            <path d="M9.55118 15.15L18.0262 6.675C18.2262 6.475 18.4637 6.375 18.7387 6.375C19.0137 6.375 19.2512 6.475 19.4512 6.675C19.6512 6.875 19.7512 7.1125 19.7512 7.3875C19.7512 7.6625 19.6512 7.9 19.4512 8.1L10.2512 17.3C10.0512 17.5 9.81785 17.6 9.55118 17.6C9.28452 17.6 9.05118 17.5 8.85118 17.3L4.55118 13C4.35118 12.8 4.25535 12.5625 4.26368 12.2875C4.27202 12.0125 4.37618 11.775 4.57618 11.575C4.77618 11.375 5.01368 11.275 5.28868 11.275C5.56368 11.275 5.80118 11.375 6.00118 11.575L9.55118 15.15Z" fill="#2A3647"/>
                            </g>
                        </svg>
                    </a>
                </div>
            </div>    
        </div>
    `;
}

/**
 * Deletes subtask from task.
 * 
 * @param {Number} subtaskId Index of subtask in currentTaskContent.subtasks
 * @param {Number} taskId - Index of task in tasks global array 
 */
function deleteSubtask(subtaskId, taskId){
    currentTaskContent.subtasks.splice(subtaskId, 1);
    renderSubtasksEditDialog(taskId);
}

/**
 * Takes Over the new Subtask
 * 
 * @param {Number} subtaskId Index of subtask in currentTaskContent.subtasks
 * @param {Number} taskId - Index of task in tasks global array 
 */
function take_over_new_content_of_Task(subtaskId, taskId) {
    let content = document.getElementById('edit_input_list_row_content').value;
    currentTaskContent.subtasks[subtaskId].name = `${content}`;
    renderSubtasksEditDialog(taskId);
}

/**
 * Change the icons on the right side depending on status (subtask_status_addTask).
 * Shows a "plus" in inctive mode and confirm oder delete icon in active mode.
 * Is theh status true, the add mode is active and the input to add a new subtask is showen.
 * Is the status false, onlx a text is showen.
 * 
 * @param {Number} taskId - Index of task in tasks global array 
 */
function changeAddIconSubtaskInputEdit(taskId) {
    let container = document.getElementById('buttons_subtask_edit');
    subtask_status = !subtask_status;
    if (subtask_status == true) {
        container.innerHTML = ckeck_or_close_HTML(taskId);
    } else {
        container.innerHTML = add_subtask_plusHTML(taskId);
    }
}

/**
 * HTML structure in active mode to add a new subtask with confirm or delete icons.
 * 
 * @param {Number} taskId - Index of task in tasks global array 
 * @returns {HTMLAnchorElement}
 */
function ckeck_or_close_HTML(taskId) {
    return `
        <a class="close_subtask_adding" onclick="deleteInputSubtaskEdit(${taskId})">
            <img src="assets/img/close_black.svg">
        </a>
        <hr class="line_subtask_input">
        <a class="check_subtask_adding" onclick="take_over_new_Subtask(${taskId})">
        <img src="assets/img/check_dark.svg">
        </a>
    `;
}

/**
 * HTML structure of the inactive mode with a "plus" icon
 * 
 * @returns {HTMLAnchorElement}
 */
function add_subtask_plusHTML() {
    return /*html*/ `
    <a class="add_btn_subtask_edit">
        <img src="assets/img/addSubtask_btn.svg">
    </a>
    `;
}

/**
 * Gets the new subtask to add to task
 * 
 * @param {Number} taskId - Index of task in tasks global array 
 */
function take_over_new_Subtask(taskId) {
    let content = document.getElementById('add_new_subtask_input').value;
    if(content == '') {
        subtask_status = !subtask_status;
        renderSubtasksEditDialog(taskId);
    } else {
    currentTaskContent.subtasks.push(
        {
        "name": `${content}`,
        "done": false
        },
    );
    subtask_status = !subtask_status;
    renderSubtasksEditDialog(taskId);
    let lastIdNumber = currentTaskContent.subtasks.length - 1;
    let targetElement = document.getElementById(`subtask_list_row_main${taskId}${lastIdNumber}`);
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Delets the content of input and return to text mode (inactive)
 * 
 * @param {Number} taskId - Index of task in tasks global array 
 */
function deleteInputSubtaskEdit(taskId) {
    let Input = document.getElementById('add_new_subtask_input').value;
    Input = '';
    subtask_status = !subtask_status;
    renderSubtasksEditDialog(taskId);
}