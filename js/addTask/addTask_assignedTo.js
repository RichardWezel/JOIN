/**
 * Marks the status whether the dropdown list is open or not.
 */
let dropdown_status_assignedTo = false;

/**
 * Builds the dropdown list. Sets (You)
 */
async function renderDropList() {
  await getCurrentUserIdFromServer();
  await getCurrentUserFromServer();
  let dropdown = document.getElementById("dropdown");
  dropdown.innerHTML = "";
  for (let i = 0; i < contacts_addTask.length; i++) {
    let contact = contacts_addTask[i];
    dropdown.innerHTML += dropdownHtml(contact, i);
    if (currentUser !== '' && currentUserId !== 999 || currentUser !== 999 && currentUserId !== 999) {
      if (contact.name.firstName == contacts_global[currentUserId].name.firstName && 
          contact.name.secondName == contacts_global[currentUserId].name.secondName || 
          contact.name.firstName == contacts_global[currentUserId].name.firstName && 
          typeof contact.name.secondName == 'undefined') {
            setYou_addTask(i); 
          }
    }
  }
}

/**
 * Sets the "(You)" to the name depending on current loggIn status.
 */
function setYou_addTask(contactId) {
  let you_element = document.getElementById(`you${contactId}`);
  you_element.innerHTML = '(You)'
} 
  
/**
 * HTML structure of dropdownlist.
 * Sets in case of second name is unset.
 * 
 * @param {JSON} contact - Objekt of contacts_addTask
 * @param {Number} contactId - Index of contact in contacts_addTask array
 * @returns {HTMLAnchorElement}
 */
function dropdownHtml(contact, contactId) {
  contact = contact.name;
  let secondName = contact.secondName;
  if (typeof secondName == 'undefined') {
    secondChar = '';
    secondName = '';
  } else {
    secondChar = secondName.charAt(0)
  }
  return `
  <a class="dropdown_assign" id="contact${contactId}" onclick="selectFromDropdown(${contactId})">
      <!-- contact -->
      <div class="display_center gap ">
        <div class="member_cicle_main">
          <div class="member_cicle" style='background-color:${contact.color};'>
            ${contact.firstName.charAt(0)}
            ${secondChar}
          </div>
        </div>
        <div class="member_name">${contact.firstName} ${secondName} <div id="you${contactId}" class="you"></div></div>
      </div> 
      <!-- checkbox -->
      <div class="dropdown_img" id="selected_img${contactId}">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>
        </svg>
      </div>
  </a>
  `;
}

/**
 * This function put the selected member from the drop down list assigned to 
 * in a array and div container
 * @param {String} color  - fill the color from JSON in the circle.
 * @param {String} firstName - fill the first name into the circle from the JSON.
 * @param {String} secondName - fill the second name into the circle from the JSON.
 * @param {Number} i - Index of contact in contacts_addTask array
 */
function selectFromDropdown(i) {
  let contact = document.getElementById(`contact${i}`);
  let checkbox = document.getElementById(`selected_img${i}`);
  if (contacts_addTask[i].select_status == false) {
    contacts_addTask[i].select_status = true;
    contact.classList.add('selected');
    checkbox.innerHTML = checkboxHTML_checked();
    renderSelectedContactsRow();
  } else if (contacts_addTask[i].select_status == true){
    contacts_addTask[i].select_status = false;
    contact.classList.remove('selected');
    checkbox.innerHTML = checkboxHTML_unchecked();
    renderSelectedContactsRow();
  }
}
  
/**
 * HTML structure of checked checkboxes of contacts in the dropdown list in the assigned to section.
 * 
 * @returns {SVGGraphicsElement} Checkbox graphic "checked"
 */
