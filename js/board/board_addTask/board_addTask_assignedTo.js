// *** Assigned to *** //

let contacts_addTask = []
// structure of contacts_addTask:
// [
//  0: {
//      color: "'0000000",
//      firstName: "Max",
//      secondName: "Mustermann",
//      select_status: false
//     }
// ]


// dropdownStatus is in file board_edit_assignedTo.js

/**
 * Load the contacts in contacts_addTask array.
 * Render the content of Assigned to contactlist.
 * 
 */
async function renderAssigedToEditDialog_addTask(){
    await loadContacts_addTask();
    let container = document.getElementById('addTask_dialog_assignedTo');
    container.innerHTML = assigedToEditHTML_addTask();
    renderCiclesOfTaskContacts_addTask();
}

/**
 * Load contacts JSON in contacts_addTask array.
 * Reduce the array to only important Objects.
 * Add new Object "select_status" to the Keys.
 */
async function loadContacts_addTask() {
    await getContactsFromServer();
    contacts_addTask = JSON.parse(JSON.stringify(contacts_global));
    reduceContactKeysToImportant();
    addNewKeySelectStatus();
}

/**
 * Reduce the array to only important Objects.
 */
function reduceContactKeysToImportant() {
    for (let i = 0; i < contacts_addTask.length; i++) {
        contacts_addTask[i] = contacts_addTask[i]["name"];
    }
}

/**
 * Add new Object "select_status" to the Keys.
 */
function addNewKeySelectStatus() {
    for (let i = 0; i < contacts_addTask.length; i++) {
        contacts_addTask[i]["select_status"] = false;
    }
}

/**
 * HTML main structure of assiged to section in edit dialog.
 * 
 * @returns {String} - HTML structure of task contacts
 */
function assigedToEditHTML_addTask() {
    return /*html */`
    <!-- header -->
    <div class="header_text_edit_section">Assigned to</div>
    <div id="box_and_dropdown_section">
        <!-- box -->
        <div class="dropdown" >
            <!-- box dropdown inactive-->
            <div id="dropdown_text_addTask" class="dropdown_text" onclick="openDropDownList_addTask()"> 
                Select contacts to assign
            </div>
            <!-- box dropdown active-->
            <div id="dropdown_input_addTask" class="d-none"> 
                <input placeholder="search contacts" onkeyup="searchContacts_addTask()" id="search_contacts_edit_addTask" type="text">
            </div>
            <!-- arrow-->
            <a class="dopdown_img_inactive" id="dropdown_arrow_addTask" onclick="openDropDownList_addTask()" onfocusout="openDropDownList_addTask()">
                <img src="assets/img/arrowDropDown.svg">
            </a>
        </div>
        <!-- dropdownlist -->
        <div id="selectedContactsSection_addTask" class="selectedContacts"></div>
    </div>
    `;
}

/**
 * Render the cicles with initials of selected Contacts in selected Contacts Section.
 */
function renderCiclesOfTaskContacts_addTask() {
    let container = document.getElementById(`selectedContactsSection_addTask`);
    container.innerHTML = '';
        for (let i = 0; i < contacts_addTask.length; i++) {
            if (contacts_addTask[i].select_status == true) {
                let contact = contacts_addTask[i];
                let firstCharacter = contact.firstName.charAt(0);
                let secondCharacter = contact.secondName.charAt(0);
                let color = contact.color;
                container.innerHTML += selectedTaskMemberHTML_addTask(firstCharacter, secondCharacter, i); 
                document.getElementById(`selected_task_member_addTask${i}`).style.backgroundColor = `${color}`;
            }
        }
}

/**
 * HTML structure of cicles.
 * 
 * @param {String} firstCharacter - first letter of first name of contact 
 * @param {String} secondCharacter - first letter of second name of contact 
 * @param {Number} i - Index of current Contact in currentTaskContent.contacts
 * @returns 
 */
function selectedTaskMemberHTML_addTask(firstCharacter, secondCharacter, i) {
    return `
       <div class="circleImg">
    <div id="selected_task_member_addTask${i}" class="selected_member_cicle">${firstCharacter}${secondCharacter}</div>
    </div>
    `;
}

/**
 * Shows the dropdownlist with contacts and change arrow depending on dropdownstatus.
 * Change text in input for searching contacts in the list.
 */
