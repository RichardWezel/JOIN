// variable which represents the active and selected priority status in edit dialog 
// used for chage priority in json in edit dialog by click OK
let prioStatusEdit = '';

// Source of current editing task 
let currentTaskContent = '';

/**
 * init by onclick @ task Dialog buttom right edit-icon
 * load only the current task of array tasks in the array currentTaskContent
 * render the dialog for edit content
 * 
 * @param {Number} taskId - Index of task in tasks array 
 */
function openTaskEdit(taskId) {
    dialog_status = 'edit';
    loadEditContent(taskId);
    renderEditDialog(taskId);
}

/**
 * Takes a copy of current editing task and load in array currentTaskContent to protect the original data of tasks.json
 * 
 * @param {Number} taskId - Index of task in tasks array 
 */
function loadEditContent(taskId) {
    currentTaskContent = JSON.parse(JSON.stringify(tasks[taskId]));
}
 
/**
 * Deletes the content of dialog container and calls functions building edit-content
 * 
 * @param {NUmber} taskId - Index of task in tasks array
 */
function renderEditDialog(taskId) {
    let container = document.getElementById('task_dialog_container');
    container.innerHTML = editDialogHTML(taskId);
    renderTitleEditDialog(taskId);
    renderDescriptionEditDialog();
    renderDueDateEditDialog(taskId);
    renderPrioEditDialog();
    renderAssigedToEditDialog(taskId);
    renderSubtasksEditDialog(taskId);
}

/**
 * Returns the HTML structure of edit dialog
 * 
 * @param {Number} taskId - Index of task in tasks array
 * @returns {HTMLElements}
 */
function editDialogHTML(taskId) {
    return /*html*/`
    <div onclick="closeDropdownList(${taskId})">
        <div id="close_section_edit" class="distance">
            <a onclick="closeDialog(${taskId})" class="close">
                <div class="line horizontal"></div>
                <div class="line vertical"></div>
            </a>
        </div>
        <div id="title_section_edit" class="distance"></div> 
        <div id="description_section_edit" class="distance"></div>
        <div id="dueDate_section_edit" class="distance"></div>
        <div id="prio_section_edit" class="distance"></div>
        <div id="assignedTo_section_edit" class="distance flexDirection" onclick="doNotClose(event)"></div>
        <div id="subtask_section_edit" class="distance flexDirection"></div>    
    </div>
    <div id="ok_section_edit" class="distance">
        <a onclick="confirmInputsOfEditDialog(${taskId})" class="confirm_btn_edit">
        Ok <img src="assets/img/check.svg">
        </a>
    </div>
    `;
}

/**
 *Shows title input to change content of title via inputfield
 */
function renderTitleEditDialog() {
    let container = document.getElementById('title_section_edit');
    let title = currentTaskContent.title;
    container.innerHTML = `
        <label class="header_text_edit_section" for="title_edit" >Titel</label>
        <input onkeyup="checkFormValidation_title()" onfocusout="checkFormValidation_title()" value="${title}" id="title_edit" name="title_edit" type="text" placeholder="Enter a Title">
        <div class="errormessage_title" id="errormessage_title"></div>
    `;
}

/**
 * Shows the  description input to change content of description via inputfield
 */
function renderDescriptionEditDialog() {
    let container = document.getElementById('description_section_edit');
    container.innerHTML = DescriptionEditDialogHTML();
}

/**
 * Returns the HTML structure of description section.
 * 
 * @returns {HTMLElements}
 */
function DescriptionEditDialogHTML() {
    return /*html */ `
    <div class="header_text_edit_section">Description</div>
    <textarea placeholder="Enter a description" id="edit_input_description" rows="4" type="text">${currentTaskContent.description}</textarea>
    `;
}

/**
 * Shows the Due Date input to change content of Due Date via inputfield
 * 
 * @param {Number} taskId - Index of task in tasks array
 */
function renderDueDateEditDialog() {
    let container = document.getElementById('dueDate_section_edit');
    let newDate = currentTaskContent.dueDate;
    container.innerHTML = DueDateEditDialogHTML();
    setDueDateValue();
    renderminDateEdit();
}

/**
 * Returns the HTML structure of input field with the due date.
 * 
 * @param {String} newDate - represents the  Due Date format dd/mm/yyyy of current task
 * @returns {HTMLElements} - HTML input with due date
 */
function DueDateEditDialogHTML() {
    return /*html*/`
        <div class="header_text_edit_section">Due Date</div>
        <form>
            <input class="" onkeyup="checkFormValidation_DueDate()" onfocusout="checkFormValidation_DueDate()"pattern="\d{2}/\d{2}/\d{4}" placeholder="dd/mm/yyyy" id="edit_input_dueDate" type="date" required>
        </form>
        <div class="" id="errormessage_due_date">This field is required</div>
    `;
}

/**
 * Gets the due date in format dd/mm/yy and transform this in yyyy-mm-dd to show the date in input type date.
 */
function setDueDateValue() {
    let dateInput = document.getElementById('edit_input_dueDate');
    date = currentTaskContent.dueDate.split('/');
    date[2] = parseInt(date[2].trim()) +2000;
    let new_date_format = date[2] + '-' + date[1] + '-' + date[0];
    dateInput.value = new_date_format;
}

function renderminDateEdit() {
  let dateInput = document.getElementById('edit_input_dueDate');
  let today = new Date;
  let day = today.getDate();
  if (day < 10) {
    day = `0` + `${day}`;
  }
  let month = today.getMonth() + 1;
  if (month < 10) {
    month = `0` + `${month}`;
  }
  let year = today.getFullYear();
  today = `${year}` + `-` + `${month}` + `-` + `${day}`;
  dateInput.setAttribute("min", today);
}

