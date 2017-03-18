$(document).ready(function(){
  $submitNameButton.on("click", function(e){
    e.preventDefault();
    userName = $userNameInput.val().trim();
    $userNameInput.val("");
    if (userName.length > 0){
      playersRef.once("value", function(snapshot){
        if (snapshot.val() && snapshot.val().length <=1 || !snapshot.val()){
          // if currently we don't have any players online
          // or if currently we have less or equal to 1 players online
          // then we can add another user to start the game
          index = _.get(snapshot.val(), 'length' ,0);
          // initialize the newly connected player
          playersRef.child(index).set({
            name:userName, 
            wins: 0,
            losses: 0, 
          })
          con = playersRef.child(index);
          con.onDisconnect().remove();
        }
      });

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
  playersRef.on("value", function(snapshot){
    let userIndex, userData, opponentIndex, opponentData;
    if (snapshot.val() && snapshot.val().length===1) {
      userIndex = findUserIndex(userName, snapshot.val());
      opponentIndex = userIndex ===0 ? 1: 0;
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
      $opponentChoice.text(`Wating for ${opponentData.name}'s turn...`)
      $opponentStatus.text(`win: ${opponentData.wins}, loss: ${opponentData.losses}`);
    }
    if (snapshot.val() && snapshot.val().length ===1 && userName.length>0){
      // both 2 players are connected
      gameTurnsRef.set(turns);
      
    }
  })


  gameTurnsRef.on("value", function(snapshot){
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
  })

  playersRef.on("child_removed", function(snapshot){
    let playerQuit = snapshot.val();
    let name = playerQuit.name;
    messagesRef.push(`${name} has left the game.`);
    turns = 0;
    gameTurnsRef.set(turns);
  });

  messagesRef.orderByChild("dateAdded").limitToLast(10).on("value", function(snapshot){
    let messages = snapshot.val();
    $latestMessages.empty();
    _.forEach(messages, message=>{
      let $message=$("<div>").text(message);
      $latestMessages.append($message);
    }) 
  })
});




