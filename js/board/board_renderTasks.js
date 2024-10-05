
/**
 * Calls the functions which are responsiv for sort the task-elements in the right column of Kanban Board
 * Deletes the content of columns, 
 * filter the content by searched characters, 
 * add "no Task" Element where is no task and checks whether there is no content for searched characters to set a toastmessage by true.
 * 
 * @param {String} search_content - searched characters to sort the board 
 */
async function renderColumnContent(search_content){
    let toDo_container = document.getElementById('task_container_ToDo');
    let inProgress_container = document.getElementById('task_container_InProgress');
    let awaitFeedback_container = document.getElementById('task_container_AwaitFeedback');
    let done_container = document.getElementById('task_container_Done');
    deleteColumnContentToRenderNew(toDo_container, inProgress_container, awaitFeedback_container, done_container);
    await filterTasks(toDo_container, inProgress_container, awaitFeedback_container, done_container, search_content);
    noTask(toDo_container, inProgress_container, awaitFeedback_container, done_container);
    checkNoSearchcontentFound();
}

/**
 * Delete content of columns for reset content
 * 
 * @param {HTMLDivElement} toDo_container - Column showing tasks to be completed
 * @param {HTMLDivElement} inProgress_container - Column showing tasks that are in progress
 * @param {HTMLDivElement} awaitFeedback_container - Column showing tasks that require feedback from colleagues
 * @param {HTMLDivElement} done_container - Column showing tasks that have been completed
 */
function deleteColumnContentToRenderNew(toDo_container, inProgress_container, awaitFeedback_container, done_container) {
    toDo_container.innerHTML = '';
    inProgress_container.innerHTML = '';
    awaitFeedback_container.innerHTML = '';
    done_container.innerHTML = '';
}

/**
 * Sorts all tasks by processing status.
 * Tasks are only displayed if there is no search or the content matches the search result.
 * 
 * @param {HTMLDivElement} toDo - Column showing tasks to be completed
 * @param {HTMLDivElement} inProgress - Column showing tasks that are in progress
 * @param {HTMLDivElement} awaitFeedback - Column showing tasks that require feedback from colleagues
 * @param {HTMLDivElement} done - Column showing tasks that have been completed
 * @param {String} search_content - letters by which the Kanban board should be sorted
 */
function filterTasks(toDo, inProgress, awaitFeedback, done, search_content) {
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        switch (task.status) { 

        case 'toDo': 
            if(!search_content || 
                task.title.toLowerCase().includes(search_content) || 
                task.description.toLowerCase().includes(search_content) || 
                task.category.toLowerCase().includes(search_content)) 
                {
                    addTaskElementToBoard(toDo, task, i)
                }
            break;
        case 'inProgress': 
            if(!search_content || 
                task.title.toLowerCase().includes(search_content) || 
                task.description.toLowerCase().includes(search_content) || 
                task.category.toLowerCase().includes(search_content)) 
                {
                    addTaskElementToBoard(inProgress, task, i)
                }
            break;
        case 'awaitFeedback':
            if(!search_content || 
                task.title.toLowerCase().includes(search_content) || 
                task.description.toLowerCase().includes(search_content) || 
                task.category.toLowerCase().includes(search_content)) 
                {
                    addTaskElementToBoard(awaitFeedback, task, i)
                }
            break;
        case 'done':
            if(!search_content || 
                task.title.toLowerCase().includes(search_content) || 
                task.description.toLowerCase().includes(search_content) || 
                task.category.toLowerCase().includes(search_content)) 
                {
                    addTaskElementToBoard(done, task, i)
                }
            break;
        }
    }
}

/**
 * Adds the HTML Elements to the right column, 
 * limits the number of characters of description 
 * and calls the functions which need a special CSS design by special conditions.
 * 
 * @param {String} columns_status - status of task process
 * @param {HTMLElement} task - JSON Object of tasks array
 * @param {Number} taskId - Index of task in tasks array
 */
function addTaskElementToBoard(columns_status, task, taskId) {
    columns_status.innerHTML += taskHTML(task, taskId);
    limitNumberOfCharacters(`task_description${taskId}`, 45);
    renderTaskElements(taskId)
}

