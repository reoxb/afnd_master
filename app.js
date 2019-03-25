const fs = require('fs');
const readline = require('readline'); 
const readlineSync = require('readline-sync');
const path = require('path');
const tempArray = [];

// creamos el objeto de lectura/escritura rl
// redirigimos el flujo de entrada de tty a un archivo
const rl = readline.createInterface({
  input: fs.createReadStream(path.join(__dirname, 'entrada/', '1.txt'))
});

// lee las lineas del fichero
rl.on('line', (line) => tempArray.push(line));

// Una vez terminadas de leer las lineas aplica una funcion 
rl.on('close', () => {
  const salida = AFND(tempArray);
  if(!salida){
    // console.log('Error al insertar estado inicial y estado final.');
  }
  
});

function AFND (estructura) {
  // un afnd consta de 5 elementos
  const estados = estructura[0].split(',');
  console.log('Estados := ');
  console.log(estados);
  const alfabeto = estructura[1].split(',');
  console.log('Alfabeto := ');
  console.log(alfabeto);
  const estadoInicial = estructura[2].split(',');
  console.log('Estado inicial := ');
  console.log(estadoInicial);
  const estadoFinal = estructura[3].split(',');
  console.log('Estado final := ');
  console.log(estadoFinal);
  //la funcion de transicion es lo ultimo del archivo
  const funcionTransicion = [];

  //lee funcion de transicion (estado, simbolo, estado)
  for (let i = 4; i <= estructura.length - 1; i++) {
    funcionTransicion.push(estructura[i].split(','));
  } 

  console.log('Funcion de transicion:= ');
  console.log(funcionTransicion);

  const fn_transicion = creaFuncionTransicion(funcionTransicion);
  console.log('Crea funcion de transicion := ');
  console.log(fn_transicion);

  const fn_transicion_completa = completaFuncionTransicion(estados, alfabeto, fn_transicion);
  console.log('Completa funcion de transicion := ');
  console.log(fn_transicion_completa);
  console.log('Tamanio de la funcion');
  console.log(fn_transicion_completa.length);

  const entrada = leerEntrada();
  // +aa.aa
  // -@aa.@aba

  if(validaCadena(estadoInicial, estadoFinal, entrada.split(''), fn_transicion_completa, alfabeto)){
    console.log('Su cadena fue aceptada por el automata =)');
  }else{
    console.log('Su cadena no fue aceptada por el automata :(');
  }
  console.log('Finaliza funcion principal....');
} // fin del AFND

function creaFuncionTransicion(entrada_ft) {

  const fn_trans = [];

  entrada_ft.forEach(trans => {
    //regresa un arreglo de objetos
    const transicion = {
      inicio : '', 
      simbolo: '',
      final : ''
    }

    transicion.inicio = trans[0];
    transicion.simbolo = trans[1];
    transicion.final = trans[2];

    fn_trans.push(transicion);
  });

  return fn_trans;
}

function completaFuncionTransicion(estados, simbolos, fn_transicion) {
  const fn_trans_comp = [...fn_transicion];

    estados.forEach(estado => {
      //filtra las transiciones por estado 
      let transicionesPorEstado = fn_trans_comp.filter(transicion => transicion.inicio == estado);
      //verifica si el simbolo existe en el conjunto de transiciones por estado
      simbolos.forEach( simbolo => {

        const transicion = {
          inicio : '', 
          simbolo: '',
          final : ''
        }

        let incluyeSimbolo = transicionesPorEstado.filter(transicion => transicion.simbolo == simbolo);
        // si no lo incluye lo agrega con transicion a E
        if(incluyeSimbolo.length == 0){

          transicion.inicio = estado;
          transicion.simbolo = simbolo;
          transicion.final = 'E';

          fn_trans_comp.push(transicion);
        }
      }); // fin itera simbolos
    }); // fin itera estados

  simbolos.forEach( simbolo => {
    fn_trans_comp.push({inicio: 'E', simbolo: simbolo, final:'E'});
  });

  estados.push('E');
  return fn_trans_comp;
}

function leerEntrada () {
  // capturamos la entrada del usuario sincrono
  return readlineSync.question('Introduzca una cadena de simbolos... ');
}

function validaCadena(estadoInicial, estadoFinal, cadena, funcionTransicionCompleta, alfabeto) {
  let [simbolo, ...resto] = cadena;

  if(notIncludes(simbolo)){
    console.log('El simbolo no pertenece al alfabeto := ' + simbolo);
    [simbolo, ...resto] = resto;
  }

  let estado = estadoInicial[0];
  let resultado = ['Inicio', ...estado, ...simbolo];

  const ftei = fn_trans_estado(estado); 

  if(fn_trans_rec(ftei, cadena, simbolo, estado, resultado)){
    console.log(transicion.inicio + ' -> ' + transicion.simbolo + ' -> ' + transicion.final);
    return 1;
  }

  function fn_trans_estado(estado) {
    // console.log('Funcion transicion estado := ' + estado);
    const trans_e = funcionTransicionCompleta.filter(trans => trans.inicio == estado);
    // console.log(trans_e);
    return trans_e;
  }

  function fn_trans_simbolo(simbolo, trans_e) {
    // console.log('Funcion transicion simbolo:= ' + simbolo);
    const trans_s = trans_e.filter(trans => trans.simbolo == simbolo);
    // console.log(trans_s);
    return trans_s;
  }

  function notIncludes(simbolo) {
    if (!alfabeto.includes(simbolo)){
      return 1;
    }else{
      return 0;
    }
  }

  function fn_trans_rec(fte, cadena, simbolo, estado, resultado) {
    // console.log('Cadena := ');
    // console.log(cadena);

    if(cadena.length == 0){

      let fts = fn_trans_simbolo(simbolo, fte)

      estadoFinal.forEach(ef => {

        let hay_edos_fin = fts.filter(trans_f => trans_f.final == ef);

        if( hay_edos_fin.length !== 0 ) {
          hay_edos_fin.forEach(trans_f => {
            // console.log(trans_f.inicio + ' -> ' + trans_f.simbolo + ' -> ' + trans_f.final);
            let path = resultado.join(' -> ');
            console.log(path);
          });
          return 1;
        } else {
          return -1;
        } 
      });
    } else {

      let [simbolo, ...resto] = cadena;

      if(notIncludes(simbolo)){
        console.log('El simbolo no pertenece al alfabeto := ' + simbolo);
        [simbolo, ...resto] = resto;
      }

      let fts = fn_trans_simbolo(simbolo, fte)

      fts.forEach(trans => {
        // console.log('Funcion de transicion del estado siguiente: ' + JSON.stringify(trans));
        // funcion de transicion del estado siguiente
        let ftes = fn_trans_estado(trans.final);  
        resultado = [...resultado, ...trans.final, ...simbolo];

        if(fn_trans_rec(ftes, resto, simbolo, estado, resultado)){
          console.log(trans.inicio + ' -> ' + trans.simbolo + ' -> ' + trans.final);
          return 1;
        }
      });
    }
  }
}

