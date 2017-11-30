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
	var newMooreMachine = { name: "Moore Machine " + counter, input_alph: [] ,output_alph: [], adjancency_matrix: []};
	counter++;
	MooreMachines.push(newMooreMachine);
	select = document.getElementById("selectMooreMachine");
	var option = '<option>'+ newMooreMachine.name + '</option>';
	select.innerHTML += option;
}

function selectedMooreMachineChanged(){
	loadMooreMachine();
	updateMooreMachineTable();
	cleanConversionTable();
}

function loadMooreMachine(){
	var option = document.getElementById("selectMooreMachine").value;
	actualMooreMachine = findActualMooreMachine();
	if(actualMooreMachine.input_alph == undefined || actualMooreMachine.output_alph == undefined){
		input_alph = [];
		output_alph = [];
		adjancency_matrix = [];
	}else{
		input_alph = actualMooreMachine.input_alph.slice();
		output_alph = actualMooreMachine.output_alph.slice();
		adjancency_matrix = actualMooreMachine.adjancency_matrix.slice();
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
}

function createTable(){
	var moore_machine_table =document.getElementById("Moore-Machine-table");
	moore_machine_table.innerHTML = "";
	states = "";
	for(var i=0;i<output_alph.length;i++){
		states += '<option>' + alphabet[i].toUpperCase() + '</option>';
	}

	for(var i=0;i<output_alph.length+1;i++){
		moore_machine_table.innerHTML += '<tr id="row' + i +'"> </tr>'
		for(var j=0;j<input_alph.length+2;j++){
			var row = 'row' + i;
			select_dom = '<select class="form-control" onchange="saveMooreMachine()" id="select_table' + i + "_" + j + '">';
			select_dom +=states;
			select_dom += '</select>'

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
					letter = alphabet[i-1].toUpperCase();
					document.getElementById(row).innerHTML += '<td> ' + letter + '</td>';
				}else if(j==input_alph.length+1) {
					result = output_alph[i-1];
					document.getElementById(row).innerHTML += '<td> ' + result + '</td>';
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
	

	for(var i=0;i<output_alph.length+1;i++){
		moore_machine_table.innerHTML += '<tr id="row' + i +'"> </tr>'
		for(var j=0;j<input_alph.length+2;j++){
			var row = 'row' + i;
			
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
					letter = alphabet[i-1].toUpperCase();
					document.getElementById(row).innerHTML += '<td> ' + letter + '</td>';
				}else if(j==input_alph.length+1) {
					result = output_alph[i-1];
					document.getElementById(row).innerHTML += '<td> ' + result + '</td>';
				}else {
					states = "";
					for(var k=0;k<output_alph.length;k++){
						if(adjancency_matrix != undefined){
							if(alphabet[k].toUpperCase() == adjancency_matrix[i-1][j-1]){
								states += '<option selected="selected">' + alphabet[k].toUpperCase() + '</option>';
							}else{
								states += '<option>' + alphabet[k].toUpperCase() + '</option>';
							}
						}
					}
					select_dom = '<select class="form-control" onchange="saveMooreMachine()" id="select_table' + i + "_" + j + '">';
					select_dom +=states;
					select_dom += '</select>'
					document.getElementById(row).innerHTML += '<td> ' + select_dom + '</td>';
				}
			}
		}
	}
}

function test_table(){
	document.getElementById("S-input").value = "0,1";
	document.getElementById("R-input").value = "0,1"
	getAlphabet();
	createTable();
	getAdjancencyMatrixMooreMachine();
	saveMooreMachine();
}

function getAdjancencyMatrixMooreMachine(){
	for(var i=0;i<output_alph.length+1;i++){
		if(i!=0 && j!=0 && j !=input_alph.length+1){
			console.log(adjancency_matrix);
		}
	}

	for(var i=0;i<output_alph.length+1;i++){
		for(var j=0;j<input_alph.length+1;j++){
			if(i!=0 && j!=0 && j !=input_alph.length+1){
				id = 'select_table' + i + "_" + j + '';
				select_option = document.getElementById(id).value;
				adjancency_matrix[i-1][j-1] = select_option;
			}
		}
	}
}

function saveMooreMachine(){
	actualMooreMachine = findActualMooreMachine();
	actualMooreMachine.input_alph = input_alph.slice();
	actualMooreMachine.output_alph = output_alph.slice();
	getAdjancencyMatrixMooreMachine();
	actualMooreMachine.adjancency_matrix = adjancency_matrix.slice();
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
	ref.child('mooreMachines').set(MooreMachines);
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
		MooreMachines = snapshot.child('mooreMachines').val();
		updateMooreMachineList();
		counter=MooreMachines.length;
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
}

function convertMooreMachineTable(){
	var moore_machine_table =document.getElementById("Moore-Machine-Converted-table");
	moore_machine_table.innerHTML = "";
	

	for(var i=0;i<output_alph.length+1;i++){
		moore_machine_table.innerHTML += '<tr id="row_converted' + i +'"> </tr>'
		for(var j=0;j<input_alph.length+2;j++){
			var row = 'row_converted' + i;
			
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
					for(var k=0;k<output_alph.length;k++){
						if(adjancency_matrix != undefined){
							if(alphabet[k].toUpperCase() == adjancency_matrix[i-1][j-1]){
								state =  alphabet[k].toUpperCase();
								out = output_alph[k];
							}
						}
					}
					row_dom = '<div class="row">';
					col_dom = '<div class="col-sm-2">'
					select_dom = col_dom + '<p>' + state + '</p>' ;
					div_end = '</div>'
					select_dom += div_end;
					//output selector
					output_dom = col_dom + '<p>' + out + '</p>' + div_end;
					
					select_dom = row_dom + select_dom + output_dom + div_end;
					document.getElementById(row).innerHTML += '<td> ' + select_dom + '</td>';
				}
			}
		}
	}
}

function cleanConversionTable(){
	var moore_machine_table =document.getElementById("Moore-Machine-Converted-table");
	moore_machine_table.innerHTML = "";
}