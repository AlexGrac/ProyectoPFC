
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

    /*var municipiosJSON = JSON.parse(peticion.responseText);
    console.log(JSON.stringify(municipiosJSON.municipios));*/
    
    var json = JSON.parse(respuesta.responseText);
    var municipios = json.municipios;

    // Incluimos la respuesta en la cache
    this._cacheMunicipios = municipios;

    
    this.notifica(Modelo.Evento.NUEVOS_MUNICIPIOS);
};

Modelo.prototype.getCacheMunicipios = function(peticion){
    return this._cacheMunicipios;
};

Modelo.Municipio = function() {
    // To do
};


//Eventos observables

Modelo.Evento = [];
Modelo.Evento.NUEVOS_MUNICIPIOS = 0;