var config = {
	apiKey: "AIzaSyBrcdy4O0HQT-PtbAgmWUb3RzJwvThK4q8",
	authDomain: "teoriacomputacionpracticas.firebaseapp.com",
	databaseURL: "https://teoriacomputacionpracticas.firebaseio.com",
	projectId: "teoriacomputacionpracticas",
	storageBucket: "teoriacomputacionpracticas.appspot.com",
	messagingSenderId: "285113260508"
};
firebase.initializeApp(config);


//variable declaration
database = firebase.database();
MooreMachines = [];
input_alph = [];
output_alph = [];
number_of_states = 0;
adjancency_matrix = [];
old_adjancency_matrix =[];
old_adjancency_matrix_activated = false;
alphabet="abcdefghijklmnopqrstuvwxyz"
counter=0;


//variables for conversion
pendingStates=[];
DFSA = [];

//initial function
loadFromDataBase();

function setMealyToMoorePage(){
	document.getElementById("content-section").innerHTML ='<object type="text/html" data="MooreToMealy.html"></object>';
}

function createMooreMachineView(){
	if(MooreMachines.length != 0){
		getAlphabet();
		saveTableState();
		if(old_adjancency_matrix_activated){
			updateMooreMachineTable();
		}else{
			createTable();
		}
		saveMooreMachine();
	}
	
}

function createMooreMachine(){
	FSA = "Finite State Acceptor " + counter;
	var newMooreMachine = { name: "Finite State Acceptor " + counter, input_alph: [] ,output_alph: [], adjancency_matrix: [], number_of_states: 0};
	counter++;
	MooreMachines.push(newMooreMachine);
	select = document.getElementById("selectMooreMachine");
	var option = '<option>'+ newMooreMachine.name + '</option>';
	select.innerHTML += option;
	document.getElementById("selectMooreMachine").value = FSA;
	clearInputData();
	findActualMooreMachine();
}

function clearInputData(){
	var moore_machine_table =document.getElementById("Moore-Machine-table");
	moore_machine_table.innerHTML = "";
	document.getElementById("S-input").value="";
	document.getElementById("Q-input").value="";
}

function selectedMooreMachineChanged(){
	loadMooreMachine();
	updateInputView();
	updateMooreMachineTable();
}

function updateInputView(){
	inp = "";
	oup = "";
	Q = number_of_states;

	for(var i =0;i<input_alph.length;i++){
		inp += input_alph[i];
		if(i!=input_alph.length-1){
			inp += ",";
		}
	}

	for(var i =0;i<output_alph.length;i++){
		oup += output_alph[i];
		if(i!=output_alph.length-1){
			oup += ",";
		}
	}

	document.getElementById("S-input").value = inp;
	document.getElementById("Q-input").value = Q;
}

function loadMooreMachine(){
	var option = document.getElementById("selectMooreMachine").value;
	actualMooreMachine = findActualMooreMachine();
	if(actualMooreMachine.input_alph == undefined || actualMooreMachine.output_alph == undefined){
		input_alph = [];
		output_alph = [];
		adjancency_matrix = [];
		number_of_states = 0;
	}else{
		input_alph = actualMooreMachine.input_alph.slice();
		output_alph = actualMooreMachine.output_alph.slice();
		adjancency_matrix = actualMooreMachine.adjancency_matrix.slice();
		number_of_states = actualMooreMachine.number_of_states;
	}
}

function findActualMooreMachine(){
	var option = document.getElementById("selectMooreMachine").value;
	if(MooreMachines != null && option != ""){
		for (var i = MooreMachines.length - 1; i >= 0; i--) {
			if(MooreMachines[i].name === option){
				actualMooreMachine = MooreMachines[i];
				return actualMooreMachine;
			}
		}
	}else{
		createMooreMachine();
	}
}

function getAlphabet(){
	var s_input = document.getElementById("S-input").value;
	input_alph = s_input.split(",");
	var r_input = "0,1";
	output_alph = r_input.split(",");
	var q_input = document.getElementById("Q-input").value;
	number_of_states = Number(q_input);
}

