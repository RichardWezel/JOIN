
/**
 * Sets the dialog status and let render the Dialog with task details.
 * Displays the dialog container with a grayish backgroundAnimates and the dialog window from the right when the content is loaded.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 */
async function openTaskDetailsDialog(taskId) {
    let container = document.getElementById('dialog_container');
    let taskDialogContainer = document.getElementById('task_dialog_container');
    dialog_status = 'taskdetails';
    await renderDialogTask(taskId);  
    container.classList.remove('d-none');
    taskDialogContainer.style.position = 'none'; 
}

/**
 * Calls the functions creates the HTML structure of dialog with details of the task.
 * When the dialog to change content is called, the data is loaded from currentTaskContent.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 */
async function renderDialogTask(taskId){
    let container = document.getElementById('task_dialog_container');
    let task = tasks[taskId];
    container.innerHTML = taskDialogHTML(task, taskId);
    changeDueDateFormat(taskId);
    setColorOfCategoryInDialog(taskId);
    renderPriorityDialog(taskId);
    await renderAssigedToDialog(taskId);
    renderSubtasksDialog(taskId);
    if (tasks[taskId].subtasks.length > 0){
        renderBlueProgressbar(taskId);
    }
}

/**
 * Returns the HTML structure of dialog with task details of current choosen task
 * 
 * @param {JSON} task Object JSON with task elements.
 * @param {Number} taskId Index of current called task in tasks[] global array.
 * @returns {String} - HTML structure of Dialog with task details.
 */
function taskDialogHTML(task, taskId) {
    return `
        <div class="category_close">
                <div onclick="doNotClose(event)" id="task_category_dialog" class="task_category">${task.category}</div>
                <a onclick="closeDialog(${taskId})" class="close">
                    <div class="line horizontal"></div>
                    <div class="line vertical"></div>
                </a>
            </div>
            <!-- title -->
            <div onclick="doNotClose(event)" class="task_title_dialog">${task.title}</div>
            <!-- description -->
            <div onclick="doNotClose(event)" class="task_description_dialog">${task.description}</div>
            <!-- Due date -->
            <div onclick="doNotClose(event)" class="due_Date_dialog">
                Due date: <span id="dueDateTaskDetails" class="duedate">${task.dueDate}</span>
            </div>
            <!-- priority -->
            <div onclick="doNotClose(event)" class="priority_dialog">
                Priority: <span >${task.priority}</span><div id="prio_image"></div>
            </div>
            <!-- assigned to -->
            <div onclick="doNotClose(event)" class="assigned_to" id="assigned_to_section_taskdetails">
                <div>Assiged To:</div>
                <div class="table_assigedto">
                    <table>
                        <tbody id="member_container_dialog"></tbody>
                    </table>
                </div>
            </div>
            <!-- subtasks -->
            <div onclick="doNotClose(event)" class="subtasks_main" id="subtasks_section_taskdetails">
                <div id="subtask_dialog_header"></div>
                <div id="subtask_dialog_container" class="subtask_container">
                </div>
            </div>
            <!-- delete / edit -->
            <div onclick="doNotClose(event)" class="delete_and_edit_section">
                <div class="delete_and_edit">

                    <a onclick="deleteTask(${taskId})">
                        <div id="delete_img_dialog">
                            <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
                            </svg>
                        </div> <div class="delet_text">Delete</div>
                    </a>

                    <div class="line_task"></div>

                    <a id="edit_img_dialog" onclick="openTaskEdit(${taskId})">
                        <div id="delete_img_dialog">
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="#2A3647"/>
                        </svg>
                        </div> <div class="delet_text">Edit</div>
                    </a>

                </div>
            </div>
    `;
}

/**
 * Saves the new format of DueDate.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array.
 */
function changeDueDateFormat(taskId) {
    let container = document.getElementById('dueDateTaskDetails');
    let date = changeDueDateFormatInLongYear(taskId);
    container.innerHTML = `${date}`;
}

/**
 * Set the background-color of category-element.
 * 
 * @param {Number} i - Index of current called task in tasks[] global array.
 */
function setColorOfCategoryInDialog(i) {
    let category = tasks[i].category;
    container = document.getElementById('task_category_dialog');
    switch (category) {
        case 'User Story':
          container.style.backgroundColor = '#0038FF';
          break;
        case 'Technical Task':
          container.style.backgroundColor = '#1FD7C1';
          break;
    }
}

/**
 * Create the details of contacts assigned to the task.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array.
 */
async function renderAssigedToDialog(taskId) {
    let container = document.getElementById('member_container_dialog');
    let main_container = document.getElementById('assigned_to_section_taskdetails');
    await getContactsFromServer();
    container.innerHTML = '';
    let task = tasks[taskId];
    if (task.contacts.length == 0) {
        main_container.classList.add('d-none')
    } else {
        if (main_container.classList.contains('d-none')){
            main_container.classList.remove('d-none')
        }
        for (let i = 0; i < task.contacts.length; i++) {
            let contact = task.contacts[i];
            container.innerHTML += AssigedToDialogHTML(contact, taskId, i);
            document.getElementById(`taskdetailscontact${taskId}${i}`).style.backgroundColor = `${contact.color}`;
            if (currentUser !== '' && currentUserId !== 999) {
                if (contact.firstName == contacts_global[currentUserId].name.firstName && 
                    contact.secondName == contacts_global[currentUserId].name.secondName) {
                    await setYou_board_taskdetails(taskId, i);
                }
            }
            
        }
    }
}