function checkboxHTML_checked() {
  return `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 8V14C17 15.6569 15.6569 17 14 17H4C2.34315 17 1 15.6569 1 14V4C1 2.34315 2.34315 1 4 1H12" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M5 9L9 13L17 1.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}
  
/**
 * HTML structure of unchecked checkboxes of contacts in the dropdown list in the assigned to section.
 * 
 * @returns {SVGGraphicsElement} Checkbox graphic "unchecked"
 */
function checkboxHTML_unchecked() {
  return `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>
    </svg>
  `;
}

/**
 * Shows the selected contacts in the dropdown list at assigned to section
 */
function renderSelectedContactsRow() {
  let selected_contacts_row = document.getElementById('row_selected_contacts_circles');
  let max_member_amount = 3;
  selected_contacts_row.innerHTML = '';
  let selected_members = contacts_addTask.filter(obj => obj.select_status === true);
  for (let i = 0; i < contacts_addTask.length; i++) {
    let contact = contacts_addTask[i];
    if (i < max_member_amount) {
      if (contact.select_status == true) {
        selected_contacts_row.innerHTML += dropdownHtmlMemberCircle(i);
      }
    } 
  }
  if (selected_members.length > max_member_amount) {
    let amount = selected_members.length - max_member_amount;
    selected_contacts_row.innerHTML += dropdownHtmlAdditionalMemberCircle(amount)
  }
}

/**
 * Creates a grey circle with amount of additional members over the max_member_amount.
 * 
 * @param {Number} amount - Amount of selected members-
 * @returns {HTMLDivElement}
 */
function dropdownHtmlAdditionalMemberCircle(amount) {

  return `
    <div class="member_cicle_main">
      <div class="member_cicle_additional">
        +${amount}
      </div>
    </div>
  `;
}
  
/**
 * Creates the circle with initials from contacts are selected.
 * 
 * @param {Number} i - Index of contact in contacts_addTask array
 * @returns {HTMLDivElement}
 */
function dropdownHtmlMemberCircle(i) {
  let firstName = contacts_addTask[i].name.firstName;
  let secondName = contacts_addTask[i].name.secondName;
  let color = contacts_addTask[i].name.color;
  return `
    <div class="member_cicle_main">
      <div class="member_cicle" style="background-color:${color};">
        ${firstName.charAt(0)}
        ${secondName.charAt(0)}
      </div>
    </div>
  `;
}
  
/**
 * The function is for the filtering of the dropdown menu 
 */
function filterFunction() {
  // Filter on the drop Down menu
  let input, filter, div, options, i, txtValue;
  input = document.getElementById("dropdownInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("dropdown");
  options = div.getElementsByClassName("dropdown_assign");
  for (i = 0; i < options.length; i++) {
    txtValue = options[i].textContent || options[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      options[i].style.display = "";
    } else {
      options[i].style.display = "none";
    }
  }
}

/**
 * Opens or closes the drop down list with contacts of the assigned to section in dependence of current status of variable "dropdown_status_assignedTo".
 */
function open_close_Dropdownlsit_contacts() {
  if (dropdown_status_assignedTo == false) {
    openDropdownlsit_contacts()
  } else if (dropdown_status_assignedTo == true){
    closeDropdownlsit_contacts()
  }
}

/**
 * Opens the dropdownlist with contacts of the assigned to section.
 */
function openDropdownlsit_contacts() {
  let assignedTo_section = document.getElementById('assigned_to_section')
  let dropdown_container = document.getElementById('dropdown');
  let buttonfield = document.getElementById("dropbtn");
  let arrow_icon = document.getElementById("arrow")
  let inputfield = document.getElementById("dropdownInput");
  
  dropdown_status_assignedTo = true;
  dropdown_container.classList.add('show_task');  // dropdown-list appear
  inputfield.classList.remove("d-none");          // input appear
  buttonfield.classList.add("d-none");            // btn with text disappears
  arrow_icon.classList.add("rotated");            // triangle rotate to top
  assignedTo_section.classList.add('background_and_radius_fitting'); // add white background
}

/**
 * Closes the dropdownlist with contacts of the assigned to section.
 */
function closeDropdownlsit_contacts() {
  let assignedTo_section = document.getElementById('assigned_to_section')
  let dropdown_container = document.getElementById('dropdown');
  let buttonfield = document.getElementById("dropbtn");
  let arrow_icon = document.getElementById("arrow")
  let inputfield = document.getElementById("dropdownInput");
  dropdown_status_assignedTo = false;
  dropdown_container.classList.remove('show_task');  // dropdown-list disappear
  inputfield.classList.add("d-none");          // input disappear
  buttonfield.classList.remove("d-none");            // btn with text appears
  arrow_icon.classList.remove("rotated");            // triangle rotate to bottom
  assignedTo_section.classList.remove('background_and_radius_fitting'); // remove white background
}