function saveTableState(){
	var q_input = document.getElementById("Q-input").value;
	number_of_states = Number(q_input);
	old_adjancency_matrix = adjancency_matrix;
	old_adjancency_matrix_activated =true;
	console.log(old_adjancency_matrix);
	if(number_of_states<=old_adjancency_matrix.length){
		adjancency_matrix = old_adjancency_matrix.slice(0,q_input);
	}else if(number_of_states>old_adjancency_matrix.length){
		adjancency_matrix = old_adjancency_matrix.slice(0,q_input);
		for(var i=old_adjancency_matrix.length-1;i<number_of_states;i++){
			adjancency_matrix[i] = [];
			for(var j=0;j<input_alph.length+2;j++){
				adjancency_matrix[i][j] = "";
			}
			
		}
	}
}

function createTable(){
	var moore_machine_table =document.getElementById("Moore-Machine-table");
	moore_machine_table.innerHTML = "";
	states = "";
	for(var i=0;i<output_alph.length;i++){
		states += '<option>' + alphabet[i].toUpperCase() + '</option>';
	}

	for(var i=0;i<number_of_states+1;i++){
		moore_machine_table.innerHTML += '<tr id="row' + i +'"> </tr>'
		for(var j=0;j<input_alph.length+3;j++){
			var row = 'row' + i;
			select_dom = '<input type="text" class="form-control" onchange="saveMooreMachine()" id="select_table' + i + "_" + j + '">';
			select_dom += '</input>'

			checkbox_dom = '<input type="checkbox" class="checkbox" id="select_table' + i + "_" + j + '">' + '</>';

			if(i==0){
				if(j==0){
					document.getElementById(row).innerHTML += '<td> ' + 'Inicial' + '</td>';
				}else if(j==1) {
					document.getElementById(row).innerHTML += '<td> ' + 'Estados' + '</td>';
				}else if(j==input_alph.length+2) {
					document.getElementById(row).innerHTML += '<td> ' + 'Final' + '</td>';
				}else {
					result = input_alph[j-2];
					document.getElementById(row).innerHTML += '<td> ' + result + '</td>';
				}
			} else{
				if(j==0){
					document.getElementById(row).innerHTML += '<td> ' + checkbox_dom + '</td>';
				}else if(j==1){
					letter = alphabet[i-1].toUpperCase();
					document.getElementById(row).innerHTML += '<td> ' + letter + '</td>';
				}else if(j==input_alph.length+2) {
					document.getElementById(row).innerHTML += '<td> ' + checkbox_dom + '</td>';
				}else {
					document.getElementById(row).innerHTML += '<td> ' + select_dom + '</td>';
				}
			}
		}
	}
}

function updateMooreMachineTable(){
	var moore_machine_table =document.getElementById("Moore-Machine-table");
	moore_machine_table.innerHTML = "";
	
	for(var i=0;i<number_of_states+1;i++){
		moore_machine_table.innerHTML += '<tr id="row' + i +'"> </tr>'
		for(var j=0;j<input_alph.length+3;j++){
			var row = 'row' + i;
			column = j;

			checkbox_dom = '<input type="checkbox" class="checkbox" onclick="saveMooreMachine()" id="select_table' + i + "_" + j + '">' + '</>';
			checkbox_pos_dom = '<input type="checkbox" class="checkbox" onclick="saveMooreMachine()" id="select_table' + i + "_" + j + '" checked >' + '</>';

			if(j>1){
				column = j-1;
			}
			if(i==0){
				if(j==0){
					document.getElementById(row).innerHTML += '<td> ' + 'Inicial' + '</td>';
				}else if(j==1) {
					document.getElementById(row).innerHTML += '<td> ' + 'Estados' + '</td>';
				}else if(j==input_alph.length+2) {
					document.getElementById(row).innerHTML += '<td> ' + 'Final' + '</td>';
				}else {
					result = input_alph[j-2];
					document.getElementById(row).innerHTML += '<td> ' + result + '</td>';
				}
			} else{
				if(j==0){
					if(adjancency_matrix[i-1][column]){
						document.getElementById(row).innerHTML += '<td> ' + checkbox_pos_dom + '</td>';
					}else{
						document.getElementById(row).innerHTML += '<td> ' + checkbox_dom + '</td>';
					}
				}else if(j==1){
					letter = alphabet[i-1].toUpperCase();
					document.getElementById(row).innerHTML += '<td> ' + letter + '</td>';
				}else if(j==input_alph.length+2) {
					if(adjancency_matrix[i-1][column]){
						document.getElementById(row).innerHTML += '<td> ' + checkbox_pos_dom + '</td>';
					}else{

						document.getElementById(row).innerHTML += '<td> ' + checkbox_dom + '</td>';
					}
				}else {
					select_dom = '<input type="text" class="form-control" onchange="saveMooreMachine()"' +'value="' + adjancency_matrix[i-1][column]+ '"' +  ' id="select_table' + i + "_" + j + '">';
					select_dom += '</input>'
					id = 'select_table' + i + "_" + j;
					document.getElementById(row).innerHTML += '<td> ' + select_dom + '</td>';
				}
			}
		}
	}

}

