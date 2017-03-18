firebase.initializeApp(FIREBASE_CONFIG);
const database = firebase.database();
const playersRef = database.ref("/players");
const gameTurnsRef = database.ref("/turns");
const messagesRef = database.ref("/messages");
const $userNameForm = $("#user-form");
const $userNameDisplay = $("#user-name-display");
const $submitNameButton = $("#submit-name");
const $submitMessageButton = $("#submit-message");
const $userNameInput = $("#user-name");
const $userSelections = $("#user-selections");
const $userChoice = $("#user-choice");
const $userStatus = $("#user-status");
const $opponentChoice = $("#opponent-choice");
const $opponentStatus = $("#opponent-status");
const $userMessageInput = $("#new-message");
const $resultSection = $("#result-section");
const $latestMessages = $("#latest-messages");
let userName='', turns = 0, index, con, userID, opponentID; // global vars
