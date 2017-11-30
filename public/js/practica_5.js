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
adjancency_matrix = [];
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
		createTable();
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
	document.getElementById("R-input").value="";
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
	document.getElementById("R-input").value = oup;
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
	var r_input = document.getElementById("R-input").value;
	output_alph = r_input.split(",");
	var q_input = document.getElementById("Q-input").value;
	number_of_states = Number(q_input);
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

/*  CONVERSION FROM NON-DETERMINISTIC FSA TO DETERMINISTIC FSA*/ 
/* **************************************************************** */ 

function convertToDFSA(){
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


	for(var a=0;a<adjancency_matrix.length;a++){
		initial_states[a] = adjancency_matrix[a][0]; 
	}
	for(var a=0;a<adjancency_matrix.length;a++){
		final_states[a] = adjancency_matrix[a][adjancency_matrix[a].length-1]; 
	}


	do{
		console.log(DFSA);
		for(var a=0;a<DFSA.length;a++){
			existing_states[a] = DFSA[a][1]; 
		}
		
		DFSA[i] = [];
		for(var j=0;j<adjancency_matrix[0].length+1;j++){
			if(i==0){
				if(j==0){
					state = hasTrueElement(initial_states, alphabet[i].toUpperCase());
				}else if(j==1){
					state=alphabet[i].toUpperCase();
					state = "";
					for(var k=0;k<adjancency_matrix.length;k++){
						if(adjancency_matrix[k][0]==true){
							state+=adjancency_matrix[k][1];
						}
					}					
					pendingStates = [];
				}else if(j==adjancency_matrix[0].length){
					state = hasTrueElement(final_states, alphabet[i].toUpperCase());
				}else {
					state = "";
					for(var k=0;k<adjancency_matrix.length;k++){
						if(adjancency_matrix[k][0]==true){
							state+=adjancency_matrix[k][j-1];
						}
					}
					pendingStates.push(state);
				}

				DFSA[i][j] = state;
			} else{
				actualState = pendingStates[0];
				if(j==0){
					DFSA[i][j] = hasTrueElement( initial_states, actualState);
				}else if(j==adjancency_matrix[0].length){
					DFSA[i][j] = hasTrueElement( final_states, actualState);
				} else {

					if(!isInExistingStates(existing_states,actualState)){
						if(actualState=="T"){
							DFSA[i][j] = actualState;
						}else{
							if(j==1){
								DFSA[i][j] = actualState;
							}else{
								state_outputs = "" ;
								for(var k=0;k<actualState.length;k++){
									ret_state = adjancency_matrix[alphabet.indexOf(actualState[k].toLowerCase())][j-1];
									
									for(var l=0;l<ret_state.length;l++){
										if(! (ret_state[l]=="T" && DFSA[0][j] != "T")){
											if(!state_outputs.includes(ret_state[l])){

												state_outputs += ret_state[l];
											}
										}
										
									}
								}
								console.log(state_outputs);

								if(!pendingStates.includes(state_outputs))
								{
									pendingStates.push(state_outputs);
								}
								DFSA[i][j] = state_outputs;
							}
						}
					} else{
						not_finished=false;
					}
				}
			}
		}
		if(i>=0){
			pendingStates.shift();
		}
		
		
		
		i++;
	}while(not_finished);
	console.log(DFSA);
	createUpdatedTable();
	unNormalizeadjancencyMatrix();
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