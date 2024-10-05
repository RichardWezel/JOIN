/**
 * Includes templates on the site.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[template-src]");

  for (let element of includeElements) {
    let file = element.getAttribute("template-src");
    let response = await fetch(file);
    if (response.ok) {
      let text = await response.text();
      element.innerHTML = text;
    } else {
      element.innerHTML = "Page not found.";
    }
  }
  setActiveLink();
}

/**
 * Marks the current html webpage on the sidebar with a different background-color.
 */
function setActiveLink() {
  let url = window.location.href;
  let links = document.querySelectorAll('.side_navbar_section');
  links.forEach(function(link) {
    if (url.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });
}

/**
 * Sets the innitials of logged account in the head navbar in the top right corner.
 * currentUser is an Array in storage.js.
 */
async function setUserInitialsAtHeader() {
  await getCurrentUserFromServer();
  let accountLogo = document.getElementById('navbarHeadIcon');
  if (currentUser.length === 0 || typeof currentUser == "undefined" || currentUser == '' || currentUser == 999) {
    accountLogo.innerHTML = 'G';
  } else if (typeof currentUser.name.secondName == "undefined" || typeof currentUser.name.secondName == '') {
    let firstName = currentUser.name.firstName;
    firstName = firstName.charAt(0);
    accountLogo.innerHTML = `${firstName}`;
  } else {
    let firstName = currentUser.name.firstName;
    firstName = firstName.charAt(0);
    let secondName = currentUser.name.secondName;
    secondName = secondName.charAt(0);
    accountLogo.innerHTML = `${firstName} ${secondName}`;
  }
}