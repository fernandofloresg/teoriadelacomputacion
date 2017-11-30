//DECLARACIÓN DE VARIABLES
let alphabet ="abcdefghijklmnopqrstuvwxyz";
alphabet = alphabet.toUpperCase();
let generator_list = [];
let generated_list = [];

//TESTING PURPOSES
generator_list = ["Σ", "A", "A", "T", "T"];
generated_list = ["A", "T", "A+T", "x", "(A)"];


let first_column = [];
let element = {symbol: "", i: 0 };
let i;
let beta;
let alpha;
let A;
let psi;
let phi;
let w = "(x+x)"; //cadena de entrada


//FUNCIONES
function isUpperCase(letter){
	return letter == letter.toUpperCase();
}

function decomposeBeta(beta){
	//En esta función obtenemos B = (phi)A(psi)
	//A es sigma o el simbolo no terminal más a la izquierda
	firstLetter=true;
	phi = psi ="λ";

	for(var i=0;i<beta.length;i++){
		letter = beta[i];
		if((letter == "Σ" || alphabet.includes(letter)) && firstLetter){
			A = letter;
			firstLetter = false;
		}else if (firstLetter) {
			if(phi == "λ"){
				phi = "";
			}
			phi += letter;
		}else {
			if(psi == "λ"){
				psi = "";
			}
			psi += letter;
		}
	}
}

function composeBeta(phi,alpha,psi){
	beta = "";
	phi = (phi == "λ")  ? "" : phi;
	psi = (psi == "λ") ? "" : psi;
	beta += phi + alpha + psi;
}

function includesTerminal(beta){
	for(var i=0;i<beta.length;i++){
		if(isUpperCase(beta[i])){
			return true;
		}
	}
	return false;
}

function isPrefix(phi, w){
	return phi == w.substring(0,phi.length) || phi=="λ";
}

function main(){
	var finished = false;
	var actual_element;
	var terminal;



	//push  (sigma , 0)
	element = {symbol: generator_list[0], i : -1};
	first_column.push(element);
	beta = element.symbol;
	aux = 0;
	//¿Pila vacía?
	while(first_column.length>0 && !finished  && aux < 20){
		aux++;
		console.log("vuelta " + aux);
		//pop para obtener (beta, i)
		actual_element = first_column.pop();
		i = actual_element.i;
		beta = actual_element.symbol;
		terminal = true;
		eux = 0;

		// Bloque de Comparación
		while(terminal && eux < 20 && !finished){
			eux++;
			decomposeBeta(beta);
			console.log("beta " + beta);
			console.log("i " + i);
			console.log("A " + A);
			
			//Aqui ya se asignaron los valores de la descomposición
			//a phi A psi de lo que es beta

			//si phi es un prefijo de w
			//Bloque de Expansión
			if(isPrefix(phi, w)){
				//Sea j el entero más pequeño mayor que i tal que la regla G es tal
				//que alpha --> a
				j=i+1;
				gRuleFound = false;
				
				while(j<generator_list.length && !gRuleFound ){
					eux++;
					if(A == generator_list[j]){
						gRuleFound=true;
						alpha = generated_list[j];
					}
					j++;
				}
				console.log("Rule found " + gRuleFound);
				console.log("j " + j);

				
				//j encontrado
				if(gRuleFound){ 
					//push(beta,j)
					element = {symbol: beta, i: j-1 };
					first_column.push(element);
					//pon beta = phi a psi 
					composeBeta(phi,alpha,psi);
					console.log("alpha " + alpha);

					//¿beta contiene un no terminal?
					terminal = includesTerminal(beta);
					if(terminal){
						i=0;
					}
				}

				if(beta == w){
					finished = true;
					console.log(beta);
				}

			}
		}
	}
	if(beta == w){
		console.log('EXITO')
		console.log(beta);
	}else{
		console.log('fracaso');
		console.log(beta);
	}

}

main();