/**
 * Limits the number of characters in the description text
 * 
 * @param {String} id - Id of the document witch contains the description.
 * @param {Number} maxZeichen - Number of max number of characters
 */
function limitNumberOfCharacters(id, maxZeichen) {
    let container = document.getElementById(id);
    let text = container.textContent;
    if (text.length > maxZeichen) {
        let gekürzterText = text.substring(0, maxZeichen) + '...';
        container.textContent = gekürzterText;
    }
}

/**
 * Define the HTML structure of tasks in the Kanban Board
 * 
 * @param {JSON} task - JSON Object of tasks array
 * @param {Number} taskId - Index of task in tasks array
 * @returns {String} HTML structure of tasks in the columns of Kanban Board
 */
function taskHTML(task, taskId) {
    let category = task.category;
    let title = task.title;
    let description = task.description;
    let status = task.status;
    return /*html */`
    <article 
    id="task${taskId}" 
    onclick="openTaskDetailsDialog(${taskId})" 
    draggable="true" 
    ondragstart="startDragging(${taskId}, '${status}', event)" 
    ondragend="deleteBorderStyles()" 
    ontouchmove="handleTouchMove(event, ${taskId})"
    ontouchstart="touchStart(${taskId}, '${status}', event)" 
    ontouchend="touchEnd(event)" 
    class="task">
    <div id="task_category${taskId}" class="task_category">${category}</div>
    <div class="task_title">${title}</div>
    <div id="task_description${taskId}" class="task_description">${description}</div>
    <div id="task_progressbar${taskId}" class="task_progress"></div>
    <div class="task_members_prio">
        <div id="task_member_section${taskId}" class="task_members"></div>
        <div id="prio_icon${taskId}" class="task_prio">
            <img src="" alt="">
        </div>
    </div>
</article>
    `
}

/**
 * Render "no task" elements for columns without content.
 * 
 * @param {HTMLDivElement} toDo_container 
 * @param {HTMLDivElement} inProgress_container 
 * @param {HTMLDivElement} awaitFeedback_container 
 * @param {HTMLDivElement} done_container 
 */
function noTask(toDo_container, inProgress_container, awaitFeedback_container, done_container) {
    if (toDo_container.innerHTML == '') {
        toDo_container.innerHTML = noTaskHTML('To do');
    };
    if (inProgress_container.innerHTML == '') {
        inProgress_container.innerHTML = noTaskHTML('In Progress');
    };
    if (awaitFeedback_container.innerHTML == '') {
        awaitFeedback_container.innerHTML = noTaskHTML('Await feedback');
    };
    if (done_container.innerHTML == '') {
        done_container.innerHTML = noTaskHTML('Done');
    };
}

/**
 * HTML structure of "no task" div.
 * 
 * @param {String} header_text - header of column
 * @returns {String} HTML structure of Element
 */
function noTaskHTML(header_text) {
    return `<div class="no_task"> no ${header_text} task</div>`
}

/**
 * If the searched term not found in any task, the toast message appear. 
 */
function checkNoSearchcontentFound() {
   let searchTerm = document.getElementById('task_to_be_found').value.toLowerCase();
   let found = tasks.some(function(task) {
        let title = task.title.toLowerCase();
        let description = task.description.toLowerCase();
        return title.includes(searchTerm) || description.includes(searchTerm);
        }
    );
   if (!found) {
       document.getElementById('toast_message_no_task_found').style.display = 'flex';
   } else {
       document.getElementById('toast_message_no_task_found').style.display = 'none';
   }
}

/**
 * Calls all functions that require a dependent element design of task.
 * 
 * @param {Number} taskId - Index of task in tasks array.
 */
function renderTaskElements(taskId) {
    setColorOfCategory(taskId); 
    showprogressbar(taskId); 
    renderInitialCirclesOfTaskMembers(taskId);
    renderPriority(taskId); 
}

/**
 * Set the background-color of category-element.
 * 
 * @param {Number} taskId - Index of task in tasks array
 */
