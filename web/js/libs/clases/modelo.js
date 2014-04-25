
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



Modelo.prototype.nuevosMunicipios = function(municipios){
    //this.notificarCambioMunicipios();
    this.notifica(Modelo.Evento.NUEVOS_MUNICIPIOS);
};


Modelo.Municipio = function() {
    // To do
};


//Eventos observables

Modelo.Evento = [];
Modelo.Evento.NUEVOS_MUNICIPIOS = 0;