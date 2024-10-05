
let passwordCheckStatus;
let checkbox = document.getElementById("checkbox");
let password_message = document.getElementById("password_message");
let confirm_password = document.getElementById("confirm_password");
let firstName;
let secondName;
let register_btn = document.getElementById("register_btn");
let userName = document.getElementById("name");
let mail = document.getElementById("mail");
let password = document.getElementById("password");
let registerSuccessfull = document.getElementById("register_successfull");
let nameValidation = false;

async function init() {
  loadUsers();
}

async function loadUsers() {
  try {
    let ServerData;
    ServerData = await getItem("users");
    let newData = JSON.parse(ServerData.data.value);
    users = newData;
  } catch (e) {
    console.warn("Could not load users!");
  }
}

async function register() {
  checkName();
  if (checkName() == true) {
    comparePassword();
    if (passwordCheckStatus) {
      splitName(userName);
      register_btn.disabled = true;
      saveNewUser();
      await createContact();
      resetForm();
      registerSuccessfull.classList.remove("d-none");
      registerSuccessfull.innerHTML = "<h2>You Signed Up successfully</h2>";
      setInterval(() => {
        window.location.href = "index.html";
      }, 800);
    } else {
      document.getElementById("password_message").innerHTML =
      "Passwords do not match. Please check and try again!";
    }
  } else {
    window.location.hash = 'name';
  }
}

function checkName() {
  let fullName = document.getElementById('name').value.trim();
  let error_div = document.getElementById('errormessage_signup');
  let inputName = document.getElementById('name');
  // Überprüfen, ob das Eingabefeld nicht leer ist und Leerzeichen vorhanden sind
  if (fullName !== '' && fullName.includes(' ')) {
    // Wenn ja, trenne den Namen anhand des Leerzeichens 
    error_div.style.display = 'none';
    inputName.style.borderColor = '#ccc';
    return true;
  } else {
    error_div.style.display = 'flex';
    inputName.style.borderColor = '2px solid #ff0000 !important';
    return false;
  }
}

async function saveNewUser() {
  users.push({
   name: {
     firstName: firstName,
     secondName: secondName,
     color: "#ff4646",
   },
   mail: mail.value,
   password: password.value,
   lockedIn: false,
 });
 await setItem("users", users);
}

async function createContact() {
  await getContactsFromServer();
  let newContact = {
    "name": {
        "firstName": firstName,
        "secondName": secondName,
        "color": "#ff4646",
    },
    "mail": mail.value,
    "phone": '',
};
  contacts_global.push(newContact);
  sortPerson();
  await setContactsToServer();
  await getContactsFromServer();
}

function sortPerson() {
  contacts_global.sort(function (a, b) {
      let nameA = (a.name.firstName + ' ' + a.name.secondName).toUpperCase();
      let nameB = (b.name.firstName + ' ' + b.name.secondName).toUpperCase();
      if (nameA < nameB) {
          return -1;
      }
      if (nameA > nameB) {
          return 1;
      }
      return 0;
  });
}

function comparePassword() {
  if (
    document.getElementById("password").value ==
    document.getElementById("confirm_password").value
  ) {
    document.getElementById("password_message").style.color = "green";
    document.getElementById("password_message").innerHTML = "Password match!";
    passwordCheckStatus = true;
  } else {
    document.getElementById("password_message").style.color = "red";
    document.getElementById("password_message").innerHTML =
      "Password do not match!";
    passwordCheckStatus = false;
  }
}

function splitName(userName) {
  let splittedName = userName.value.split(" ");
  firstName = splittedName[0];
  secondName = splittedName[1];
}

function resetForm() {
  userName.value = "";
  mail.value = "";
  password.value = "";
  confirm_password.value = "";
  password_message.innerHTML = "";
  checkbox.checked = false;
  register_btn.disabled = false;
}