function test_table(){
	document.getElementById("S-input").value = "0,1";
	document.getElementById("R-input").value = "0,1";
	document.getElementById("Q-input").value = "3"
	getAlphabet();
	createTable();
	getadjancencyMatrixMooreMachine();
	saveMooreMachine();
}

function getadjancencyMatrixMooreMachine(){
	adjancency_matrix= [];

	for(var i=0;i<=number_of_states;i++){
		adjancency_matrix[i] = [];
	}

	for(var i=0;i<number_of_states+1;i++){
		for(var j=0;j<input_alph.length+3;j++){
			if(i!=0 && j!=1){
				column = j;
				id = 'select_table' + i + "_" + j + '';
				if(j==0 || j==input_alph.length+2){
					select_option = document.getElementById(id).checked;
				}else{
					select_option = document.getElementById(id).value;
				}
				if(j>1){
					column=j-1;
				}
				if(j!=1){
					adjancency_matrix[i-1][column] = select_option;
				}
			}
		}
	}
}

function saveMooreMachine(){
	actualMooreMachine = findActualMooreMachine();
	actualMooreMachine.input_alph = input_alph.slice();
	actualMooreMachine.output_alph = output_alph.slice();
	getadjancencyMatrixMooreMachine();
	actualMooreMachine.adjancency_matrix = adjancency_matrix.slice();
	actualMooreMachine.number_of_states = number_of_states;
	var option = document.getElementById("selectMooreMachine").value;
	replaceActualMooreMachine();
	saveInDataBase();
	document.getElementById("selectMooreMachine").value = option;
	actualMooreMachine = findActualMooreMachine();
}

function replaceActualMooreMachine(){
	for (var i = MooreMachines.length - 1; i >= 0; i--) {
		if(MooreMachines[i].name===actualMooreMachine.name){
			MooreMachines[i] = actualMooreMachine;
		}
	}
}

function saveInDataBase(){
	var ref = database.ref('Machines')
	ref.child('FSA').set(MooreMachines);
}

function updateMooreMachineList(){
	MooreMachinesSelection = document.getElementById("selectMooreMachine"); 
	MooreMachinesSelection.innerHTML = '' ;
	var option = '<option selected=true ></option>';
	MooreMachinesSelection.innerHTML += option;
	if(MooreMachines!=null){
		MooreMachines.forEach(function(machine){
			option = '<option>' + machine.name + '</option>';
			MooreMachinesSelection.innerHTML += option;
		});
	}else{
		MooreMachines = [];
	}
}

function loadFromDataBase(){
	var ref = database.ref('Machines');

	ref.on("value", function(snapshot) {
		MooreMachines = snapshot.child('FSA').val();
		updateMooreMachineList();
		counter=MooreMachines.length;
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
}

/*  CONVERSION FROM FSA TO GRAMMAR*/ 
/* **************************************************************** */ 
existing_states = [];
initial_states = [];
final_states = [];
generator_list = [];
generated_list = [];

function setInitial(){
	document.getElementById("generator").value = "Σ";
}

function setLambda(){
	document.getElementById("generated").value = "λ";
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
	detectTypeOfGrammar();
	grammarsSelection = document.getElementById("typeOfGrammarString"); 
	grammarsSelection.innerHTML =  "Tipo de Gramática : "+ typeOfGrammar;
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
		}
	}
	updateList();
}

