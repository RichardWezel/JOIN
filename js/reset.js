
/**
 * Set the content of tasks.json file to Server.
 */
async function resetStorageOfServer_tasks() {
    await setItem('tasks', [
      {
          "title": "Kochwelt Page & Recipe Recommender",
          "description": "Build start page with recipe recommendation.",
          "category": "User Story",
          "contacts": [
              {
                  "firstName": "Anton",
                  "secondName": "Mayer",
                  "color": "orange",
                  "lockedIn": false
              },
              {
                  "firstName": "Emmanuel",
                  "secondName": "Mauer",
                  "color": "turquoise",
                  "lockedIn": false
              },
              {
                  "firstName": "Marcel",
                  "secondName": "Bauer",
                  "color": "darkslateblue",
                  "lockedIn": false
              }
          ],
          "dueDate": "11/07/24",
          "priority": "Medium",
          "subtasks": [
              {
                  "name": "Implement Recipe Recommendation",
                  "done": true
              },
              {
                  "name": "Start Page Layout",
                  "done": false
              }
          ],
          "status": "inProgress"
      },
      {
          "title": "HTML Base Template Creation",
          "description": "Create reusable HTML base templates...",
          "category": "Technical Task",
          "contacts": [
              {
                  "firstName": "David",
                  "secondName": "Eisenberg",
                  "color": "violet",
                  "lockedIn": false
              },
              {
                  "firstName": "Benedict",
                  "secondName": "Ziegler",
                  "color": "mediumslateblue",
                  "lockedIn": false
              },
              {
                  "firstName": "Anja",
                  "secondName": "Schulz",
                  "color": "blueviolet",
                  "lockedIn": false
              }
          ],
          "dueDate": "10/05/26",
          "priority": "Low",
          "subtasks": [],
          "status": "awaitFeedback"
      },
      {
          "title": "Daily Kochwelt Recipe",
          "description": "Implement daily recipe and portion calculator....",
          "category": "User Story",
          "contacts": [
              {
                  "firstName": "Eva",
                  "secondName": "Fischer",
                  "color": "yellow",
                  "lockedIn": false
              },
              {
                  "firstName": "Anja",
                  "secondName": "Schulz",
                  "color": "blueviolet",
                  "lockedIn": false
              },
              {
                  "firstName": "Tatjana",
                  "secondName": "Wolf",
                  "color": "red",
                  "lockedIn": false
              }
          ],
          "dueDate": "30/12/24",
          "priority": "Medium",
          "subtasks": [],
          "status": "awaitFeedback"
      },
      {
          "title": "CSS Architecture Planning",
          "description": "Define CSS naming conventions and structure",
          "category": "Technical Task",
          "contacts": [
              {
                  "firstName": "Sofia",
                  "secondName": "Müller",
                  "color": "deepskyblue",
                  "lockedIn": false
              },
              {
                  "firstName": "Benedict",
                  "secondName": "Ziegler",
                  "color": "mediumslateblue",
                  "lockedIn": false
              }
          ],
          "dueDate": "01/07/25",
          "priority": "Urgent",
          "subtasks": [
              {
                  "name": "Establish CSS Methodology",
                  "done": true
              },
              {
                  "name": "Setup Base Styles",
                  "done": true
              }
          ],
          "status": "done"
      }
  ])
  initBoard();
  }

/**
 * Resets the server data of contacts with dummy contacts.
 */
async function resetStorageOfServer_contacts() {
    setItem('contacts', [
      {
        "name": {
          "firstName": "Anton",
          "secondName": "Mayer",
          "color": "#FF7A00"
        },
        "mail": "anton@gmail.com",
        "phone": "+49 1111 111 11 1",
        "password": "",
        "lockedIn": false
      },
      {
        "name": {
          "firstName": "Anja",
          "secondName": "Schulz",
          "color": "#9327FF"
        },
        "mail": "schulz@hotmail.de",
        "phone": "+49 1111 111 11 1",
        "password": "",
        "lockedIn": false,
      },
      {
        "name": {
          "firstName": "Benedikt",
          "secondName": "Ziegler",
          "color": "#6E52FF"
        },
        "mail": "benedikt@gmail.com",
        "phone": "+49 1111 111 11 1",
        "password": "",
        "lockedIn": false
      },
      {
        "name": {
          "firstName": "David",
          "secondName": "Eisenberg",
          
          "color": "#FC71FF"
        },
        "mail": "davidberg@gmail.com",
        "phone": "+49 1111 111 11 1",
        "password": "",
        "lockedIn": false
      },
      {
        "name": {
          "firstName": "Eva",
          "secondName": "Fischer",
          "color": "#FFBB2B"
        },
        "mail": "eva@gmail.com",
        "phone": "+49 1111 111 11 1",
        "password": "",
        "lockedIn": false
      },
      {
        "name": {
          "firstName": "Emmanuel",
          "secondName": "Mauer",
          "color": "#1FD7C1"
        },
        "mail": "emmanuelma@gmail.com",
        "phone": "+49 1111 111 11 1",
        "password": "",
        "lockedIn": false
      },
      {
        "name": {
          "firstName": "Marcel",
          "secondName": "Bauer",
          "color": "#462F8A"
        },
        "mail": "bauer@gmail.com",
        "phone": "+49 1111 111 11 1",
        "password": "",
        "lockedIn": false
      }
    ]
    );
    getContactsFromServer();
  }