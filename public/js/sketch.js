
var initialValue;
var config = {
  apiKey: "AIzaSyBrcdy4O0HQT-PtbAgmWUb3RzJwvThK4q8",
  authDomain: "teoriacomputacionpracticas.firebaseapp.com",
  databaseURL: "https://teoriacomputacionpracticas.firebaseio.com",
  projectId: "teoriacomputacionpracticas",
  storageBucket: "teoriacomputacionpracticas.appspot.com",
  messagingSenderId: "285113260508"
};
firebase.initializeApp(config);

function updateGrammars(){
  grammarsSelection = document.getElementById("selectGrammar"); 
  grammarsSelection.innerHTML = '' ;
  if(grammars!=null){
    grammars.forEach(function(grammar){
      var option = '<option>' + grammar.name + '</option>';
      grammarsSelection.innerHTML += option;

    });
  }else{
    grammars = [];
  }


}

function updateList(){
  listOfRules = document.getElementById("listOfRules");
  listOfRules.innerHTML = '' ;
  var c=0;

  generator_list.forEach(function(rule) {
    var option = '<option>'+ rule + " --> "+ generated_list[c] + '</option>';
    listOfRules.innerHTML += option;
    c++;
  });
}

function findActualGrammar(){
  var option = document.getElementById("selectGrammar").value;
  if(grammars != null && option != ""){
    for (var i = grammars.length - 1; i >= 0; i--) {
      if(grammars[i].name === option){
        actualGrammar = grammars[i];
        return actualGrammar;
      }
    }
  }else{
    createGrammar();
  }

}

function replaceActualGrammar(){
  for (var i = grammars.length - 1; i >= 0; i--) {
    if(grammars[i].name===actualGrammar.name){
      grammars[i] = actualGrammar;
    }
  }

}

database = firebase.database();
var grammars = [];
var generator_list = [];
var generated_list = [];
var counter=0;
var actualGrammar;

loadFromDataBase();


function saveInDataBase(){
  var ref = database.ref('grammars')
  ref.child('grammarsPlace').set(grammars);
  console.log(actualGrammar);
}


function saveGrammar(){
  actualGrammar = findActualGrammar();
  actualGrammar.gented = generated_list.slice();
  actualGrammar.gentor = generator_list.slice();
  var option = document.getElementById("selectGrammar").value;
  replaceActualGrammar();
  saveInDataBase();
  document.getElementById("selectGrammar").value = option;
  actualGrammar = findActualGrammar();
}


function readData(){
  generator = document.getElementById("generator").value;
  generated = document.getElementById("generated").value;

  if(generator==='' || generated === ''){
    alert('Llena todo men');
  }else{
    generator_list.push(generator);
    generated_list.push(generated);
    document.getElementById("generator").value = "";
    document.getElementById("generated").value = "";
    saveGrammar();
    updateList();
  }
}

function setInitial(){
  document.getElementById("generator").value = "Σ";
}

function setLambda(){
  document.getElementById("generated").value = "λ";
}

function createGrammar(){
  var newGrammar = {name: "Gramática " + counter, gented: [] ,gentor: []};
  counter++;
  grammars.push(newGrammar);
  select = document.getElementById("selectGrammar");
  var option = '<option>'+ newGrammar.name + '</option>';
  select.innerHTML += option;
}

function loadGrammar(){
  var option = document.getElementById("selectGrammar").value;
  actualGrammar = findActualGrammar();
  if(actualGrammar.gented == undefined && actualGrammar.gentor == undefined){
    actualGrammar.gented = [];
    actualGrammar.gentor = [];
  }else{
    generated_list = actualGrammar.gented.slice();
    generator_list = actualGrammar.gentor.slice();
  }
  updateList();
}


function modifyRule(){
  var rule = document.getElementById("listOfRules").value;
  rule = rule.split(" ");
  document.getElementById("generator").value = rule[0];
  document.getElementById("generated").value = rule[2];
  deleteRule();
}

function deleteRule(){
  var rule = document.getElementById("listOfRules").value;
  rule = rule.split(" ");
  generator = rule[0];
  generated = rule[2];

  for (var i = generated_list.length - 1; i >= 0; i--) {
    if(generated_list[i]===generated && generator_list[i] === generator){
      generated_list.splice(i,1);
      generator_list.splice(i,1);
      saveGrammar();
    }
  }
  updateList();
}

function selectedGrammarChanged(){
  generated_list = [];
  generator_list = [];
  loadGrammar();
  updateList();
}

function loadFromDataBase(){
  var ref = database.ref('grammars');

  ref.on("value", function(snapshot) {
    grammars = snapshot.child('grammarsPlace').val();
    updateGrammars();
    counter=grammars.length;
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}