function readData(){
	generator = document.getElementById("generator").value;
	generated = document.getElementById("generated").value;

	if(generator==='' || generated === ''){
		alert('Llena todo men');
	}else{
		if(generator_list.includes(generator)){
			generator_list.splice(generator_list.indexOf(generator),0,generator);
			generated_list.splice(generated_list.indexOf(generated),0,generated);
		}else{
			generator_list.push(generator);
			generated_list.push(generated);
		}
		document.getElementById("generator").value = "";
		document.getElementById("generated").value = "";
		updateList();
	}
}


function convertToGrammar(){
	saveMooreMachine();
	actualMooreMachine = findActualMooreMachine();
	normalizeadjancencyMatrix();
	console.log(adjancency_matrix);
	DFSA = [];
	state_outputs = "";
	not_finished=true;
	i=0;
	existing_states = [];
	initial_states = [];
	final_states = [];
	generator_list = [];
	generated_list = [];
	


	for(var a=0;a<adjancency_matrix.length;a++){
		if(adjancency_matrix[a][0] == true){
			initial_states.push(alphabet[a].toUpperCase()); 
		}
	}
	for(var a=0;a<adjancency_matrix.length;a++){
		if(adjancency_matrix[a][adjancency_matrix[a].length-1] == true){
			final_states.push(alphabet[a].toUpperCase());
		}
	}

	//First we need to know the intersection between initial and final states
	//that way we can know if lambda is included in the rules
	lambda_in_language = initial_states.filter((state) =>final_states.includes(state));
	if(lambda_in_language.length > 0){
		generator_list.push("Σ");
		generated_list.push("λ");
	}

	//Second, for each starter state we have to add a generator list
	initial_states.forEach((state) => {
		generator_list.push("Σ");
		generated_list.push(state);
	});

	//Third, for each state that goes to a final state we have to add the
	//rule that indicates that given certain input, we go to that state
	//Four, for each state, we have to create its relation to another one

	for(var i=0;i<adjancency_matrix.length;i++){
		for(var j=1;j<adjancency_matrix[i].length-1;j++){
			for(var k=0;k<adjancency_matrix[i][j].length;k++){
				if(final_states.includes(adjancency_matrix[i][j][k])){
					generator_list.push(alphabet[i].toUpperCase());
					generated_list.push(input_alph[j-1]);
				}
				if(adjancency_matrix[i][j][k] != "T"){
					generator_list.push(alphabet[i].toUpperCase());
					st = input_alph[j-1] + adjancency_matrix[i][j][k];
					generated_list.push(st);
				}
			}
		}
	}
	unNormalizeadjancencyMatrix();
	updateList();
}



/*  CONVERSION FROM GRAMMAR TO FSA*/ 
/* **************************************************************** */ 


function convertToFSA(){
	grammarsSelection = document.getElementById("typeOfGrammarString"); 
	grammarsSelection.innerHTML =  "Tipo de Gramática : "+ typeOfGrammar;

	if(!grammarsSelection.innerHTML=="Tipo de Gramática : Lineal Derecha"){

	
	new_adjancency_matrix = [];
	states_in_machine = [];
	row_number = -1;
	total_states = [];
	generator_list.forEach(function(generator,index){
		if(!total_states.includes(generator)){
			total_states.push(generator);
		}
	});

	total_states.forEach(function(state,index){
		new_adjancency_matrix[index] = [];
		for(var i =0;i<input_alph.length+2;i++){
			new_adjancency_matrix[index][i] = "";
		}
	});

	number_of_states=total_states.length;

	final_state_index=number_of_states-1;
	console.log(final_state_index);
	accepted_state = alphabet[final_state_index].toUpperCase();
	generator_list.forEach(function(generator, index) {
		generated = generated_list[index];
		
		if(generator=="Σ" || generated == "λ"){
			if(generator=="Σ" && generated == "λ"){
				initial_states.push(alphabet[final_state_index].toUpperCase());
			} else if(generator=="Σ"){
				initial_states.push(generated);
			}
		} else{
			//First rule Q -> sQ' => Q s-> Q'
			if(!states_in_machine.includes(generator)){
				row_number++;
				column_number = input_alph.indexOf(generated[0])+1;
				console.log();
				if(generated.length>1){
					new_adjancency_matrix[row_number][column_number] += generated[1];
				}else{
					new_adjancency_matrix[row_number][column_number] +=accepted_state;
				}

				states_in_machine.push(alphabet[row_number].toUpperCase());
			}else {
				column_number = input_alph.indexOf(generated[0])+1;
				console.log(new_adjancency_matrix[row_number][column_number]);
				if(generated.length>1){
					new_adjancency_matrix[row_number][column_number] += generated[1];
				}else{
					new_adjancency_matrix[row_number][column_number] +=accepted_state;
				}
			}
		}
	});

	//fill the final and initial states 
	total_states.forEach(function(state, index){
		if(initial_states.includes(alphabet[index].toUpperCase())){
			new_adjancency_matrix[index][0] = true;
		}else{
			new_adjancency_matrix[index][0] = false;
		}
		new_adjancency_matrix[index][new_adjancency_matrix[index].length-1] = false;
	});
	index = new_adjancency_matrix.length-1;
	new_adjancency_matrix[index][new_adjancency_matrix[index].length-1] = true;
	console.log(final_states);
	console.log(new_adjancency_matrix);
	
	adjancency_matrix=new_adjancency_matrix;
	number_of_states++;
	updateMooreMachineTable();
}else{
	alert("La gramática debe ser lineal derecha para ser convertida");
}
}