function setColorOfCategory(taskId) {
    let category = tasks[taskId].category;
    container = document.getElementById(`task_category${taskId}`);
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
 * Set the priority icon.
 * 
 * @param {Number} taskId - Index of task in tasks array
 */
function renderPriority(taskId) {
    let priority = tasks[taskId].priority;
    let container = document.getElementById(`prio_icon${taskId}`);
    switch (priority) {
        case "Low":
          container.innerHTML = `<img src="assets/img/Prio_low_color_origin.svg" alt="">`;
          break;
        case "Medium":
            container.innerHTML = `<img src="assets/img/Prio_medium_color_origin.svg" alt="">`;
          break;
        case "Urgent":
          container.innerHTML = `<img src="assets/img/Prio_urgent_color_origin.svg" alt="">`;
        break;
    }
}

/**
 * If there are contacts added to the task, the function shows colored cicles with the initials of contacts.
 * More than 5 Contacts are showen as a grey cicle with additional amount of contacts, which are not showen.
 * 
 * @param {Number} taskId - Index of task in tasks array
 */
function renderInitialCirclesOfTaskMembers(taskId) {
    let task = tasks[taskId];
    let container = document.getElementById(`task_member_section${taskId}`);
    container.innerHTML = '';
    if (!task.contacts.length == 0) {
        for (let i = 0; i < task.contacts.length; i++) {
            let contact = task.contacts[i];
            let firstCharacter = contact.firstName.charAt(0);
            let secondCharacter = contact.secondName.charAt(0);
            let color = contact.color;
            if (i < 3) {
                container.innerHTML += taskMemberHTML(firstCharacter, secondCharacter, taskId, i); 
                document.getElementById(`task_member${taskId}${i}`).style.backgroundColor = `${color}`;
                if (color == "yellow") {
                    document.getElementById(`task_member${taskId}${i}`).style.color = `var(--bgdarkblue)`;
                }
                // create the position of cicles:  
                if(i > 0) {
                    setAttributesMoreMemberHTML(taskId, i);
                }
            } else if(i > 2){
                // sobald mehr als 3 Kontakte da sind
                let moreNumber = task.contacts.length - 3;
                container.innerHTML += moreMemberHTML(taskId, i, moreNumber); 
                setAttributesMoreMemberHTML(taskId, i);
                break
            }
        }
    }
}

/**
 * Sets the style of grex additional task contacts.
 * 
 * @param {Number} taskId - Index of task in tasks array
 * @param {Number} contactId - Index of Contact in tasks[taskId].contacts
 */
function setAttributesMoreMemberHTML(taskId, contactId) {
    let additionalTaskMember = document.getElementById(`task_member${taskId}${contactId}`);
    additionalTaskMember.style.position = 'relative';
    additionalTaskMember.style.left     = calcPositionMember(contactId);
}

/**
 * Shows a gry cicle with the nimber of additional members which are not showen.
 * 
 * @param {Number} taskId - Index of task in tasks array
 * @param {Number} contactId - Index of Contact in the key "contacts" of task
 * @param {Number} moreNumber - calculated not visible contacts.
 * @returns 
 */
function moreMemberHTML(taskId, contactId, moreNumber) {
    return `
    <div id="task_member${taskId}${contactId}" class="member_cycle more_member_color">+${moreNumber}</div>
`;
}

/**
 * HTML structure of contact image (in form of circle with initials in the middle).
 * 
 * @param {String} firstCharacter - First letter of first name of contact which is selected for the task
 * @param {String} secondCharacter - First letter of second name of contact which is selected for the task
 * @param {String} colorClass - Name of class with color attribute
 * @param {Number} taskId - Index of task in tasks array
 * @param {Number} i - Index of Contact in the key "contacts" of task
 * @returns {String} - HTML structure of circle with initials in the middle
 */
function taskMemberHTML(firstCharacter, secondCharacter, taskId, i) {
    return `
        <div id="task_member${taskId}${i}" class="member_cycle">${firstCharacter}${secondCharacter}</div>
    `;
}

/**
 * Calculates the position of circle
 * 
 * @param {Number} contactId_task - Index of Contact in the key "contacts" of task
 * @returns {Number} pixel amount for shift to the right of first cicle
 */
function calcPositionMember(contactId_task) {
    let position = contactId_task * -9;
    return `${position}px`
}