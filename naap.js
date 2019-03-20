let str = 'aa.aa';
let arrStr = str.split('');

ftr([[0,'+',1], [0,'-', 1], [0,'+',5], [0,'-', 5]], arrStr, [[0, '+', 1], [0, '-', 5]]);

function ftr(fte, cadena, fts) {
    if(cadena.length == 0){
        return 1;
    }else{
        console.log('------<-<-<-<-<---->->->------');
        cadena.shift();
        console.log(cadena);
        ftr(fn_te(fte), cadena, fn_ts(fts))
    }
    
    function fn_te(fte) {
        console.log(fte);
    }

    function fn_ts(fts) {
        console.log(fts);
    }
}
