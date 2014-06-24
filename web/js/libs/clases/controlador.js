/*
 * @author: Alejandro Graciano Segura
 * 
 * Paquete Controlador
 * Contendra todo el manejo de eventos y las peticiones Ajax
 */


Controlador = function(modelo, vista) {
    this._modelo = modelo;
    this._vista = vista;
    //this._cuadrantesActuales = [[], []];
    this._modo = Controlador.Modo.ACTUAL;

    // Elegimos el manejador de evento para la lectura de la caja de texto
    document.getElementById("botonbusqueda").addEventListener('click', this.leeMunicipio.bind(this), false);
    document.getElementById("comboPrevision").addEventListener('change', this.cambioComboBox.bind(this), false);

    this._vista.anadeObservador(Vista.Evento.CAMARA_PARADA, this, this.realizaPeticion);
    this.cargaMunicipios();
};

Controlador.prototype.realizaPeticion = function() {
    var json = {ventana: []};
    var ventanaAux = [];
    var ventana = this._vista.getVentanaVision();
    var cuadrantes = this._vista.getCuadrantes(ventana);

    // Introducimos la esquina superior izquierda, se introducen normalizadas [0,1]
    ventanaAux.push({
        x: cuadrantes[0][0] / Vista.Cuadrantes.X,
        y: cuadrantes[0][1] / Vista.Cuadrantes.Y
    });

    // Introducimos la esquina inferior derecha
    ventanaAux.push({
        x: cuadrantes[1][0] / Vista.Cuadrantes.X / Vista.Cuadrantes.X + 1,
        y: cuadrantes[1][1] / Vista.Cuadrantes.Y / Vista.Cuadrantes.Y + 1
    });

    json.ventana = ventanaAux;
    json.modo = this._modo;
    
    document.getElementById("cargando").style.visibility = "visible";
    var url = window.location.pathname + "ventana";
    new ajax.PeticionAjax(url, this._modelo.nuevosMunicipios, null, "Post", JSON.stringify(json), 'applicaction/json', this._modelo);


};

Controlador.prototype.cargaMunicipios = function() {
    var url = window.location.pathname + "carga";
    new ajax.PeticionAjax(url, this.cargaRealizada, null, "Post", null, 'applicaction/json', this);
};


Controlador.prototype.recibeMunicipio = function(respuesta) {
    var json = JSON.parse(respuesta.responseText);
    var municipio = json.municipio;
    if (municipio === '') {
        var cajaTexto = document.getElementById("cajatexto");
        cajaTexto.style.backgroundColor = "#F5A9A9";
    } else {
        var cajaTexto = document.getElementById("cajatexto");
        cajaTexto.style.backgroundColor = "#FFFFFF";
        this._vista.mueveCamara(json.longitud, json.latitud);
    }
};

Controlador.prototype.leeMunicipio = function() {
    var municipio = document.getElementById("cajatexto").value;

    if (municipio.length > 0) {
        var url = window.location.pathname + "peticionmunicipio?municipio=" + municipio;
        new ajax.PeticionAjax(url, this.recibeMunicipio, null, null, null, null, this);
    }
};


Controlador.prototype.cambioComboBox = function() {
    var modoNuevo = document.getElementById("comboPrevision").selectedIndex;
    if (modoNuevo !== this._modo) {
        this._modo = modoNuevo;
        this._vista.limpia();
        var url = window.location.pathname + "limpia";
        new ajax.PeticionAjax(url, this.cambioModo(), null,null, null, null, this);
    }
};

Controlador.prototype.cambioModo = function() {
    this.realizaPeticion();
};

Controlador.prototype.cargaRealizada = function(respuesta){
    this._modelo.nuevosMunicipios(respuesta);
    this.realizaPeticion();
};

Controlador.Modo = [];
Controlador.Modo.ACTUAL = 0;
Controlador.Modo.HOY = 1;
Controlador.Modo.DIA1 = 2;
Controlador.Modo.DIA2 = 3;
Controlador.Modo.DIA3 = 4;

