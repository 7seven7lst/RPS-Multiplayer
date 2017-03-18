let checkNumbPlayersAndInsert = function(snapshot){
  if (snapshot.val() && snapshot.numChildren() <=1 || !snapshot.val()){
    // if currently we don't have any players online
    // or if currently we have less or equal to 1 players online
    // then we can add another user to start the game
    let playersData = snapshot.val();
    if (snapshot.numChildren() ===0){
      index = 0;
    } else {
      if (playersData[0]){
        index =1;
      } else if (playersData[1]){
        index=0;
      }
    }
    // initialize the newly connected player
    playersRef.child(index).set({
      name:userName, 
      wins: 0,
      losses: 0, 
    })
    con = playersRef.child(index);
    con.onDisconnect().remove();
  }
}

let handlePlayersRefUpdate = function(snapshot){
  let userIndex, userData, opponentIndex, opponentData;
  if (snapshot.val() && snapshot.val().length===1) {
    userIndex = findUserIndex(userName, snapshot.val());
    opponentIndex = userIndex ===0 ? 1: 0;
    $opponentChoice.text(`Wating for people to join....`);

  } else if (snapshot.val() && snapshot.val().length===2) {
    userIndex = findUserIndex(userName, snapshot.val());
    opponentIndex = userIndex ===0 ? 1: 0;
    userData = getUserData(userIndex, snapshot.val());
    opponentData = getUserData(opponentIndex, snapshot.val());
  }
  
  if (userData){
    $userStatus.text(`win: ${userData.wins}, loss: ${userData.losses}`);
  }
  
  if (opponentData){
    $opponentChoice.text(`Wating for ${opponentData.name}'s turn...`);
    $opponentStatus.text(`win: ${opponentData.wins}, loss: ${opponentData.losses}`);
  }
  if (snapshot.val() && snapshot.val().length ===1 && userName.length>0){
    // both 2 players are connected
    gameTurnsRef.set(turns);
  }
};

let handleGameTurnsRefUpdate = function(snapshot){
  turns = snapshot.val() || 0;
  if (turns === 2){
    // also need to display opponent's choice
    playersRef.once("value", function(players){
      let obj = players.val();
      let userIndex = findUserIndex(userName, players.val());
      let opponentIndex = userIndex ===0 ? 1: 0;

      let userData = getUserData(userIndex, obj);
      let opponentData = getUserData(opponentIndex, obj);
     

      $opponentChoice.text(opponentData.choice);
      let result = determineRPS(userData.choice, opponentData.choice);

      let turnResult = "It's a tie"; 
      if (result ==="Win"){
        userData.wins++;
        opponentData.losses++;
        playersRef.child(userIndex).child('wins').set(userData.wins);
        playersRef.child(opponentIndex).child('losses').set(opponentData.losses);
        $resultSection.text("You win!!!");
        turnResult = "You win !!!!";
      } 

      if (result==="Lose"){
        userData.losses++;
        opponentData.wins++;
        playersRef.child(opponentIndex).child('wins').set(opponentData.wins);
        playersRef.child(userIndex).child('losses').set(userData.losses);
        $resultSection.text("You lose!!!");
        turnResult = "You lose !!!!";
      }
      turns =0;

      gameTurnsRef.set(turns);
      $opponentChoice.text("");
      $resultSection.html(`<div style="align-self: center;width: 100%;"><p>You choose ${userData.choice}</p><p>${opponentData.name} choose ${opponentData.choice}</p><p>${turnResult}</p></div>`)
      $userStatus.text(`win: ${userData.wins}, loss: ${userData.losses}`);
      $opponentStatus.text(`win: ${opponentData.wins}, loss: ${opponentData.losses}`)
      setTimeout(function(){

        $userChoice.empty();
        $opponentChoice.empty();
        $userSelections.show();
      }, 2000)
      
      
    })
  } else {
    $resultSection.empty();
  }
}

let handlePlayersDelete = function(snapshot){
  let playerQuit = snapshot.val();
  let name = playerQuit.name;
  $opponentChoice.text(`Wating for people to join....`);
  $opponentStatus.text('');
  messagesRef.push(`${name} has left the game.`);
  turns = 0;
  gameTurnsRef.set(turns);
}

let handleMessageRefUpdate = function(snapshot){
  let messages = snapshot.val();
  $latestMessages.empty();
  _.forEach(messages, message=>{
    let $message=$("<div>").text(message);
    $latestMessages.append($message);
  }) 
}