function openDropDownList_addTask() {
    let box_and_dropdown_section = document.getElementById('box_and_dropdown_section')
    rotateArrow_addTask();
    changeTextInInput_addTask();
    if(dropdownStatus == false) {
        document.getElementById('selectedContactsSection_addTask').classList.add('flexDirection');
        searchContacts_addTask(); 
        dropdownStatus = true;
        box_and_dropdown_section.style.boxShadow = '0px 0px 14px 3px #0000000A';
        box_and_dropdown_section.style.borderRadius = '10px';
    } else {
        renderCiclesOfTaskContacts_addTask();
        document.getElementById('selectedContactsSection_addTask').classList.remove('flexDirection');
        dropdownStatus = false;
        box_and_dropdown_section.style.boxShadow = 'none';
    }
}

/**
 * Closes the dropdownlist of assigned to section on click outside of section.
 */
function closeDropdownList_addTask() {
    let box_and_dropdown_section = document.getElementById('box_and_dropdown_section')
    if (dropdownStatus == true) {
        rotateArrow_addTask();
        changeTextInInput_addTask();
        renderCiclesOfTaskContacts_addTask();
        document.getElementById('selectedContactsSection_addTask').classList.remove('flexDirection');
        dropdownStatus = false;
        box_and_dropdown_section.style.boxShadow = 'none';
    }
}

/**
 * rotate arrow 200 grad and back
 */
function rotateArrow_addTask() {
    let arrow_section = document.getElementById('dropdown_arrow_addTask')
    if (dropdownStatus == false){
        arrow_section.style.rotate = '200grad';
    } 
    else {
        arrow_section.style.rotate = '0grad';
    }
}

/**
 * Change the content of dropdown selection section
 */
function changeTextInInput_addTask() {
    let text = document.getElementById('dropdown_text_addTask');
    let input = document.getElementById('dropdown_input_addTask');
    text.classList.toggle('d-none')
    input.classList.toggle('d-none')
}

/**
 * Render dropdown contact list depending on input value by key up in search input .
 * 
 */
function searchContacts_addTask() {
    let searchinput = document.getElementById('search_contacts_edit_addTask').value;
    searchinput = searchinput.toLowerCase();
    showContactList_addTask(searchinput);
    // document.getElementById('selectedContactsSection_addTask').classList.toggle('flexDirection');
}

/**
 * Shows all contacts or searched contacts.
 * 
 * @param {String} searchValue 
 */
async function showContactList_addTask(searchValue) {
    await getContactsFromServer();
    let container = document.getElementById('selectedContactsSection_addTask');
    container.innerHTML = '';
    for (let i = 0; i < contacts_addTask.length; i++) {
        if (!searchValue || 
            contacts_addTask[i].firstName.toLowerCase().includes(searchValue) || 
            contacts_addTask[i].secondName.toLowerCase().includes(searchValue)) {
            container.innerHTML += editContactListHTML_addTask(i);
            // circle & checkbox are separate rendered
            renderCiclesOfContactsDropdown_addTask(i);
            renderSelectionStatusLayout_addTask(i);
            if (!currentUserId == 999){
                if (contacts_addTask[i].firstName == contacts_global[currentUserId].name.firstName && contacts_addTask[i].secondName == contacts_global[currentUserId].name.secondName) {
                    setYou_boardAddTask(i);
                }
            }
        }
    }
}

/**
 * HTML structure of contact list.
 * 
 * @param {Number} contactId - Index of contact in loaded_contacts array JSON
 * @returns {HTMLDivElement} HTML structure of contact row with colored circlen, name and checkbox.
 */
function editContactListHTML_addTask(contactId) {
    let contact = contacts_addTask[contactId];
    return /*html */`
        <div onclick="changeSelectionStatusContacts_addTask(${contactId})" id="dropdown_contact_addTask${contactId}" class="dropdown_contact_row">
            
            <!-- circle & name -->
            <div class="dropdown_contact_image_name">
                <div id="character_circleImg_addTask${contactId}" class="circleImg"></div>
                <div class="dropdownNames">${contact.firstName} ${contact.secondName} <span id="you_boardAddTask${contactId}"></span></div>
            </div> 

            <!-- checkbox -->
            <div class="checkbox_edit">
                <a onclick="changeSelectionStatusContacts_addTask(${contactId})" id="checkbox_edit_addTask${contactId}">
                    
                </a>
            </div>
        </div>
    `;
}

/**
 * add a "(YOU) after the first and second name at the given contactId"
 * 
 * @param {Number} contactId - Index of Contact in contacts_addTask array
 */
function setYou_boardAddTask(contactId) {
    let you = document.getElementById(`you_boardAddTask${contactId}`);
    you.innerHTML = "(You)";
}

/**
 * Set the HTML of contacts in the dropdown-list.
 * 
 * @param {Number} contactId - Index of current called contact in contacts_addTask
 */
