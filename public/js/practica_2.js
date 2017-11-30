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
  var option = '<option selected=true ></option>';
  grammarsSelection.innerHTML += option;
  if(grammars!=null){
    grammars.forEach(function(grammar){
      option = '<option>' + grammar.name + '</option>';
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
  updateTypeOfGrammar();
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

//variable declaration
database = firebase.database();
var grammars = [];
var generator_list = [];
var generated_list = [];
var counter=0;
var actualGrammar;
var initialValue;

//practica 2 added features 
var actualTerminals = [];
var actualNotTerminals =[];
var derivation = [];
var finalDerivations = [];
var typeOfGrammar= " ";


loadFromDataBase();


function saveInDataBase(){
  var ref = database.ref('grammars')
  ref.child('grammarsPlace').set(grammars);
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
  actualNotTerminals = []
  actualTerminals = []
  if(actualGrammar.gented == undefined && actualGrammar.gentor == undefined){
    actualGrammar.gented = [];
    actualGrammar.gentor = [];
  }else{
    generated_list = actualGrammar.gented.slice();
    generator_list = actualGrammar.gentor.slice();
  }
  updateTypeOfGrammar();
  updateList();
}


function modifyRule(){
  var rule = document.getElementById("listOfRules").value;
  rule = rule.split(" ");
  if(rule[2] != undefined){
    document.getElementById("generator").value = rule[0];
    document.getElementById("generated").value = rule[2];
    deleteRule();
  }
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

function detectSimbols(list){
  for(var i =0; i<list.length; i++){
    for(var j=0;j<list[j].length;j++){

      var character = list[i][j];
      if(character!=undefined && character != "Σ" && character != "λ"){

        if(character == character.toUpperCase()){
          if(!actualNotTerminals.includes(character)){

            actualNotTerminals.push(character);
          }
        }
        if(character==character.toLowerCase()){
          if(!actualTerminals.includes(character)){
            actualTerminals.push(character);
          }
        }
      }
    }
  }
}

function detectDictionary(){
  detectSimbols(generated_list);
  detectSimbols(generator_list);
  detectTypeOfGrammar();
}

function detectTypeOfGrammar(){
  var isNotSensitive=true;
  var isNotRegularRight=false;
  var isNotRegularLeft=false;
  var isNotContextFree =true;
  var isNotContractive = true;
  for(var i =0; i<generator_list.length; i++){
    if(!(generator_list[i] == "Σ")){
      var alpha = ((generator_list[i] == "Σ") ? 0 : generator_list[i].length);
      var beta = ((generated_list[i] == "λ") ? 0 : generated_list[i].length);

      if(alpha>1){
        typeOfGrammar = "Sensitiva de Contexto";
        isNotSensitive=false;
      }else if(alpha==1 && isNotSensitive){
          //first we are going to verify if the grammar is a regular right
          //then we are going to ask if it is the only nonterminal simbol and 
          //if it is indeed a non terminal simbol
          if(!(/^[^A-Z][A-Z]+$/.test(generated_list[i]) || /^[^A-Z]+$/.test(generated_list[i]))){
            isNotRegularRight=true;
          }
          //same thing to the left
          //then we are going to ask if it is the only nonterminal simbol and 
          //if it is indeed a non terminal simbol
          if(!(/^[A-Z][^A-Z]+$/.test(generated_list[i]) || /^[^A-Z]+$/.test(generated_list[i]))){
            isNotRegularLeft=true;
          }
        }
        if(alpha>beta){
          //is Contractive
          typeOfGrammar = "Contractiva";
          isNotContractive=false;
          i=generator_list.length;
        } else if(isNotSensitive && isNotRegularRight && isNotRegularLeft){
          typeOfGrammar="Libre de Contexto";
          isNotContextFree=false;
        }

      }
    }
    if(!isNotRegularLeft && isNotRegularRight && isNotContractive && isNotSensitive){
      typeOfGrammar="Lineal Izquierda";
    }
    if(!isNotRegularRight && isNotRegularLeft && isNotContractive && isNotSensitive){
      typeOfGrammar="Lineal Derecha";
    }
  }

  function updateTypeOfGrammar(){
    detectDictionary();
    grammarsSelection = document.getElementById("typeOfGrammarString"); 
    grammarsSelection.innerHTML =  "Tipo de Gramática : "+ typeOfGrammar;
  }

  function derivateRule(){
    var rule = document.getElementById("listOfRules").value;
    rule = rule.split(" ");
    generator = rule[0];
    generated = rule[2];
    lastGenerated = derivation[derivation.length-1];
    if(generated != undefined && generated!=undefined){
      if(generator == "Σ" && !derivation.includes("Σ")){
        derivation.push(generator);
        derivation.push(generated);
      }else if (generator != "Σ" && lastGenerated.includes(generator)){
        lastGenerated = [lastGenerated.slice(0, lastGenerated.indexOf(generator)), generated, lastGenerated.slice(lastGenerated.indexOf(generator)+generator.length)].join('');
        derivation.push(lastGenerated);
      }
      setFinalDerivation();
      updateRuleDerivation();
      updateFinalDerivation();
    }
  }

  function clearDerivation(){
    grammarsSelection = document.getElementById("listOfDerivations"); 
    grammarsSelection.innerHTML =  "" ;
    derivation = [];
  }

  function setFinalDerivation(){
    lastGenerated = derivation[derivation.length-1];
    if(!finalDerivations.includes(lastGenerated)){
      var isFinished=true;
      for(var i=0;i<actualNotTerminals.length;i++){
        if(lastGenerated.includes(actualNotTerminals[i])){
          isFinished=false;
        }
      }
      if(isFinished){
        finalDerivations.push(lastGenerated); 
      }
    }
  }

  function updateFinalDerivation(){
    listOfFinalDerivations = document.getElementById("listOfFinalDerivations"); 
    listOfFinalDerivations.innerHTML = '' ;
    finalDerivations.forEach(function(final) {
      var option = '<option>'+ final + '</option>';
      listOfFinalDerivations.innerHTML += option;
    });
  }

  function updateRuleDerivation(){
    listOfRules = document.getElementById("listOfDerivations");
    listOfRules.innerHTML = '' ;

    derivation.forEach(function(generated) {
      var option = '<option>'+ generated + '</option>';
      listOfRules.innerHTML += option;
    });
  }
