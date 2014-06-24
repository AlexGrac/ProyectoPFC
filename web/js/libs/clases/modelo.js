/*
 * @author: Alejandro Graciano Segura
 * 
 * Paquete Modelo
 * 
 */


Modelo = function() {
    Observable.call(this);

    this._nuevosMunicipios = [];
};

Modelo.prototype = new Observable();


// Vamos a mandar solo la peticion
Modelo.prototype.nuevosMunicipios = function(respuesta) {
    
    document.getElementById("cargando").style.visibility = "hidden";

    var json = JSON.parse(respuesta.responseText);
    var municipios = json.municipios;
    this._nuevosMunicipios = municipios;
    
    this.notifica(Modelo.Evento.NUEVOS_MUNICIPIOS);
};

Modelo.prototype.getCacheMunicipios = function(){
    return this._nuevosMunicipios;
};


//Eventos observables

Modelo.Evento = [];
Modelo.Evento.NUEVOS_MUNICIPIOS = 0;

