
const determineRPS = (c1, c2) =>{
  if (c1 === c2 ){
    return "Tie";
  }
  if (c1 === "Rock"){
    if (c2 === "Paper"){
      return "Lose";
    } else {
      return "Win";
    }
  }

  if (c1 === "Paper"){
    if (c2 === "Scissors"){
      return "Lose";
    } else {
      return "Win";
    }
  }

  if (c1 === "Scissors"){
    if (c2 === "Rock"){
      return "Lose";
    } else {
      return "Win";
    }
  }
}


const generateRPSSelections = ($target) => {
  let choices = $("<ul>").attr({"class": "rashambo-icon-container"});
  choices.append($("<li>").attr({"class": "rashambo-icon rock", "data-name":"Rock"}));
  choices.append($("<li>").attr({"class": "rashambo-icon paper","data-name":"Paper"}));
  choices.append($("<li>").attr({"class": "rashambo-icon scissors","data-name":"Scissors"}));
  $target.append(choices);
}

const findUserIndex = (name, userArray) => {
  if (!name ){
    return;
  }
  let index;
  _.forEach(userArray, (user, i)=>{
    if (name === _.get(user,'name',null)) {
      index = i;
    }
  });
  return index;
}

const getUserData = (userIndex, userArray) => {
  return userArray[userIndex];
}