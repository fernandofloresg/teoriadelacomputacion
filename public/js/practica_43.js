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
MealyMachines = [];
input_alph = [];
output_alph = [];
adjancency_matrix = [];
out_adjancency_matrix = [];
number_of_states =0
alphabet="abcdefghijklmnopqrstuvwxyz"
counter=0;
//variables of a mooreMachine
moore_adjancency_matrix = [];
moore_outputs = [];
moore_states = [];
moore_out = [];

//initial function
loadFromDataBase();

function setMealyToMealyPage(){
	document.getElementById("content-section").innerHTML ='<object type="text/html" data="MealyToMealy.html"></object>';
}

function createMealyMachineView(){
	if(MealyMachines.length != 0){
		getAlphabet();
		createTable();
		saveMealyMachine();
	}
}

function createMealyMachine(){
	var newMealyMachine = { name: "Mealy Machine " + counter, input_alph: [] ,output_alph: [], adjancency_matrix: [], number_of_states: 0, out_adjancency_matrix: []};
	counter++;
	MealyMachines.push(newMealyMachine);
	select = document.getElementById("selectMealyMachine");
	var option = '<option>'+ newMealyMachine.name + '</option>';
	select.innerHTML += option;
}

function selectedMealyMachineChanged(){
	loadMealyMachine();
	updateMealyMachineTable();
	cleanConversionTable();
}

function loadMealyMachine(){
	var option = document.getElementById("selectMealyMachine").value;
	actualMealyMachine = findActualMealyMachine();
	if(actualMealyMachine.input_alph == undefined && actualMealyMachine.output_alph == undefined){
		input_alph = [];
		output_alph = [];
		adjancency_matrix = [];
		out_adjancency_matrix = [];
		number_of_states = [];
	}else{
		input_alph = actualMealyMachine.input_alph.slice();
		output_alph = actualMealyMachine.output_alph.slice();
		adjancency_matrix = actualMealyMachine.adjancency_matrix.slice();
		out_adjancency_matrix = actualMealyMachine.out_adjancency_matrix.slice();
		number_of_states = actualMealyMachine.number_of_states;
	}
}

