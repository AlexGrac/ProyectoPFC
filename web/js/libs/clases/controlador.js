/* 
 * Paquete controlador
 * Contendra todo el manejo de eventos y las peticiones Ajax
 */


Controlador = function(modelo, vista) {
    this._modelo = modelo;
    this._vista = vista;
    this._cuadrantesActuales = [[], []];


    // Elegimos el manejador de evento para la lectura de la caja de texto
    var that = this;
    document.getElementById("botonbusqueda").addEventListener('click', this.leeMunicipio.bind(this), false);
    // Mantener municipios actuales

    this._vista.anadeObservador(Vista.Evento.CAMARA_PARADA, this, this.realizaPeticion);
    this.cargaMunicipios();
};

Controlador.prototype.realizaPeticion = function() {
    var ventana = this._vista.getVentanaVision();
    var cuadrantes = this._vista.getCuadrantes(ventana);

    if (cuadrantes[0][0] !== this._cuadrantesActuales[0][0] ||
            cuadrantes[0][1] !== this._cuadrantesActuales[0][1] ||
            cuadrantes[1][0] !== this._cuadrantesActuales[1][0] ||
            cuadrantes[1][1] !== this._cuadrantesActuales[1][1]) {
        //Hemos cambiado de cuadrantes por lo que realizamos la consulta

        var url = "/ProyectoPFC/ventana";
        var json = {ventana: []};
        var ventanaAux = [];
        
        // Introducimos la esquina superior izquierda, se introducen normalizadas [0,1]
        ventanaAux.push({
            x: cuadrantes[0][0] / Vista.Cuadrantes.X,
            y: cuadrantes[0][1] / Vista.Cuadrantes.Y
        });
        
        // Introducimos la esquina inferior derecha
        ventanaAux.push({
            x: cuadrantes[1][0] / Vista.Cuadrantes.X + 1 / Vista.Cuadrantes.X,
            y: cuadrantes[1][1] / Vista.Cuadrantes.Y + 1 / Vista.Cuadrantes.Y
        });
//        console.log("Superior Izquierda");
//        console.log(cuadrantes[0][0] + ", " + cuadrantes[0][1]);
//        console.log(ventanaAux[0].x + ", " + ventanaAux[0].y);
//        console.log("Inferior Derecha");
//        console.log(cuadrantes[1][0] + ", " + cuadrantes[1][1]);
//        console.log(ventanaAux[1].x + ", " + ventanaAux[1].y);
        
        json.ventana = ventanaAux;
        new ajax.PeticionAjax(url, this._modelo.nuevosMunicipios, null, "Post", JSON.stringify(json), 'applicaction/json', this._modelo);


        this._cuadrantesActuales[0][0] = cuadrantes[0][0];
        this._cuadrantesActuales[0][1] = cuadrantes[0][1];
        this._cuadrantesActuales[1][0] = cuadrantes[1][0];
        this._cuadrantesActuales[1][1] = cuadrantes[1][1];
        
    }


};

Controlador.prototype.cargaMunicipios = function() {
    var url = "/ProyectoPFC/carga";
    new ajax.PeticionAjax(url);
};

compara = function(a, b) {
    if (a.length !== b.length)
        return false;

    for (var i = 0; i < a.length; ++i)
        if (a[i] !== b[i])
            return false;

    return true;
};

Controlador.prototype.recibeMunicipio = function(respuesta){
    var json = JSON.parse(respuesta.responseText);
    var municipio = json.municipio;
    //console.log(JSON.stringify(json));
    if (municipio === ''){
        var cajaTexto = document.getElementById("cajatexto");
        cajaTexto.style.backgroundColor = "#F5A9A9";
    }else{
        var cajaTexto = document.getElementById("cajatexto");
        cajaTexto.style.backgroundColor = "#FFFFFF";
    }
};

Controlador.prototype.leeMunicipio = function(){
    var municipio = document.getElementById("cajatexto").value;
    
    if (municipio.length > 0){
        var url = "/ProyectoPFC/peticionmunicipio?municipio="+municipio;
        new ajax.PeticionAjax(url, this.recibeMunicipio);
    }
};

