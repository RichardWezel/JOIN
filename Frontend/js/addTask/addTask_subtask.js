/**
 * Array of added subtasks.
 * Example:
 * 0: 
 *    done: false
 *    name: "test"
 */
let subtasklists = [];

/**
 * Takes over the new subtast value.
 * 
 * @param {Number} subtaskId Index of current subtask.
 */
function takeoverNewSubtaskValue(subtaskId) {
  let input = document.getElementById(`new_subtask_edit_text${subtaskId}`);
  let subtask_element = document.getElementById(`subtasklist_element${subtaskId}`);
  subtasklists[subtaskId].name = input.value;
  subtask_element.style.paddingLeft = '10px';
  subtask_element.classList.remove("no-hover");
  rendersubtasklist();
}

/**
 * Handles the change of buttons depending on the content of the input field. 
 * If the field has content, buttons to add or delete are displayed. 
 * When there is no more content, the plus is displayed.
 */
function ChangeToSubtasks() {
  let subtaskIcons_check_delete = document.getElementById('delet_and_check_section');
  let subtask_plus = document.getElementById('subtaskIcons')
  if (document.getElementById('subtasksInput').value.length > 0) {
    subtask_plus.classList.add('d-none');
    subtaskIcons_check_delete.classList.remove('d-none');
  } else {
    subtask_plus.classList.remove('d-none');
    subtaskIcons_check_delete.classList.add('d-none');
  }
}

/**
 * Saves the Input value of subtask section in "subtasklists" array.
 * Returns to start state. 
 * Displays the subtasklist with all and new subtasks.
 */
function pushToSubtasks() { 
  let subtasksInputElement = document.getElementById('subtasksInput');
  let subtasksInputValue = subtasksInputElement.value;
  if(subtasksInputValue === ''){
    subtasksInputElement.value = '';  
    ChangeToSubtasks()
  } else {
    subtasklists.push(
      {
        "name": subtasksInputValue,
        "done": false,
      }
    );
    subtasksInputElement.value = ''; 
    ChangeToSubtasks();
    rendersubtasklist();
    let lastIdNumber = subtasklists.length - 1;
    let targetElement = document.getElementById(`subtasklist_element${lastIdNumber}`);
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Delete the value of input field at subtask section
 */
function deleteSubTasks() {
  let subtasksInput = document.getElementById('subtasksInput');
  subtasksInput.value = '';
  ChangeToSubtasks();
}

/**
 * Shows the list of subtasks of the new task.
 */
function rendersubtasklist() {
  let rendersubtasklist = document.getElementById("subtasklist");
  rendersubtasklist.innerHTML = "";
  for (let i = 0; i < subtasklists.length; i++) {
    let subtaskHTML = subtasklists[i].name;
    rendersubtasklist.innerHTML += subtasklistHTML(subtaskHTML, i);
  }
  subtasklistHTML();
}

/**
 * Deletes the subtask from subtasklists array.
 * 
 * @param {Number} subtaskId - Index of current subtask in subtasklists.
 */
function removeSubtask(subtaskId) {
  let subtaskcheck = document.getElementById('subtaskcheck');
  if(subtasklists === 0){
    subtaskcheck.classList.add('d-none');
    rendersubtasklist();
  }
  subtasklists.splice(subtaskId, 1);
  rendersubtasklist();
}

/**
 * Shows the HTML structure of list elements at subtask list.
 * 
 * @param {String} subtask_value - content of subtask
 * @param {Number} subtaskId - Index of current subtask in subtasklists.
 * @returns {HTMLDivElement} HTML structure of list elements.
 */
function subtasklistHTML(subtask_value, subtaskId) {
  return `
  <div id="subtasklist_element${subtaskId}" class="subtasklist_element" ondblclick="editNewSubtask(${subtaskId})">
  <div id="subtaskText" class="subtask_text_content_main">
    <div class="point">•</div>
    <div class="subtask_text_content">${subtask_value}</div>
  </div>
  <div class="pencil_and_trash_new_subtask">
    <a class="edit_pencil" onclick="editNewSubtask(${subtaskId})">
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="#2A3647"/>
      </svg>
    </a>

    <div class="line"></div>

    <a class="trash" onclick="removeSubtask(${subtaskId})">
      <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
      </svg>
    </a>
    
  </div>
  </div>`;
}

/**
 * The subtask to be changed switches to an input field to change the content.
 * 
 * @param {Number} subtaskId  - Index of current subtask in the subtasklist.
 */
function editNewSubtask(subtaskId) {
  let subtask = subtasklists[subtaskId];
  let subtask_element = document.getElementById(`subtasklist_element${subtaskId}`);
  subtask_element.innerHTML = subtaskEditHTML(subtask, subtaskId);
  subtask_element.style.paddingLeft = '0px';
  subtask_element.classList.add("no-hover");
}

/**
 * HTML structure of edit modus of current subtask to be edit. 
 * 
 * @param {String} subtask_value - Content of subtask
 * @param {Number} subtaskId - Index of current subtask in the subtasklist.
 * @returns {HTMLDivElement}
 */
function subtaskEditHTML(subtask_value, subtaskId) {
  return `
    <div class="new_subtask_edit_main">
      <input id="new_subtask_edit_text${subtaskId}" class="new_subtask_edit_text" value="${subtask_value.name}" >
      <div class="subtask_edit_main">
        <a class="trash" onclick="removeSubtask(${subtaskId})">
          <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
          </svg>
        </a>

        <div class="line"></div>

        <a class="confirm_edit_new_subtask" onclick="takeoverNewSubtaskValue(${subtaskId})">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  `;
}
  