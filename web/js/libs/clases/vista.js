/* 
 * Paquete vista
 */

Vista = function(modelo, controlador){
    
    this._modelo = modelo;
    this._controlador = controlador;
    
    this._modelo.anadeObservador(Modelo.Evento.NUEVOS_MUNICIPIOS, this, this.municipiosCambiados);
};


Vista.prototype.municipiosCambiados = function(){
    alert("Municipios Cambiados");
};


