function loadIndex() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/characters');
  xhr.send(null);

  xhr.onreadystatechange = function() {
    var DONE = 4; 
    var OK = 200; 
    if (xhr.readyState === DONE) {
      if (xhr.status === OK) {
      	$('body').empty();
      	var title = document.createElement('h1');
      	title.id = "title";
      	title.innerHTML = "Dungeons and Dragons Characters";
      	$('body').append(title);
        var characters = JSON.parse(xhr.responseText);
        characters.forEach(function(character){
          var name = document.createElement('a');
          name.id = character.id;
          name.innerHTML = character.name;
          name.href = "/characters/" + character.id;
          document.body.appendChild(name);
          document.getElementById(name.id).onclick = function(event) { 
          	event.preventDefault();
          	loadCharacter(name.href);
          }
        });

        var formButton = document.createElement('input');
        formButton.value = 'Add New Character';
        formButton.type = 'submit';
        formButton.id = 'formButton';
        $('body').append(formButton);
        formButton.onclick = function(event) {
        	event.preventDefault()
        	showForm();
        }

        var battleButton = document.createElement('input');
        battleButton.value = 'Battle';
        battleButton.type = 'submit';
        battleButton.id = 'battleButton';
        $('body').append(battleButton);
        battleButton.onclick = function(event) {
        	event.preventDefault()
        	battle(characters);
        }
      } else {
        console.log('Error: ' + xhr.status); 
      }
    }
  }
}

function loadCharacter(url) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.send(null);

	xhr.onreadystatechange = function() {
		var DONE = 4;
		var OK = 200;
		if(xhr.readyState === DONE) {
			if(xhr.status === OK) {
				$('body').empty();
				var character = JSON.parse(xhr.responseText);
				var wrapper = document.createElement('div');
				wrapper.id = "character-div";
				var name = document.createElement('h2');
				var str = document.createElement('p');
				var dex = document.createElement('p');
				var con = document.createElement('p');
				var int = document.createElement('p');
				var wis = document.createElement('p');
				var char = document.createElement('p');
				var ac = document.createElement('p');
				var speed = document.createElement('p');
				var hpMax = document.createElement('p');
				name.innerHTML = character.name;
				str.innerHTML = "Strength: " + character.strength;
				dex.innerHTML = "Dexterity: " + character.dexterity;
				con.innerHTML = "Constitution: " + character.constitution;
				int.innerHTML = "Intelligence: " + character.intelligence;
				wis.innerHTML = "Wisdom: " + character.wisdom;
				char.innerHTML = "Charisma: " + character.charisma;
				ac.innerHTML = "Armor Class: " + character.ac;
				speed.innerHTML = "Speed: " + character.speed;
				hpMax.innerHTML = "Max Hit Points: " + character.hpMax;
				wrapper.appendChild(name);
				wrapper.appendChild(str);
				wrapper.appendChild(dex);
				wrapper.appendChild(con);
				wrapper.appendChild(int);
				wrapper.appendChild(wis);
				wrapper.appendChild(char);
				wrapper.appendChild(ac);
				wrapper.appendChild(speed);
				wrapper.appendChild(hpMax);
				document.body.appendChild(wrapper);

				var editButton = document.createElement('input');
		        editButton.value = 'Edit Character';
		        editButton.type = 'submit';
		        editButton.id = 'editButton';
		        $('body').append(editButton);
		        editButton.onclick = function(event) {
		        	event.preventDefault()
		        	editForm(character);
		        }
		        var deleteButton = document.createElement('input');
		        deleteButton.value = 'Delete Character';
		        deleteButton.type = 'submit';
		        deleteButton.id = 'deleteButton';
		        $('body').append(deleteButton);
		        deleteButton.onclick = function(event) {
		        	event.preventDefault()
		        	deleteCharacter(character);
		        }
		        homeButton();
			} else {
				console.log('Error: ' + xhr.status);
			}
		}
	}
}

