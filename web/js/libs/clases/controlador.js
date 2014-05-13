/* 
 * Paquete controlador
 * Contendra todo el manejo de eventos y las peticiones Ajax
 */


Controlador = function(modelo, vista) {
    this._modelo = modelo;
    this._vista = vista;
    

    //Mantener municipios actuales

    this._vista.anadeObservador(Vista.Evento.CAMARA_PARADA, this, this.realizaPeticion);
    this.inicializaEventos();
};

Controlador.prototype.realizaPeticion = function() {
    
};



