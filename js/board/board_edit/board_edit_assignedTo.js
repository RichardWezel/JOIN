/**
 * Copy of contacts global JSON array @storage.js:34
 * 
 * @type {JSON} - 
 */
let loaded_contacts =[];

/**
 * Shows whether the dropdown list is open.
 * 
 * @type {boolean}
 */
let dropdownStatus = false;

/**
 * Load the contacts of Server in loaded_contacts array.
 * Render the content of Taskcontacts in edit dialog
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 */
async function renderAssigedToEditDialog(taskId){
    let container = document.getElementById('assignedTo_section_edit');
    await loadContacts();
    container.innerHTML = assigedToEditHTML(taskId);
    renderCiclesOfTaskContacts(taskId);
}

/**
 * Load contacts JSON in loaded_contacts array 
 */
async function loadContacts() {
    await getContactsFromServer();
    loaded_contacts = contacts_global;
}

/**
 * HTML main structure of assiged to section in edit dialog
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 * @returns {String} - HTML structure of task contacts
 */
function assigedToEditHTML(taskId) {
    return /*html */`
    <!-- label -->
    <div class="header_text_edit_section">Assiged to</div>
    <!-- dropdown selection field -->
    <div id="dropdown_main" class="dropdown">
        <!-- prompt to select contacts -->
        <div id="dropdown_text" class="dropdown_text" onclick="openDropDownList(${taskId})"> 
            Select contacts to assign
        </div>
        <!-- search input -->
        <div id="dropdown_input" class="d-none"> 
            <input onkeyup="searchContacts(${taskId})" id="search_contacts_edit" type="text">
        </div>
        <!-- triangle which shows whether the list is expanded -->
        <a class="dopdown_img_inactive" id="dropdown_arrow" onclick="openDropDownList(${taskId})">
            <img src="assets/img/arrowDropDown.svg">
        </a>
         <!-- dropdownlist of contacts for selection to current task -->
        <div id="selectedContactsSection" class="selectedContacts"></div>
    </div>
    `;
}

/**
 * Render the cicles with initials of selected task members in selected Contacts Section.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 */
function renderCiclesOfTaskContacts(taskId) {
    let container = document.getElementById(`selectedContactsSection`);
    if (container !== null) {
        container.innerHTML = '';
        for (let i = 0; i < currentTaskContent.contacts.length; i++) {
            let contact = currentTaskContent.contacts[i];
            let firstCharacter = contact.firstName.charAt(0);
            let secondCharacter = contact.secondName.charAt(0);
            let color = contact.color;
            container.innerHTML += selectedTaskMemberHTML(firstCharacter, secondCharacter, taskId, i); 
            document.getElementById(`selected_task_member${taskId}${i}`).style.backgroundColor = `${color}`;} 
        } else {
        return false
    }
}

/**
 * HTML structure of cicles 
 * 
 * @param {String} firstCharacter - first letter of first name of contact 
 * @param {String} secondCharacter - first letter of second name of contact 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 * @param {Number} i - Index of current Contact in currentTaskContent.contacts
 * @returns {HTMLDivElement}
 */
function selectedTaskMemberHTML(firstCharacter, secondCharacter, taskId, i) {
    return `
        <div class="circle_size">
            <div id="selected_task_member${taskId}${i}" class="selected_member_cicle">${firstCharacter}${secondCharacter}</div>
        </div> 
    `;
}

/**
 * Rotate the triangle, change Input/Text and show/hide the dropdownlist of contacts.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 */
function openDropDownList(taskId) {
    let dropdown_section = document.getElementById('selectedContactsSection');
    let main_section = document.getElementById('dropdown_main');
    rotateArrow();
    changeTextInInput();
    if(dropdownStatus == false) {
        dropdown_section.classList.add('flexDirection');
        main_section.style.boxShadow = '0px 8px 16px 0px rgba(0, 0, 0, 0.2)';
        showContactList(taskId);
        dropdownStatus = true;
    } else {
        renderCiclesOfTaskContacts(taskId);
        dropdown_section.classList.remove('flexDirection');
        dropdownStatus = false;
        main_section.style.boxShadow = 'none';
    }
}

/**
 * Closes the droppdown list of contcts of the assigned to section.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 */
function closeDropdownList(taskId) {
    let dropdown_section = document.getElementById('selectedContactsSection');
    let main_section = document.getElementById('dropdown_main');
    if (dropdownStatus == true) {
        rotateArrow();
        changeTextInInput();
        renderCiclesOfTaskContacts(taskId);
        dropdown_section.classList.remove('flexDirection');
        dropdownStatus = false;
        main_section.style.boxShadow = 'none';
    }
    
}

/**
 * If the dropdownStatus is false (dropdownlist isn't open), the function rotate the triangle icon with the tip up.
 * If the dropdownStatus is true (dropdownlist is open), the function rotate the triangle icon with the tip down.
 */
function rotateArrow() {
    let arrow_section = document.getElementById('dropdown_arrow')
    if (dropdownStatus == false){
        arrow_section.style.rotate = '200grad';
    } 
    else {
        arrow_section.style.rotate = '0grad';
    }
}