function showForm() {
	$('body').load('/character-form.html', function() {
		$(function() {
			$('#character-form').on('submit', function(event) {
				event.preventDefault();
				var character = {}
				$.each($('#character-form :input').serializeArray(), function() {
					character[this.name] = this.value;
				})
				var xhr = new XMLHttpRequest();
				xhr.open('POST', '/characters');
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.send(JSON.stringify(character));
				loadIndex();
			});
		});
	});
}

function editForm(character) {
	charId = character.id;
	$('body').load('/edit-form.html', function() {
		$(function() {
			$('#edit-form').on('submit', function(event) {
				event.preventDefault();
				var character = {}
				$.each($('#edit-form :input').serializeArray(), function() {
					character[this.name] = this.value;
				})
				var xhr = new XMLHttpRequest();
				xhr.open('POST', '/characters/' + charId);
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.send(JSON.stringify(character));
				loadIndex();
			});
		});
	});
}

function deleteCharacter(character) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/characters/' + character.id + '/destroy');
	xhr.send(null);
	loadIndex();
}

function battle(characters) {
	$('body').empty();

	var select = document.createElement('select');
	select.id = "characters";
	$.each(characters, function(index, value) {
		var option = document.createElement('option');
		option.id = characters[index].id;
		option.text = characters[index].name;
		select.append(option);
	});
	$('body').append(select);

	var addCharButton = document.createElement('input');
    addCharButton.value = 'Add Character';
    addCharButton.type = 'submit';
    addCharButton.id = 'addCharButton';
    $('body').append(addCharButton);
    addCharButton.onclick = function(event) {
    	event.preventDefault()
    	for (var character in characters) {
    		if (characters[character].name == select.value) {
    			addCharacter(characters[character]);
    		}
    	}
    }
    var startButton = document.createElement('input');
    startButton.value = 'Start';
    startButton.type = 'submit';
    startButton.id = 'startButton';
    $('body').append(startButton);
    startButton.onclick = function(event) {
    	event.preventDefault()

    }
    homeButton();
}

function addCharacter(character) {
	var wrapper = document.createElement('div');
	var name = document.createElement('p');
	var ac = document.createElement('p');
	var speed = document.createElement('p');
	var hpLabel = document.createElement('p');
	var hpMax = document.createElement('input');
	var plusFive = document.createElement('input');
	var minusFive = document.createElement('input');
	var removeCharacter = document.createElement('input');

	wrapper.id = "battle-div";
	name.innerHTML = character.name;
	name.id = "name";
	ac.innerHTML = "AC " + character.ac;
	speed.innerHTML = "Speed " + character.speed;
	hpLabel.innerHTML = "Hit Points ";
	hpMax.type = 'number';
	hpMax.value = character.hpMax;
	hpMax.text = "Hit Points ";
	plusFive.value = '+5';
    plusFive.type = 'submit';
    plusFive.id = 'plusFive';
    minusFive.value = '-5';
    minusFive.type = 'submit';
    minusFive.id = 'minusFive';
	removeCharacter.value = 'Remove Character';
    removeCharacter.type = 'submit';
    removeCharacter.id = 'removeCharacter';


	wrapper.appendChild(name);
	wrapper.appendChild(ac);
	wrapper.appendChild(speed);
	wrapper.appendChild(hpLabel);
	wrapper.appendChild(hpMax);
	wrapper.appendChild(plusFive);
	wrapper.appendChild(minusFive);
    wrapper.appendChild(removeCharacter);

    plusFive.onclick = function(event) {
    	event.preventDefault()
    	hpMax.value = parseFloat(hpMax.value) + 5;
    }

    minusFive.onclick = function(event) {
    	event.preventDefault();
    	hpMax.value = parseFloat(hpMax.value) - 5;
    }

    removeCharacter.onclick = function(event) {
    	event.preventDefault()
    	document.body.removeChild(wrapper);
    }
	document.body.appendChild(wrapper);
}

function homeButton() {
	var homeButton = document.createElement('input');
    homeButton.value = 'Home';
    homeButton.type = 'submit';
    homeButton.id = 'homeButton';
    $('body').append(homeButton);
    homeButton.onclick = function(event) {
    	event.preventDefault()
    	loadIndex();
    }
}

loadIndex();