/* 
 * Paquete vista
 */

Vista = function(modelo, controlador){
    Observable.call(this);
    
    this._modelo = modelo;
    
    this._modelo.anadeObservador(Modelo.Evento.NUEVOS_MUNICIPIOS, this, this.municipiosCambiados);
};

Vista.prototype = new Observable();

Vista.prototype.municipiosCambiados = function(){
    alert("Municipios Cambiados");
};


Vista.prototype.camaraParada = function(){
    this.notifica(Vista.Evento.CAMARA_PARADA);
};


//Eventos observables

Vista.Evento = [];
Vista.Evento.CAMARA_PARADA = 0;