/**
 * Change the content of dropdown selection section from Input to Text or reverse.
 */
function changeTextInInput() {
    let text = document.getElementById('dropdown_text');
    let input = document.getElementById('dropdown_input');
    text.classList.toggle('d-none')
    input.classList.toggle('d-none')
}

/**
 * Render dropdown contact list depending on input valueOn by key up in search input 
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 */
function searchContacts(taskId) {
    let searchinput = document.getElementById('search_contacts_edit').value;
    searchinput = searchinput.toLowerCase();
    showContactList(taskId, searchinput);
    // document.getElementById('selectedContactsSection').classList.toggle('flexDirection');
}

/**
 * Shows all contacts or searched contacts
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 * @param {String} searchValue 
 */
function showContactList(taskId, searchValue) {
    let container = document.getElementById('selectedContactsSection');
    container.innerHTML = '';
    for (let i = 0; i < loaded_contacts.length; i++) {
        if (!searchValue || 
            loaded_contacts[i].name.firstName.toLowerCase().includes(searchValue) || 
            loaded_contacts[i].name.secondName.toLowerCase().includes(searchValue)) {
                container.innerHTML += editContactListHTML(taskId, i);
                // circle & checkbox are separate rendered
                renderMemberImageDropdown(taskId, i);
                renderSelectionStatusLayout(taskId, i);
                if (currentUser !== '' && currentUserId !== 999) {
                    if (loaded_contacts[i].name.firstName == contacts_global[currentUserId].name.firstName && 
                        loaded_contacts[i].name.secondName == contacts_global[currentUserId].name.secondName || 
                        loaded_contacts[i].name.firstName == contacts_global[currentUserId].name.firstName && 
                        typeof loaded_contacts[i].name.secondName == 'undefined') {
                            setYou_board_edit(taskId, i);
                    }
                }
        }
    }
}

/**
 * HTML structure of contact list.
 * Sets the second name in case of not definded.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array.
 * @param {Number} contactId - Index of contact in loaded_contacts array JSON.
 * @returns {HTMLDivElement} HTML structure of contact row with colored circlen, name and checkbox.
 */
function editContactListHTML(taskId, contactId) {
    let contact = loaded_contacts[contactId].name;
    if (typeof contact.secondName == 'undefined') {
        secondName_List = '' 
    } else {
        secondName_List = contact.secondName
    }
    return `
        <div onclick="changeSelectionStatus(${taskId}, ${contactId})" id="dropdown_contact${taskId}${contactId}" class="dropdown_contact_row">
            <!-- circle & name -->
            <div class="dropdown_contact_image_name">
                <div class="circle_size" id="character_image${taskId}${contactId}"></div>
                <div class="dropdownNames">${contact.firstName} ${secondName_List} <span id="you_edit_assignedTo${taskId}${contactId}" class="you"></span></div>
            </div> 
            <!-- checkbox -->
            <div class="checkbox_edit">
                <a id="checkbox_edit${taskId}${contactId}"></a>
            </div>
        </div>
    `
}

/**
 * Add a "(You)" to the current logged contacts in the dropdown contact list.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 * @param {Number} contactId - Index of contact in loaded_contacts array JSON
 */
function setYou_board_edit(taskId, contactId) {
    let youDiv = document.getElementById(`you_edit_assignedTo${taskId}${contactId}`);
    youDiv.innerHTML = "(You)";
}

/**
 * If the contact is containing in the contactlist of task, the Layout of Contact-row is colored.
 * If the contact isn't contain in the contactlist of task, the Layout of Contact-row isn't colored.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 * @param {Number} contactId - Index of contact in loaded_contacts array JSON
 */
function renderSelectionStatusLayout(taskId, contactId) {
    let contact = loaded_contacts[contactId].name;
    let selectedContactStatus = checkContactSelected(`${contact.firstName}`, `${contact.secondName}`)
    if (selectedContactStatus == true) {
        setListContactOnSelect(taskId, contactId)
    } else {
        setListContactNotSelect(taskId, contactId)
    } 
}

/**
 * Colors the row to mark the Contact is "selected".
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 * @param {Number} contactId - Index of contact in loaded_contacts array JSON
 */
function setListContactOnSelect(taskId, contactId) {
    let container_checkbox = document.getElementById(`checkbox_edit${taskId}${contactId}`);
    let cicle = document.getElementById(`selected_task_member${taskId}${contactId}`);
    let container_dropdown_contact = document.getElementById(`dropdown_contact${taskId}${contactId}`);
    container_checkbox.innerHTML = svgCheckbox();
    container_dropdown_contact.classList.toggle('contactOfTask');
    cicle.style.border = 'solid 3px white';
}