function renderCiclesOfContactsDropdown_addTask(contactId) {
    let container = document.getElementById(`character_circleImg_addTask${contactId}`);
    let firstCharacter = contacts_addTask[contactId].firstName.charAt(0);
    let secondCharacter = contacts_addTask[contactId].secondName.charAt(0);
    container.innerHTML = dropdownContactHTML_addTask(firstCharacter, secondCharacter, contactId);   
    setcicleColor_addTask(contactId);
}

/**
 * HTML structure of contact cicle-image.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 * @param {Number} contactId - Index of Contact in loaded_contacts array
 * @param {String} firstName - first name of the Contact which is selected
 * @param {String} secondName - second name of the Contact which is selected
 * @returns {String} - HTML structure
 */
function dropdownContactHTML_addTask(firstCharacter, secondCharacter, contactId) {
    return `
        <div id="selected_task_member_addTask${contactId}" class="selected_member_cicle">${firstCharacter}${secondCharacter}</div>
    `;
}

/**
 * Set the color of contact cicle-image.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 * @param {Number} contactId - Index of Contact in loaded_contacts array
 */
function setcicleColor_addTask(contactId) {
    let cicle = document.getElementById(`selected_task_member_addTask${contactId}`);
    let color = contacts_addTask[contactId].color;
    cicle.style.backgroundColor = `${color}`;
}

/**
 * Change the design of contact row in dependence of selection status.
 * 
 * @param {Number} contactId 
 */
function renderSelectionStatusLayout_addTask(contactId) {
    let contact = contacts_addTask[contactId];
    if (contact.select_status == true) {
        setListContactOnSelect_addTask(contactId)
    } else {
        setListContactNotSelect_addTask(contactId)
    } 
}

/**
 * Colors the row to mark the Contact is "selected".
 * 
 * @param {Number} contactId - Index of Contact in loaded_contacts array
 */
function setListContactOnSelect_addTask(contactId) {
    let checkboxImg = document.getElementById(`checkbox_edit_addTask${contactId}`);
    let cicle = document.getElementById(`selected_task_member_addTask${contactId}`);
    let container_dropdown_contact = document.getElementById(`dropdown_contact_addTask${contactId}`);
    checkboxImg.innerHTML = checkboxCkeckedHTML(contactId);
    container_dropdown_contact.classList.add('contactOfTask');
    cicle.style.border = 'solid 3px white';
}

/**
 * HTML structure of checkbox checked.
 * 
 * @param {Number} contactId - Index of Contact in loaded_contacts array
 * @returns {HTMLDivElement} HTML structure of checked checkbox
 */
function checkboxCkeckedHTML(contactId) {
    return /*html */`
        <img onclick="changeSelectionStatusContacts_addTask(${contactId})" src="assets/img/check_button_checked_white.svg">
    `;
}

/**
 * Discolored the row to mark the Contact isn't "selected".
 * 
 * @param {Number} contactId - Index of Contact in loaded_contacts array
 */
function setListContactNotSelect_addTask(contactId) {
    let checkboxImg = document.getElementById(`checkbox_edit_addTask${contactId}`);
    let cicle = document.getElementById(`selected_task_member_addTask${contactId}`);
    let container_dropdown_contact = document.getElementById(`dropdown_contact_addTask${contactId}`);
    checkboxImg.innerHTML = checkboxUnckeckedHTML(contactId);
    container_dropdown_contact.classList.remove('contactOfTask');
    cicle.style.border = 'none';
}

/**
 * HTML structure of checkbox unchecked.
 * 
 * @param {Number} contactId - Index of Contact in loaded_contacts array.
 * @returns {HTMLDivElement} HTML structure of unchecked checkbox.
 */
function checkboxUnckeckedHTML(contactId) {
    return /*html */`
        <img onclick="changeSelectionStatusContacts_addTask(${contactId})" src="assets/img/check_button_unchecked.svg">
    `;
}

/**
 * On click of Contact change the function the selection status in dependence of current status.
 * If the contact was selected, the function deleteContactFromTask delete the contact from currentTaskContent.contacts.
 * If the contact was not selected, the function selectContactforTask() add the Contact to currentTaskContent.contacts.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 * @param {Number} contactId - Index of Contact in loaded_contacts array
 */
function changeSelectionStatusContacts_addTask(contactId) {
    let contact = contacts_addTask[contactId];
    if (contact.select_status == true) {
        contact.select_status = false;
    } else {
        contact.select_status = true;
    } 
    renderSelectionStatusLayout_addTask(contactId)
}