function normalizeadjancencyMatrix(){
	for(var i=0;i<adjancency_matrix.length;i++){
		for(var j=1;j<adjancency_matrix[i].length-1;j++){
			if(!(adjancency_matrix[i][j])|| adjancency_matrix[i][j] == " "){
				adjancency_matrix[i][j] = "T";
			}
		}
	}
}

function unNormalizeadjancencyMatrix(){
	for(var i=0;i<adjancency_matrix.length;i++){
		for(var j=1;j<adjancency_matrix[i].length-1;j++){
			if(adjancency_matrix[i][j] == "T"){
				adjancency_matrix[i][j] = " ";
			}
		}
	}
}

function isInExistingStates(existing_states, actualState){
	actualSet = new Set(actualState);
	for(var i=0;i<existing_states.length;i++){
		existing_set = new Set(existing_states[i]);
		if(eqSet(actualSet,existing_set)){
			return true;
		}
	}
	return false;
}

function eqSet(as, bs) {
	if (as.size !== bs.size) return false;
	for (var a of as) if (!bs.has(a)) return false;
		return true;
}

function hasTrueElement( feature, state){
	
	true_set = new Set();
	for(var i=0;i<feature.length;i++){
		if(feature[i]){
			true_set.add(alphabet[i])
		}
	}
	state_set = new Set(state);
	return elementInSet(true_set, state_set);
}

function elementInSet(as, bs) {
	for (var a of as){
		if (bs.has(a.toUpperCase())){
			return true;
		}
	}  
	return false;
}

function createUpdatedTable(){
	var moore_machine_table =document.getElementById("Moore-Machine-Converted-table");
	moore_machine_table.innerHTML = "";
	columns = DFSA[0].length;

	for(var i=0;i<DFSA.length;i++){
		moore_machine_table.innerHTML += '<tr id="row_converted' + i +'"> </tr>'
		var row = 'row_converted' + i;
		for(var j=0;j<columns;j++){
			if(i==0){
				if(j==0){
				}else if(j==1){
					document.getElementById(row).innerHTML += '<td> ' + 'Estado' + '</td>';
				}else if(j==columns-1) {
					document.getElementById(row).innerHTML += '<td> ' + 'Salida' + '</td>';
				}else {
					result = input_alph[j-2];
					document.getElementById(row).innerHTML += '<td> ' + result + '</td>';
				}
			}else{
				if(j==0){
				}
				if(j>0 && j !=columns-1 ){
					letter = DFSA[i-1][j];
					if(letter == ""){
						letter = "T";
					}
					document.getElementById(row).innerHTML += '<td> ' + letter + '</td>';
				}else if(j ==columns-1){
					letter = DFSA[i-1][j];
					if(letter==true){
						letter = "Aceptado";
					}else if(letter==false){
						letter = "";
					}
					document.getElementById(row).innerHTML += '<td> ' + letter + '</td>';
				}
				
			}
			
		}
	}
}