function svgCheckbox() {
    return `
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 8V14C17 15.6569 15.6569 17 14 17H4C2.34315 17 1 15.6569 1 14V4C1 2.34315 2.34315 1 4 1H12" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M5 9L9 13L17 1.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
}

/**
 * Discolored the row to mark the Contact isn't "selected".
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 * @param {Number} contactId - Index of contact in loaded_contacts array JSON
 */
function setListContactNotSelect(taskId, contactId) {
    let container_checkbox = document.getElementById(`checkbox_edit${taskId}${contactId}`);
    let cicle = document.getElementById(`selected_task_member${taskId}${contactId}`);
    container_checkbox.innerHTML = `<img src="assets/img/check_button_unchecked.svg">`;
    cicle.style.border = 'none';
}

/**
 * Finds out whether the contact is selected.
 * Compares the names of the global currentTaskContent.contacts with the hole contactlist of the program
 * 
 * @param {String} firstName - first name of the Contact which is selected
 * @param {String} secondName - second name of the Contact which is selected
 * @returns {Boolean} - Mark
 */
function checkContactSelected(firstName, secondName) {
    for (let i = 0; i < currentTaskContent.contacts.length; i++) {
        let contact = currentTaskContent.contacts[i];
        if (firstName == contact.firstName && secondName == contact.secondName) {
            return true
        }
    }
}

/**
 * Returns the Index of contact in currentTaskContent array fpr the contact information witch is given by variables (firstName, secondName).
 * 
 * @param {String} firstName - first name of the Contact which is selected
 * @param {String} secondName - second name of the Contact which is selected
 * @returns {Number} Index of Contact in currentTaskContent.contacts
 */
function checkContactIndex(firstName, secondName) {
    for (let i = 0; i < currentTaskContent.contacts.length; i++) {
        let contact = currentTaskContent.contacts[i];
        if (firstName == contact.firstName && secondName == contact.secondName) {
            return i
        }
    }
}

/**
 * Set the HTML of contacts in the dropdown-list.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 * @param {Number} contactId - Index of Contact in loaded_contacts array
 */
function renderMemberImageDropdown(taskId, contactId) {
    let container = document.getElementById(`character_image${taskId}${contactId}`);
    let firstCharacter = loaded_contacts[contactId].name.firstName.charAt(0);
    if (typeof loaded_contacts[contactId].name.secondName == 'undefined') {
        let secondCharacter = '';
        container.innerHTML = dropdownContactHTML(firstCharacter, secondCharacter, taskId, contactId);   
        setcicleColor(taskId, contactId);
    } else {
    let secondCharacter = loaded_contacts[contactId].name.secondName.charAt(0);
    container.innerHTML = dropdownContactHTML(firstCharacter, secondCharacter, taskId, contactId);   
    setcicleColor(taskId, contactId);
    }
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
function dropdownContactHTML(firstCharacter, secondCharacter, taskId, contactId) {
    return `
        <div id="selected_task_member${taskId}${contactId}" class="selected_member_cicle">${firstCharacter}${secondCharacter}</div>
    `;
}

/**
 * Set the color of contact cicle-image.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 * @param {Number} contactId - Index of Contact in loaded_contacts array
 */
function setcicleColor(taskId, contactId) {
    let cicle = document.getElementById(`selected_task_member${taskId}${contactId}`);
    let color = loaded_contacts[contactId].name.color;
    cicle.style.backgroundColor = `${color}`;
}

/**
 * On click of Contact change the function the selection status in dependence of current status.
 * If the contact was selected, the function deleteContactFromTask delete the contact from currentTaskContent.contacts.
 * If the contact was not selected, the function selectContactforTask() add the Contact to currentTaskContent.contacts.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 * @param {Number} contactId - Index of Contact in loaded_contacts array
 */
function changeSelectionStatus(taskId, contactId) {
    let contact = loaded_contacts[contactId].name;
    let firstName = contact.firstName;
    let secondName = contact.secondName;
    let color = contact.color;
    let selectedContactStatus = checkContactSelected(`${firstName}`, `${secondName}`)
    if (selectedContactStatus == true) {
        deleteContactFromTask(firstName, secondName, taskId)
    } else {
        selectContactforTask(taskId, firstName, secondName, color)
    } 
}

/**
 * Delete the Contact which is not more selected for the task.
 * 
 * @param {String} firstName - first name of the Contact which is selected
 * @param {String} secondName - second name of the Contact which is selected
 * @param {Number} taskId - Index of current called task in tasks[] global array
 */
function deleteContactFromTask(firstName, secondName, taskId) {
    let index_of_deleted_name = checkContactIndex(firstName, secondName);
    currentTaskContent.contacts.splice(index_of_deleted_name, 1);
    showContactList(taskId);
}

/**
 * Add the Contact which is selected for the task to currentTaskContent.contacts.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 * @param {Number} contactId - Index of Contact in loaded_contacts array
 * @param {String} firstName - first name of the Contact which is selected
 * @param {String} secondName - second name of the Contact which is selected
 */
function selectContactforTask(taskId, firstName, secondName, color) {
    currentTaskContent.contacts.push(
        {
            "firstName": `${firstName}`,
            "secondName": `${secondName}`,
            "color": `${color}`
        },
    );
    showContactList(taskId);
}