// *** Priority *** //

let prio_addTask = 'Medium';

/**
 * Shows priotity buttons to change content of priority status via click on button
 */
function renderPrioEditDialog_addTask() {
    let container = document.getElementById('addTask_dialog_priority');
    container.innerHTML = prioBtnHTML_addTask();
    if (prio_addTask == "Urgent") {
        renderPrioButtons_addTask('Urgent')
    } else if (prio_addTask == "Medium") {
        renderPrioButtons_addTask('Medium')
    } else if (prio_addTask == "Low") {
        renderPrioButtons_addTask('Low')
    }
}

/**
 * HTML structure of priority section in edit dialog.
 * 
 * @returns {HTMLDivElement}
 */
function prioBtnHTML_addTask() {
    return /*html */`
    <div class="header_text_edit_section_Opensans">Priority</div>
    <div class="prio_choice-section">
        <div class="btn_addTask_list">
            <div id="urgent_btn_addTask" ></div>
            <div id="medium_btn_addTask" ></div>
            <div id="low_btn_addTask" ></div>
        </div>
    </div>
    `;
}

/**
 * Changes the priority buttons design depending on value of Variable "prio".
 * Sets global variable "prioStatusEdit" depending on prio.
 * 
 * @param {String} prio - priority as text.
 */
function renderPrioButtons_addTask(prio) {
    if (prio == 'Low') {
        setPrioBtnLowActive_addTask()
    } else if (prio == 'Medium') {
        setPrioBtnMediumActive_addTask()
    } else if (prio == 'Urgent') {
        setPrioBtnUrgentActive_addTask()
    }
    prio_addTask = prio;
}

/**
 * Changes priority buttons in edit dialog.
 * Case low is active!
 */
function setPrioBtnLowActive_addTask() {
    let urgent_btn = document.getElementById('urgent_btn_addTask');
    let medium_btn = document.getElementById('medium_btn_addTask');
    let low_btn = document.getElementById('low_btn_addTask');
    urgent_btn.innerHTML = urgentInactivHTML_addTask();
    medium_btn.innerHTML = mediumInactivHTML_addTask();
    low_btn.innerHTML = lowActivHTML_addTask();
}

/**
 * Changes priority buttons in edit dialog.
 * Case medium is active!
 */
function setPrioBtnMediumActive_addTask() {
    let urgent_btn = document.getElementById('urgent_btn_addTask');
    let medium_btn = document.getElementById('medium_btn_addTask');
    let low_btn = document.getElementById('low_btn_addTask');
    urgent_btn.innerHTML = urgentInactivHTML_addTask();
    medium_btn.innerHTML = mediumActivHTML_addTask();
    low_btn.innerHTML = lowInactivHTML_addTask();
}

/**
 * Changes priority buttons in edit dialog.
 * Case urgent is active!
 */
function setPrioBtnUrgentActive_addTask() {
    let urgent_btn = document.getElementById('urgent_btn_addTask');
    let medium_btn = document.getElementById('medium_btn_addTask');
    let low_btn = document.getElementById('low_btn_addTask');
    urgent_btn.innerHTML = urgentActivHTML_addTask();
    medium_btn.innerHTML = mediumInactivHTML_addTask();
    low_btn.innerHTML = lowInactivHTML_addTask();
}

/**
 * HTML of urgent button in priority section for status "inactive"
 * change font design through specific class and image with color.
 * 
 * @returns {HTMLAnchorElement} priority button with colored urgent icon and white background
 */
function urgentInactivHTML_addTask() {
    return `
        <a class="urgent_btn_inactive btn_addTask" onclick="renderPrioButtons_addTask('Urgent')">
            Urgent 
            <img id="btnUrgrend_img_addTask" src="assets/img/Prio_urgent_color_origin.svg" alt="" srcset="">
        </a>
    `;
}

/**
 * HTML of urgent button in priority section for status "active"
 * change font design through specific class and image with white.
 * 
 * @returns {HTMLAnchorElement} priority button with white urgent icon/text and red background
 */
function urgentActivHTML_addTask() {
    return `
        <a class="urgent_btn_active btn_addTask">
            Urgent 
            <img id="btnUrgrend_img_addTask" src="assets/img/Prio_urgent_white.svg" alt="" srcset="">
        </a>
    `;
}

/**
 * HTML of medium button in priority section for status "inactive"
 * change font design through specific class and image with color
 * 
 * @returns {HTMLAnchorElement} priority button with colored medium icon and white background
 */
function mediumInactivHTML_addTask() {
    return `
        <a class="medium_btn_inactive btn_addTask" onclick="renderPrioButtons_addTask('Medium')">
            Medium 
            <img id="btnMedium_img_addTask" src="assets/img/Prio_medium_color_origin.svg" alt="" srcset="">
        </a>
    `;
}

/**
 * HTML of medium button in priority section for status "active"
 * change font design through specific class and image with white 
 * 
 * @returns {HTMLAnchorElement} priority button with white medium icon/text and orange background
 */
function mediumActivHTML_addTask() {
    return `
        <a class="medium_btn_active btn_addTask">
            Medium 
            <img id="btnMedium_img_addTask" src="assets/img/Prio_medium_white.svg" alt="" srcset="">
        </a>
    `;
}


/**
 * HTML of low button in priority section for status "inactive"
 * change font design through specific class and image with color.
 * 
 * @returns {HTMLAnchorElement} priority button with colored low icon and white background
 */
function lowInactivHTML_addTask() {
    return `
        <a class="low_btn_inactive btn_addTask" onclick="renderPrioButtons_addTask('Low')">
            Low 
            <img id="btnLow_img_addTask" src="assets/img/Prio_low_color_origin.svg" alt="" srcset="">
        </a>
    `;
}

/**
 * HTML of low button in priority section for status "active"
 * change font design through specific class and image with white 
 * 
 * @returns {HTMLAnchorElement} priority button with white medium icon/text and green background
 */
function lowActivHTML_addTask() {
    return `
        <a class="low_btn_active btn_addTask">
            Low 
            <img id="btnLow_img_addTask" src="assets/img/Prio_low_white.svg" alt="" srcset="">
        </a>
    `;
}