/**
 * HTML structure of table row with cicle and contact name.
 * 
 * @param {JSON} contact - content of contacts of the current task (task.contacts[i]).
 * @param {Number} taskId - Index of current called task in tasks[] global array.
 * @param {Number} contactId - Index of contact in contacts_global
 * @returns {HTMLTableRowElement}
 */
function AssigedToDialogHTML(contact, taskId, contactId) {
    return `
        <tr>
            <td id="taskdetailscontact${taskId}${contactId}" class="member_cycle pos1">${contact.firstName.charAt(0)}${contact.secondName.charAt(0)}</td>
            <td class="member_name_assiged_to">${contact.firstName} ${contact.secondName} <span id="you_task_details${taskId}${contactId}" class="you"></span></td>
        </tr>
    `;
}

async function setYou_board_taskdetails(taskId, contactId) {
    let youDiv = document.getElementById(`you_task_details${taskId}${contactId}`)
    youDiv.innerHTML = "(You)"
}

//   function setYou_addTask() {
//     for (let i = 0; i < contacts_global.length; i++) {
//       let youDiv = document.getElementById(`you${i}`)
//       let contact = contacts_global[i];
//       if (contact.lockedIn == false) {
//         youDiv.innerHTML = "";
//       } else {
//         youDiv.innerHTML = "(You)"
//       }
//     }
//   }

/**
 * Set the priority image.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array.
 */
function renderPriorityDialog(taskId) {
    let priority = tasks[taskId].priority;
    let container = document.getElementById('prio_image');
    switch (priority) {
        case "Low":
          container.innerHTML = `<img src="assets/img/Prio_low_color_32x32.svg" alt="">`;
          break;
        case "Medium":
            container.innerHTML = `<img src="assets/img/Prio_medium_color_32x32.svg" alt="">`;
          break;
        case "Urgent":
          container.innerHTML = `<img src="assets/img/Prio_urgent_color_32x32.svg" alt="">`;
        break;
    }
}

/**
 * Shows the subtask containing in the task.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array.
 */
function renderSubtasksDialog(taskId){
    let container = document.getElementById('subtask_dialog_container');
    let main_container = document.getElementById('subtasks_section_taskdetails');
    let header = document.getElementById('subtask_dialog_header')
    if (tasks[taskId].subtasks.length == 0) {
        main_container.classList.add('d-none')
    } else {
        if (main_container.classList.contains('d-none')){
            main_container.classList.remove('d-none')
        }
        if (tasks[taskId].subtasks.length > 0) {
            header.innerHTML = 'Subtasks';
        }
        container.innerHTML = '';
        for (let j = 0; j < tasks[taskId].subtasks.length; j++) {
            let subtask = tasks[taskId].subtasks[j];
            container.innerHTML += subtaskDialogHTML(taskId, j, subtask.name);
            renderSubtaskImage(taskId, j);
        }
    }
}

/**
 * HTML structure of subtask
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array.
 * @param {Number} subtaskId - Index of current subtask
 * @param {String} subtaskContent - content of current subtask
 * @returns 
 */
function subtaskDialogHTML(taskId, subtaskId, subtaskContent) {
    return `
        <div class="Subtasks">
            <div id="subtask_status_img${taskId}${subtaskId}"></div>
            <span>${subtaskContent}</span>
        </div>
    `;
}

/**
 * Changes the subtask status in done or undone depending on the current status.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array.
 * @param {Number} subtaskId - Index of current subtask
 */
async function changeSubtaskStatus(taskId, subtaskId) {
    let subtaskStatus = tasks[taskId].subtasks[subtaskId].done;
    if (subtaskStatus == true) {
        tasks[taskId].subtasks[subtaskId].done = false;
    } else {
        tasks[taskId].subtasks[subtaskId].done = true;
    }
    await setAndGetToServer();
    renderSubtasksDialog(taskId);
    renderSubtaskAmounts(taskId);
}

/**
 * Changes the checkbox image depending on status.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array.
 * @param {Number} subtaskId - Index of current subtask
 */
function renderSubtaskImage(taskId, subtaskId) {
    let container = document.getElementById(`subtask_status_img${taskId}${subtaskId}`)
    let status = tasks[taskId].subtasks[subtaskId].done;
    switch (status) {
        case true:
          container.innerHTML = `<a class="checkbox1" onclick="changeSubtaskStatus(${taskId}, ${subtaskId})"><img src="assets/img/check_button_checked.svg"></a>`;
          break;
        case false:
            container.innerHTML = `<a class="checkbox1" onclick="changeSubtaskStatus(${taskId}, ${subtaskId})"><img src="assets/img/check_button_unchecked.svg"></a>`;
          break;
    }
}

/**
 * Deletes task frome the board.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array.
 */
async function deleteTask(taskId) {
    await tasks.splice(taskId, 1);
    await setAndGetToServer();
    closeDialog(taskId);
    init_board();
}

/**
 * Stops closing elements.
 * 
 * @param {Event} event 
 */
function doNotClose(event) {
    event.stopPropagation();
}