/**
 * Shows priotity buttons to change content of priority status via click on button
 */
function renderPrioEditDialog() {
    let container = document.getElementById('prio_section_edit');
    let prio = currentTaskContent.priority;
    container.innerHTML = prioBtnHTML();
    if (prio == "Urgent") {
        renderPrioButtons('Urgent')
    } else if (prio == "Medium") {
        renderPrioButtons('Medium')
    } else if (prio == "Low") {
        renderPrioButtons('Low')
    }
}

/**
 * Returns HTML structure of priority section in edit dialog.
 * 
 * @returns 
 */
function prioBtnHTML() {
    return /*html */`
    <div class="header_text_edit_section_Opensans">Priority</div>
    <div class="prio_choice-section">
        <div class="btn_addTask_list">
            <div id="urgent_btn" ></div>
            <div id="medium_btn" ></div>
            <div id="low_btn" ></div>
        </div>
    </div>
    `;
}

/**
 * Changes the priority buttons design depending on value of Variable "prio".
 * Set global variable "prioStatusEdit" depending on prio.
 * 
 * @param {String} prio - Name of priority
 */
function renderPrioButtons(prio) {
    if (prio == 'Low') {
        setPrioBtnLowActive()
    } else if (prio == 'Medium') {
        setPrioBtnMediumActive()
    } else if (prio == 'Urgent') {
        setPrioBtnUrgentActive()
    }
    prioStatusEdit = prio;
}

/**
 * Changes priority buttons in edit dialog.
 * Case low is active.
 */
function setPrioBtnLowActive() {
    let urgent_btn = document.getElementById('urgent_btn');
    let medium_btn = document.getElementById('medium_btn');
    let low_btn = document.getElementById('low_btn');
    urgent_btn.innerHTML = urgentInactivHTML();
    medium_btn.innerHTML = mediumInactivHTML();
    low_btn.innerHTML = lowActivHTML();
}

/**
 * Changes priority buttons in edit dialog.
 * Case medium is active.
 */
function setPrioBtnMediumActive() {
    let urgent_btn = document.getElementById('urgent_btn');
    let medium_btn = document.getElementById('medium_btn');
    let low_btn = document.getElementById('low_btn');
    urgent_btn.innerHTML = urgentInactivHTML();
    medium_btn.innerHTML = mediumActivHTML();
    low_btn.innerHTML = lowInactivHTML();
}

/**
 * Changes priority buttons in edit dialog.
 * Case urgent is active.
 */
function setPrioBtnUrgentActive() {
    let urgent_btn = document.getElementById('urgent_btn');
    let medium_btn = document.getElementById('medium_btn');
    let low_btn = document.getElementById('low_btn');
    urgent_btn.innerHTML = urgentActivHTML();
    medium_btn.innerHTML = mediumInactivHTML();
    low_btn.innerHTML = lowInactivHTML();
}

/**
 * Returns the HTML structure of urgent button in priority section for status "inactive".
 * Changes font design through specific class and image with color.
 * 
 * @returns {HTMLElements} HTML structure of urgent-button "inactive".
 */
function urgentInactivHTML() {
    return `
        <a class="urgent_btn_inactive btn_addTask" onclick="renderPrioButtons('Urgent')">
            Urgent
            <img id="btnUrgrend_img" src="assets/img/Prio_urgent_color_origin.svg" alt="" srcset="">
        </a>
    `;
}

/**
 * Returns the HTML structure of urgent button in priority section for status "active".
 * Changes font design through specific class and image with color.
 * 
 * @returns {HTMLElements} HTML structure of urgent-button "active".
 */
function urgentActivHTML() {
    return `
        <a class="urgent_btn_active btn_addTask">
            Urgent
            <img id="btnUrgrend_img" src="assets/img/Prio_urgent_white.svg" alt="" srcset="">
        </a>
    `;
}

/**
 * Returns the HTML structure of medium button in priority section for status "inactive".
 * Changes font design through specific class and image with color.
 * 
 * @returns {HTMLElements} HTML structure of medium-button "inactive".
 */
function mediumInactivHTML() {
    return `
        <a class="medium_btn_inactive btn_addTask" onclick="renderPrioButtons('Medium')">
            Medium 
            <img id="btnMedium_img" src="assets/img/Prio_medium_color_origin.svg" alt="" srcset="">
        </a>
    `;
}

/**
 * Returns the HTML structure of medium button in priority section for status "active".
 * Changes font design through specific class and image with color.
 * 
 * @returns {HTMLElements} HTML structure of medium-button "active".
 */
function mediumActivHTML() {
    return `
        <a class="medium_btn_active btn_addTask">
            Medium 
            <img id="btnMedium_img" src="assets/img/Prio_medium_white.svg" alt="" srcset="">
        </a>
    `;
}

/**
 * Returns the HTML structure of low button in priority section for status "inactive".
 * Changes font design through specific class and image with color.
 * 
 * @returns {HTMLElements} HTML structure of low-button "inactive".
 */
function lowInactivHTML() {
    return `
        <a class="low_btn_inactive btn_addTask" onclick="renderPrioButtons('Low')">
            Low 
            <img id="btnLow_img" src="assets/img/Prio_low_color_origin.svg" alt="" srcset="">
        </a>
    `;
}

/**
 * Returns the HTML structure of low button in priority section for status "active".
 * Changes font design through specific class and image with color.
 * 
 * @returns {HTMLElements} HTML structure of low-button "active".
 */
function lowActivHTML() {
    return `
        <a class="low_btn_active btn_addTask">
            Low 
            <img id="btnLow_img" src="assets/img/Prio_low_white.svg" alt="" srcset="">
        </a>
    `;
}
