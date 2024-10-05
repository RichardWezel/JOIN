let contacts_summary = [];
let toDoAmount = 0;
let inProgressAmount = 0;
let awaitingFeedbackAmount = 0;
let doneAmount = 0;
let allAmounts = 0;
let urgentAmount = 0;
let nextDueDate;
let tasks_summery = '';

function isMaxWidth1000() {
  return window.matchMedia('(max-width: 1000px)').matches;
}
/**
 * 
 */
async function init() {
  await includeHTML(); // @include.js
  if(isMaxWidth1000() == true) {
    await greeting()
    await setUserInitialsAtHeader(); //@include.js
    await loadServerData();
    copyTasksArray();
    copyContactsArray();
    calcValuesOfSummery();
    getNextDueDate();
    render();
  } else {
    let summary_container = document.getElementById('summary_main_container');
    summary_container.style.display = 'flex';
    let container = document.getElementById('good_morning_container');
    container.style.display = 'none';
    await setUserInitialsAtHeader(); //@include.js
    await loadServerData();
    await render();
    copyTasksArray();
    copyContactsArray();
    calcValuesOfSummery();
    getNextDueDate();
    render();
  }
}

async function greeting() {
    let summary_container = document.getElementById('summary_main_container');
    let container = document.getElementById('good_morning_container');
    let text = document.getElementById('good_morning_text');
    let user = document.getElementById('user_name_first')
    summary_container.style.display = 'none';
    await getCurrentUserFromServer();
    await getCurrentUserIdFromServer();
    if (currentUserId == 999) {
      text.innerHTML = 'Good morning!';
    } else {
      text.innerHTML = 'Good morning,';
      user.innerHTML = `${currentUser.name.firstName} ${currentUser.name.secondName}`;
    }
    await timeout(2000);
    container.style.display = 'none';
    summary_container.style.display = 'flex';
}

/**
 * Starts a timeout.
 * 
 * @param {Number} ms - Time of timeout
 * @returns {TimeRanges}
 */
function timeout(ms) {
  return new Promise(res => setTimeout(res,ms));
}

/**
 * Loads the data from server of contacts_global, tasks, currentUserId.
 */
async function loadServerData() {
  await getContactsFromServer();
  await getTasksFromServer();
  await getCurrentUserIdFromServer();
}

function calcValuesOfSummery() {
  calcTaskAmount();
  calcSumOfAmounts();
  calcUrgentAmount();
}

async function copyTasksArray() {
  tasks_summery = JSON.parse(JSON.stringify(tasks));
  await changeDateFormatOfTasks();
}

async function changeDateFormatOfTasks() {
  tasks_summery = tasks.map((task) => {
    let [DD, MM, YY] = task.dueDate.split("/");
    return { ...task, dueDate: new Date(`20${YY}-${MM}-${DD}`) };
  });
}

function copyContactsArray() {
  contacts_summary = JSON.parse(JSON.stringify(contacts_global));
}

function render() {
  renderToDoAmount();
  renderDoneAmount();
  renderNextDueDate();
  renderUrgentAmount();
  renderAllAmount();
  renderInProgressAmount();
  renderAwaitingFeedbackAmount();
  renderUserName();
}

function calcTaskAmount() {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    switch (task.status) {
      case "toDo":
        toDoAmount++;
        break;
      case "inProgress":
        inProgressAmount++;
        break;
      case "awaitFeedback":
        awaitingFeedbackAmount++;
        break;
      case "done":
        doneAmount++;
        break;
    }
  }
}

function calcSumOfAmounts() {
  allAmounts =
    toDoAmount + inProgressAmount + awaitingFeedbackAmount + doneAmount;
}

function renderToDoAmount() {
  let toDoAmountElement = document.getElementById("to_do_amount");
  toDoAmountElement.innerHTML = toDoAmount;
}

function renderDoneAmount() {
  let doneAmountElement = document.getElementById("done_amount");
  doneAmountElement.innerHTML = doneAmount;
}

function renderAllAmount() {
  let allAmountElement = document.getElementById("all_amounts");
  allAmountElement.innerHTML = allAmounts;
}

function renderInProgressAmount() {
  let inProgressAmountElement = document.getElementById("in_progress_amount");
  inProgressAmountElement.innerHTML = inProgressAmount;
}

function renderAwaitingFeedbackAmount() {
  let awaitingFeedbackAmountElement = document.getElementById(
    "awaiting_feedback_amount"
  );
  awaitingFeedbackAmountElement.innerHTML = awaitingFeedbackAmount;
}

function getNextDueDate() {
  let tasksNotDone = tasks.filter((task) => task.status != "done").sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Überprüfen, ob das Array tasksNotDone leer ist
  if (tasksNotDone.length > 0) {
    let parsedValue = new Date(tasksNotDone[0].dueDate); // Konvertiert das Datum in das richtige Format
    nextDueDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(parsedValue);
    return nextDueDate;
  } else {
    return "Keine ausstehenden Aufgaben gefunden.";
  }
}

function renderNextDueDate() {
  let nextDueDateElement = document.getElementById("next_due_date");
  nextDueDateElement.innerHTML = nextDueDate;
}

function calcUrgentAmount() {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task.priority == "Urgent") {
      urgentAmount++;
    }
  }
}

function renderUrgentAmount() {
  let urgentAmountElement = document.getElementById("urgent_amount");
  urgentAmountElement.innerHTML = urgentAmount;
}

function renderUserName() {
  let userNameElement = document.getElementById("user_name");
  if (currentUser.length === 0 || typeof currentUser == "undefined" || currentUser[0] == '' || currentUser == 999) {
    userNameElement.innerHTML = `Guest`;
  } else if (typeof currentUser.name.secondName == "undefined") {
    let firstName = currentUser.name.firstName;
    userNameElement.innerHTML = `${firstName}`; 
  } else {
    userNameElement.innerHTML = `${currentUser.name.firstName} ${currentUser.name.secondName}`;
  }
}

function hover(element, newSrc) {
  let img = element.querySelector("img");
  img.setAttribute("src", newSrc);
}

function unhover(element, originalSrc) {
  let img = element.querySelector("img");
  img.setAttribute("src", originalSrc);
}