function findActualMealyMachine(){
	var option = document.getElementById("selectMealyMachine").value;
	if(MealyMachines != null && option != ""){
		for (var i = MealyMachines.length - 1; i >= 0; i--) {
			if(MealyMachines[i].name === option){
				actualMealyMachine = MealyMachines[i];
				return actualMealyMachine;
			}
		}
	}else{
		createMealyMachine();
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
	var mealy_machine_table =document.getElementById("Mealy-Machine-table");
	mealy_machine_table.innerHTML = "";
	states = "";
	outputs = "";
	console.log("Hi");

	row_dom = '<div class="row">';
	col_dom = '<div class="col-sm-4">'
	div_end = '</div>'


	for(var i=0;i<number_of_states;i++){
		states += '<option>' + alphabet[i].toUpperCase() + '</option>';
	}

	for(i=0;i<output_alph.length;i++){
		outputs += '<option>' + output_alph[i] + '</option>';
	}

	for(var i=0;i<number_of_states+1;i++){
		mealy_machine_table.innerHTML += '<tr id="row' + i +'"> </tr>'
		for(var j=0;j<input_alph.length+2;j++){
			var row = 'row' + i;
			select_dom = row_dom + col_dom;
			select_dom += '<select class="form-control" onchange="saveMealyMachine()" id="select_table' + i + "_" + j + '">';
			select_dom +=states;
			select_dom += '</select>';
			select_dom += div_end + col_dom;
			select_dom += '<select class="form-control" onchange="saveMealyMachine()" id="select_table_out' + i + "_" + j + '">';
			select_dom += outputs;
			select_dom += '</select>';
			select_dom += div_end + div_end;

			if(i==0){
				if(j==0){
					document.getElementById(row).innerHTML += '<td> ' + 'Estado' + '</td>';
				}else if(j==input_alph.length+1) {
				}else {
					result = input_alph[j-1];
					document.getElementById(row).innerHTML += '<td> ' + result + '</td>';
				}
			}else{
				if(j==0){
					letter = alphabet[i-1].toUpperCase();
					document.getElementById(row).innerHTML += '<td> ' + letter + '</td>';
				}else if(j==input_alph.length+1) {
				}else {
					document.getElementById(row).innerHTML += '<td> ' + select_dom + '</td>';
				}
			}
		}
	}
}

function updateMealyMachineTable(){
	var mealy_machine_table =document.getElementById("Mealy-Machine-table");
	mealy_machine_table.innerHTML = "";
	states = "";
	outputs = "";

	row_dom = '<div class="row">';
	col_dom = '<div class="col-sm-4">'
	div_end = '</div>'

	for(var i=0;i<number_of_states+1;i++){
		mealy_machine_table.innerHTML += '<tr id="row' + i +'"> </tr>'
		for(var j=0;j<input_alph.length+2;j++){
			var row = 'row' + i;
			

			if(i==0){
				if(j==0){
					document.getElementById(row).innerHTML += '<td> ' + 'Estado' + '</td>';
				}else if(j==input_alph.length+1) {
				}else {
					result = input_alph[j-1];
					document.getElementById(row).innerHTML += '<td> ' + result + '</td>';
				}
			}else{
				if(j==0){
					letter = alphabet[i-1].toUpperCase();
					document.getElementById(row).innerHTML += '<td> ' + letter + '</td>';
				}else if(j==input_alph.length+1) {
				}else {
					states = "";
					for(var k=0;k<number_of_states;k++){
						if(alphabet[k].toUpperCase() == adjancency_matrix[i-1][j-1]){
							states += '<option selected="selected">' + alphabet[k].toUpperCase() + '</option>';
						}else{
							states += '<option>' + alphabet[k].toUpperCase() + '</option>';
						}
					}
					outputs = "";
					for(k=0;k<output_alph.length;k++){
						if(output_alph[k] == out_adjancency_matrix[i-1][j-1]){
							outputs += '<option selected="selected">' + output_alph[k] + '</option>';
						}else{
							outputs += '<option>' + output_alph[k] + '</option>';
						}
					}

					select_dom = row_dom + col_dom;
					select_dom += '<select class="form-control" onchange="saveMealyMachine()" id="select_table' + i + "_" + j + '">';
					select_dom +=states;
					select_dom += '</select>';
					select_dom += div_end + col_dom;
					select_dom += '<select class="form-control" onchange="saveMealyMachine()" id="select_table_out' + i + "_" + j + '">';
					select_dom += outputs;
					select_dom += '</select>';
					select_dom += div_end + div_end;
					
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
	getAdjancencyMatrixMealyMachine();
	saveMealyMachine();
}

function getAdjancencyMatrixMealyMachine(){
	for(var i=0;i<output_alph.length+2;i++){
		if(i!=0 && j!=0 && j !=input_alph.length+1){
			adjancency_matrix[i-1] = [];
			out_adjancency_matrix[i-1]=[];
		}
	}
	for(var i=0;i<output_alph.length+2;i++){
		for(var j=0;j<input_alph.length+2;j++){
			if(i!=0 && j!=0 && j !=input_alph.length+1){
				id = 'select_table' + i + "_" + j + '';
				select_option = document.getElementById(id).value;
				adjancency_matrix[i-1][j-1] = select_option;
				id = 'select_table_out' + i + "_" + j + '';
				select_option = document.getElementById(id).value;
				out_adjancency_matrix[i-1][j-1] = select_option;
			}
		}
	}
}

function saveMealyMachine(){
	actualMealyMachine = findActualMealyMachine();

	actualMealyMachine.input_alph = input_alph.slice();
	actualMealyMachine.output_alph = output_alph.slice();
	getAdjancencyMatrixMealyMachine();
	actualMealyMachine.adjancency_matrix = adjancency_matrix.slice();
	actualMealyMachine.out_adjancency_matrix = out_adjancency_matrix.slice();
	actualMealyMachine.number_of_states = number_of_states;
	var option = document.getElementById("selectMealyMachine").value;
	replaceActualMealyMachine();
	saveInDataBase();
	document.getElementById("selectMealyMachine").value = option;
	actualMealyMachine = findActualMealyMachine();
}

function replaceActualMealyMachine(){
	for (var i = MealyMachines.length - 1; i >= 0; i--) {
		if(MealyMachines[i].name===actualMealyMachine.name){
			MealyMachines[i] = actualMealyMachine;
		}
	}
}

function saveInDataBase(){
	var ref = database.ref('Machines')
	ref.child('mealyMachines').set(MealyMachines);
}

function updateMealyMachineList(){
	MealyMachinesSelection = document.getElementById("selectMealyMachine"); 
	MealyMachinesSelection.innerHTML = '' ;
	var option = '<option selected=true ></option>';
	MealyMachinesSelection.innerHTML += option;
	if(MealyMachines!=null){
		MealyMachines.forEach(function(machine){
			option = '<option>' + machine.name + '</option>';
			MealyMachinesSelection.innerHTML += option;
		});
	}else{
		MealyMachines = [];
	}
}

function loadFromDataBase(){
	var ref = database.ref('Machines');

	ref.on("value", function(snapshot) {
		MealyMachines = snapshot.child('mealyMachines').val();
		updateMealyMachineList();
		counter=MealyMachines.length;
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
}

function convertMealyMachineTable(){
	convertMealyToMoore();
	var Mealy_machine_table =document.getElementById("Mealy-Machine-Converted-table");
	Mealy_machine_table.innerHTML = "";

	for(var i=0;i<moore_states.length+1;i++){
		Mealy_machine_table.innerHTML += '<tr id="row_converted' + i +'"> </tr>'
		for(var j=0;j<input_alph.length+2;j++){
			var row = 'row_converted' + i;
			
			if(i==0){
				if(j==0){
					document.getElementById(row).innerHTML += '<td> ' + 'Estado' + '</td>';
				}else if(j==input_alph.length+1) {
					document.getElementById(row).innerHTML += '<td> ' + 'Resultado' + '</td>';
				}else {
					result = input_alph[j-1];
					document.getElementById(row).innerHTML += '<td> ' + result + '</td>';
				}
			}else{
				if(j==0){
					letter = moore_states[i-1].toUpperCase();
					document.getElementById(row).innerHTML += '<td> ' + letter + '</td>';
				}else if(j==input_alph.length+1) {
					result = moore_out[i-1];
					document.getElementById(row).innerHTML += '<td> ' + result + '</td>';
				}else {

					for(var k=0;k<moore_states.length;k++){
						if(adjancency_matrix != undefined){
							out = moore_adjancency_matrix[i-1][j-1]
						}
					}
					row_dom = '<div class="row">';
					col_dom = '<div class="col-sm-2">'
					//output selector
					output_dom = col_dom + '<p>' + out + '</p>' + div_end;
					
					select_dom = row_dom + output_dom + div_end;
					document.getElementById(row).innerHTML += '<td> ' + select_dom + '</td>';

				}
			}
		}
	}
}

function convertMealyToMoore(){
	//first we calculate the number of outputs for each state
	moore_adjancency_matrix = [];
	moore_outputs = [];
	moore_states = [];
	moore_out = [];

	for(var k=0;k<number_of_states;k++){
		mSet = new Set();
		moore_outputs.push(mSet);
	}

	for(var i=0;i<output_alph.length+2;i++){
		for(var j=0;j<input_alph.length+2;j++){
			if(i!=0 && j!=0 && j !=input_alph.length+1){
				for(var k=0;k<number_of_states;k++){
					if(alphabet[k].toUpperCase() == adjancency_matrix[i-1][j-1]){
						moore_outputs[k].add(out_adjancency_matrix[i-1][j-1]);
					}
					
				}
			}
		}
	}

	//If it has n distinct outputs, break Qi into n states
	new_states_count =0;
	for(var i=0 ;i<number_of_states;i++){
		moore_outputs[i].forEach((value) => {
			new_state=alphabet[i].toUpperCase() + value;
			moore_states.push(new_state);
			moore_out.push(value);
			moore_adjancency_matrix[new_states_count] = [];
			for(var j=0;j<input_alph.length;j++){
				moore_adjancency_matrix[new_states_count][j] = adjancency_matrix[i][j] + out_adjancency_matrix[i][j];
			}
			new_states_count++;
		});
	}
}

function cleanConversionTable(){
	var Mealy_machine_table =document.getElementById("Mealy-Machine-Converted-table");
	Mealy_machine_table.innerHTML = "";
}

