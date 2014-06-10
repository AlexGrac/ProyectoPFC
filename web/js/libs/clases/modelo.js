
/*
 * Paquete Modelo
 * 
 * 
 */


Modelo = function() {
    Observable.call(this);

    this._cacheMunicipios = [];
    //this._observadoresMunicipios = [];
};

Modelo.prototype = new Observable();


// Vamos a mandar solo la peticion
Modelo.prototype.nuevosMunicipios = function(respuesta) {

    /*var municipiosJSON = JSON.parse(respuesta.responseText);
    console.log(JSON.stringify(municipiosJSON.municipios));*/
    var json = JSON.parse(respuesta.responseText);
    var municipios = json.municipios;
    this._cacheMunicipios = municipios;
    
    this.notifica(Modelo.Evento.NUEVOS_MUNICIPIOS);
};

Modelo.prototype.getCacheMunicipios = function(){
    return this._cacheMunicipios;
};


//Eventos observables

Modelo.Evento = [];
Modelo.Evento.NUEVOS_MUNICIPIOS = 0;

