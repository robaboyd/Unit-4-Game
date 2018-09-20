/*
Table of Contents
1. document ready
2. select the player character
3. select the computer characdter 
4. basic attack onclick 
5. special attacks
  5a. Force Push
  5b. Mind Trick
  5c. Force choke
  5d. Tantrum
6. Functions

*/

//--document ready----------------------//
$(document).ready(function() {
  //need to make these objects
  let heroes = [
    {
      src: "./assets/images/vader.jpg",
      id: "vader",
      attack: 15,
      health: 190,
      armor: 20,
      special: 40,
      stunned: false,
      attackSound: "../unit-4-game/assets/sounds/asyouwish.m4a",
      selectSound: "../unit-4-game/assets/sounds/bidding.m4a",
      killSound: "../unit-4-game/assets/sounds/Apology.m4a"
    },
    {
      src: "./assets/images/oldLuke.png",
      id: "luke",
      attack: 17,
      health: 170,
      armor: 19,
      special: 55,
      stunned: false
    },
    {
      src: "./assets/images/kylo-ren.jpeg",
      id: "ren",
      attack: 21,
      health: 115,
      armor: 16,
      special: 100,
      stunned: false
    },
    {
      src: "./assets/images/obiyoung.jpg",
      id: "kenobi",
      attack: 19,
      health: 155,
      armor: 18,
      special: 70,
      stunned: false
    }
  ];

  var selectRow = $("#select-attacker");
  var playerCharacter = "";
  var computerCharacter = "";
  var attackerId = $("#attacker");
  var defenderId = $("#defender");
  var special = $("#specialAttack");
  var playerHealth = $("#attackerHealth");
  var computerHealth = $("#defenderHealth");
  var getMessageDiv = $("#gameMessages");
  var canAttack = true;
  var statusMessage = $("#statusMessages");
  var loadBar = $(".loadBar");
  var lightsaberSound = "../unit-4-game/assets/sounds/lightsaber.mp3";
  var attackerDamageNumber = $("#dNumberAttacker");
  var defenderDamageNumber = $("#dNumberDefender");

  //Load the first status message
  statusMessage.text("Select Your Character");

  // add images to side row
  addRow(selectRow, heroes);

  //--select the player character--------------------//
  $(document).on("click", ".images", function() {
    //clear messages div
    getMessageDiv.empty();

    if (playerCharacter === "") {
      console.log(this);
      var attackerName = this.id;
      //loop through hero array to find matching hero and make this the users character
      $(heroes).each(function(i) {
        if (attackerName === heroes[i].id) {
          playerCharacter = heroes[i];
        }
      });

      //get index of selected hero
      var index = heroes.indexOf(playerCharacter);
      //splice hero from array and display on screen
      heroes.splice(index, 1);
      // clear the select attacker row
      clearRow(selectRow);

      //add remaining heros to defender select row
      addRow(selectRow, heroes);
      let img = $(
        "<img class=attacker id=" +
          playerCharacter.id +
          " src = " +
          playerCharacter.src +
          ">"
      );
      //append buttons
      if (playerCharacter.id === "luke") {
        var x = $(
          '<button class="skillsBtn" id="forcePush">Force Push</button>'
        );
        var y = $(
          '<button class="skillsBtn" id="attack">Basic Attack</button>'
        );
        special.append(x);
        special.append(y);
      }
      if (playerCharacter.id === "kenobi") {
        var x = $(
          '<button class="skillsBtn" id="mindTrick">Mind Trick</button>'
        );
        var y = $(
          '<button class="skillsBtn" id="attack">Basic Attack</button>'
        );
        special.append(x);
        special.append(y);
      }
      if (playerCharacter.id === "vader") {
        var x = $('<button class="skillsBtn" id="choke">Force Choke</button>');
        var y = $(
          '<button class="skillsBtn" id="attack">Basic Attack</button>'
        );
        special.append(x);
        special.append(y);
      }
      if (playerCharacter.id === "ren") {
        var x = $('<button class="skillsBtn" id="tantrum">Tantrum</button>');
        var y = $(
          '<button class="skillsBtn" id="attack">Basic Attack</button>'
        );
        special.append(x);
        special.append(y);
      }
      // add selected hero to attacker spot in DOM
      attackerId.append(img);
      updateHealth(playerCharacter, playerHealth);

      //update the status message
      statusMessage.text("Select the computer's character.");

      //--select defender----------------------//
    } else if (computerCharacter === "") {
      var defenderName = this.id;
      //loop through hero array to find matching hero and make this the defender
      $(heroes).each(function(i) {
        if (defenderName === heroes[i].id) {
          computerCharacter = heroes[i];
        }
      });

      //get index of selected hero
      let index = heroes.indexOf(computerCharacter);

      heroes.splice(index, 1);

      clearRow(selectRow);
      addRow(selectRow, heroes);

      var img = $(
        "<img class=defender id=" +
          computerCharacter.id +
          " src = " +
          computerCharacter.src +
          ">"
      );
      // add selected hero to dom
      defenderId.append(img);
      updateHealth(computerCharacter, computerHealth);

      //update the message
      statusMessage.text("It's your turn.");
    }
  });

  //--basic attack onclick-----------------//
  $(document).on("click", "#attack", function() {
    //make sure you can click the button
    if (canAttack === true) {
      //make sure theres a computer character
      if (computerCharacter !== "") {
        canAttack = false;
        playAudio(lightsaberSound);
        statusMessage.text(computerCharacter.id + "'s turn");

        var damageDone = attack(playerCharacter, computerCharacter);
        //play wiggle animation
        attackAnim(defenderId);
        //display the damage done on the damaged character
        showDamage(defenderDamageNumber, damageDone);
        //computer counter-attack
        updateHealth(computerCharacter, computerHealth);
        checkHealth();
        if (computerCharacter.health > 0) {
          setTimeout(computerAttack, 2000);
        }
      } else {
        // if there is no defined defender
        messages(getMessageDiv, "select a defender");
      }
    } else {
      messages(getMessageDiv, "Not your turn.");
    }
  });

  //--special attacks--------------//
  //force push
  $(document).on("click", "#forcePush", function() {
    if (canAttack === true) {
      if (computerCharacter !== "") {
        canAttack = false;
        statusMessage.text(computerCharacter.id + "'s turn");
        var chance = Math.floor(Math.random() * 9);
        console.log(chance);
        //30% chance to heal
        if (chance === 1 || chance === 2 || chance === 3) {
          playerCharacter.health + 20;
          healPlayer(playerCharacter, playerHealth);
          messages(getMessageDiv, "Force Push healed luke for 50 health");
          messages(
            getMessageDiv,
            "Luke did " + playerCharacter.special + " damage"
          );
        } else {
          messages(
            getMessageDiv,
            "Luke did " + playerCharacter.special + " damage"
          );
        }
        playAudio(lightsaberSound);
        specialAttack(playerCharacter, computerCharacter);
        checkHealth();
        updateHealth(computerCharacter, computerHealth);
        attackAnim(defenderId);
        showDamage(defenderDamageNumber, playerCharacter.special);
        if (computerCharacter.health > 0) {
          setTimeout(computerAttack, 2000);
        }
      }
    } else {
      messages(getMessageDiv, "Not your turn.");
    }
  });
  //mind trick
  $(document).on("click", "#mindTrick", function() {
    if (canAttack === true) {
      if (computerCharacter !== "") {
        canAttack === false;
        statusMessage.text(computerCharacter.id + "'s turn");
        var chance = Math.floor(Math.random() * 9);
        //30% for the enemy to miss a turn
        if (chance === 1 || chance === 2 || chance === 3) {
          computerCharacter.stunned = true;
          messages(getMessageDiv, "The Enemy was tricked into missing a turn!");
          messages(
            getMessageDiv,
            "Kenobi did " + playerCharacter.special + " damage"
          );
        } else {
          messages(
            getMessageDiv,
            "Kenobi did " + playerCharacter.special + " damage"
          );
        }
        playAudio(lightsaberSound);
        specialAttack(playerCharacter, computerCharacter);
        checkHealth();
        updateHealth(computerCharacter, computerHealth);
        showDamage(defenderDamageNumber, playerCharacter.special);
        attackAnim(defenderId);
        if (computerCharacter.health > 0) {
          setTimeout(computerAttack, 2000);
        }
      }
    } else {
      messages(getMessageDiv, "Not your turn.");
    }
  });
  //force choke
  $(document).on("click", "#choke", function() {
    if (canAttack === true) {
      if (computerCharacter !== "") {
        canAttack = false;

        statusMessage.text(computerCharacter.id + "'s turn");
        //heals vader for 15 health
        messages(
          getMessageDiv,
          "Vader choked the enemy, healing himself for 30 , and doing " +
            playerCharacter.special +
            " damage"
        );
        healPlayer(playerCharacter, playerHealth);
        playAudio(lightsaberSound);
        specialAttack(playerCharacter, computerCharacter);
        checkHealth();
        updateHealth(computerCharacter, computerHealth);
        showDamage(defenderDamageNumber, playerCharacter.special);
        attackAnim(defenderId);
        if (computerCharacter.health > 0) {
          setTimeout(computerAttack, 2000);
        } else {
          checkHealth();
        }
      }
    } else {
      messages(getMessageDiv, "Not your turn.");
    }
  });
  //tantrum attack
  $(document).on("click", "#tantrum", function() {
    if (canAttack === true) {
      if (computerCharacter !== "") {
        canAttack = false;
        statusMessage.text(computerCharacter.id + "'s turn");
        //heals vader for 15 health
        messages(
          getMessageDiv,
          "Kylo Ren had a temper tantrum, dealing" +
            playerCharacter.special +
            " damage, but he can't attack next turn."
        );

        if (playerCharacter.stunned !== true) {
          specialAttack(playerCharacter, computerCharacter);
        } else {
          playerCharacter.stunned = false;
        }
        playAudio(lightsaberSound);
        playerCharacter.stunned = true;
        checkHealth();

        updateHealth(computerCharacter, computerHealth);
        attackAnim(defenderId);
        showDamage(defenderDamageNumber, playerCharacter.special);
        if (computerCharacter.health > 0) {
          setTimeout(computerAttack, 2000);
        }
      }
    } else {
      messages(getMessageDiv, "Not your turn");
    }
  });

  //reset game
  $(document).on("click", "#resetButton", function() {
    resetGame();
  });

  //-----FUNCTIONS--------------------//

  // add array images to row
  function addRow(row, array) {
    for (var i = 0; i < array.length; i++) {
      var img = $(
        "<img class=images id=" + array[i].id + " src = " + array[i].src + ">"
      );
      row.append(img);
    }
  }

  //clear row
  function clearRow(row) {
    row.empty();
  }
  //attack function
  function attack(attacker, defender) {
    //generate a random number between 1 and 15 - defender.armor(if the defender's armor is 10 it's 1 and 5) so the damage has a chance to be lower
    var random = Math.floor(Math.random() * (25 - defender.armor)) + 1;
    var attack = attacker.attack * random;
    defender.health = defender.health - attack;
    messages(getMessageDiv, attacker.id + " did " + attack + " damage.");
    //return the attack var to get the amount of damage done
    return attack;
  }
  function attackAnim(character) {
    //add attacked class to the attacked characters parent div
    character.addClass("attacked");
    //after 1 second remove that class
    setTimeout(function() {
      character.removeClass("attacked");
    }, 1000);
  }
  //get special attack from character object
  function specialAttack(attacker, defender) {
    defender.health = defender.health - attacker.special;
  }
  //check the health of each of the characters to see if they are still alive
  function checkHealth() {
    if (computerCharacter.health <= 0) {
      //if the computer character died, reset everything
      canAttack = true;
      playerCharacter.stunned = false;
      computerCharacter = "";
      messages(getMessageDiv, "The computer died.");
      clearRow(defenderId);
      statusMessage.text("Pick a new computer character.");
      // check if there are no characters left
      if (heroes.length === 0) {
        statusMessage.text("You Win!");
        showResetButton();
      }
    }
    if (playerCharacter.health <= 0) {
      messages(getMessageDiv, "You died.");
      clearRow(attackerId);
      showResetButton();
    }
  }

  //update Health
  function updateHealth(player, healthDiv) {
    healthDiv.html("Health: " + player.health);
  }
  //heal player
  function healPlayer(player, healthDiv) {
    //luke and vader are the only to with healing abilities
    if (player.id === "luke") {
      player.health = player.health + 50;
    } else if (player.id === "vader") {
      player.health = player.health + 30;
    }
    updateHealth(player, healthDiv);
  }
  //game messages funciton, show the messages in the middle of the characters
  function messages(messageDiv, message) {
    var x = $("<p>");
    x.html(message);
    messageDiv.prepend(x);
    //remove message
    setTimeout(function() {
      messageDiv.empty();
    }, 3000);
  }

  //computer attack function
  function computerAttack() {
    //show the attack bar
    loadBar.addClass("loadBarCollapse");
    //once the attack bar is done, attack
    setTimeout(function() {
      //computer counter-attack
      //check to see if the character is stunned
      if (computerCharacter.stunned !== true) {
        var damageDone = attack(computerCharacter, playerCharacter);
      } else {
        messages(
          getMessageDiv,
          computerCharacter.id + " is stunned, it's your turn."
        );
        statusMessage.text("It's Your Turn.");
        computerCharacter.stunned = false;
      }
      //update the health of each character
      updateHealth(playerCharacter, playerHealth);
      playAudio(lightsaberSound);
      attackAnim(attackerId);
      showDamage(attackerDamageNumber, damageDone);
      loadBar.removeClass("loadBarCollapse");
      checkHealth();
    }, 3000);
    //make sure all of the timers are clear
    setTimeout(function() {
      if (playerCharacter.stunned === true) {
        statusMessage.text("You were stunned.");
        canAttack = false;
        playerCharacter.stunned = false;
        computerAttack();
      } else {
        canAttack = true;
        statusMessage.text("It's Your Turn.");
      }
    }, 6000);

    //update status message
  }

  //show damage numbers
  function showDamage(div, attacker) {
    div.text(attacker);
    div.addClass("showNumber");
    setTimeout(function() {
      div.removeClass("showNumber");
      div.text("");
    }, 1000);
  }
  //reset game
  function resetGame() {
    window.location.reload();
  }
  //show reset button
  function showResetButton() {
    let button = $("<button class=skillsBtn id=resetButton>Reset</button>");
    special.empty();
    special.append(button);
  }
  //play audio
  function playAudio(sound) {
    var selectAudio = new Audio(sound);
    selectAudio.play();
  }
});
