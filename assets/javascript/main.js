$(document).ready(function(){
  $submitNameButton.on("click", function(e){
    e.preventDefault();
    userName = $userNameInput.val().trim();
    $userNameInput.val("");
    if (userName.length > 0){
      $userNameForm.hide();
      $userNameDisplay.text(`Welcome ${userName} !!!!`);
      playersRef.once("value", checkNumbPlayersAndInsert);
      generateRPSSelections($userSelections);
    }
  });

  $(document).on("click", "li", function(event){
    let choice = $(this).attr("data-name");
    con.child('choice').set(choice);
    turns++;
    gameTurnsRef.set(turns);
    $userSelections.hide();
    $userChoice.text(`You choosed ${choice}`);
  });

  $submitMessageButton.on("click", function(e){
    e.preventDefault();
    let message = $userMessageInput.val().trim();
    $userMessageInput.val("");
    messagesRef.push(`${userName} : ${message}`);
  });

  playersRef.on("value", handlePlayersRefUpdate);
  gameTurnsRef.on("value", handleGameTurnsRefUpdate);
  playersRef.on("child_removed", handlePlayersDelete);
  messagesRef.orderByChild("dateAdded").limitToLast(10).on("value", handleMessageRefUpdate);
});
