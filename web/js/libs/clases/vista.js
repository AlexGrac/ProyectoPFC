/* 
 * Paquete vista
 */

Vista = function(modelo, controlador, controles) {
    Observable.call(this);

    this._modelo = modelo;
    //this._controlador = controlador;
    this._controles = controles;
    this._actualizaMunicipios = false;
    this._actualizaVentana = false;
    //this._borraMunicipios = false;
    this._municipiosPintados = []; // Con Vista de municipios
    this._municipiosSinActualizar = []; // Con formato de la vista (coordenadas) para poder pintar
    this._cacheMunicipios = []; // Con Vista de municipios
    this._cuadrantesActuales = [[], []];

    this._modelo.anadeObservador(Modelo.Evento.NUEVOS_MUNICIPIOS, this, this.municipiosCambiados);
};


Vista.prototype = new Observable();

/*
 * Sobrarian las caches ya que se va a enviar lo del modelo
 */

Vista.prototype.getVistaMunicipio = function(nombre){
    //console.log("---------COMPARAR MUNICIPIO-------");
    for (var i=0; i<this._cacheMunicipios.length; i++){
        if (this._cacheMunicipios[i]._texto === nombre){
            return this._cacheMunicipios[i];
        }
    }
    //console.log("No coincide con ninguno");
    return null;
};

Vista.prototype.municipiosCambiados = function() {
    var municipios = this._modelo.getCacheMunicipios();
    
    this._municipiosSinActualizar = [];
    for (var i = 0; i < municipios.length; ++i) {
        // Ponemos las coordenadas en funcion del mapa
        var nombre = municipios[i].nombre;
        var poblacion = municipios[i].poblacion;
        var x = municipios[i].longitud;
        var y = municipios[i].latitud;
        var temperatura = municipios[i].detalles.temperatura;
        var nubes = municipios[i].detalles.nubes;
        var tormenta = municipios[i].detalles.tormenta;
        var precipitaciones = municipios[i].detalles.precipitaciones;
        var nieve = municipios[i].detalles.nieve;
        this._municipiosSinActualizar.push({
            nombre: nombre,
            poblacion: poblacion,
            x: x * Vista.Mapa.X,
            y: y * Vista.Mapa.Y,
            temperatura : temperatura,
            nubes: nubes,
            precipitaciones:precipitaciones,
            tormenta:tormenta,
            nieve:nieve
        });
    }
    // Avisamos de que la vista debe actualizarse
    this._actualizaMunicipios = true;

};



Vista.prototype.getMunicipiosSinActualizar = function() {
    return this._municipiosSinActualizar;
};


Vista.prototype.camaraParada = function() {
    var ventana = this.getVentanaVision();
    var cuadrantes = this.getCuadrantes(ventana);
    
    if (cuadrantes[0][0] !== this._cuadrantesActuales[0][0] ||
            cuadrantes[0][1] !== this._cuadrantesActuales[0][1] ||
            cuadrantes[1][0] !== this._cuadrantesActuales[1][0] ||
            cuadrantes[1][1] !== this._cuadrantesActuales[1][1]) {
        //Hemos cambiado de cuadrantes por lo que realizamos la consulta

        this.notifica(Vista.Evento.CAMARA_PARADA);
        
        this._cuadrantesActuales[0][0] = cuadrantes[0][0];
        this._cuadrantesActuales[0][1] = cuadrantes[0][1];
        this._cuadrantesActuales[1][0] = cuadrantes[1][0];
        this._cuadrantesActuales[1][1] = cuadrantes[1][1];
        
    }

};

Vista.prototype.setControles = function(controles) {
    this._controles = controles;
};

Vista.prototype.getVentanaVision = function() {
    return this._controles.getVentanaVision();
};

Vista.prototype.mueveCamara = function (x, y){
    this._controles.mueveCamara(x * Vista.Mapa.X, 6, y * Vista.Mapa.Y);
        
   
};

Vista.prototype.getCuadrantes = function(ventana) {
    var supIzq = [];
    var infDer = [];


    // Esquina superior izquierda
    if (ventana[0].x <= 0)
        supIzq.push(0);
    else if (ventana[0].x > Vista.Mapa.X)
        supIzq.push(Vista.Cuadrantes.X);
    else
        supIzq.push(Math.floor((ventana[0].x / Vista.Mapa.X) * Vista.Cuadrantes.X));

    if (ventana[0].z <= 0)
        supIzq.push(0);
    else if (ventana[0].z > Vista.Mapa.Y)
        supIzq.push(Vista.Cuadrantes.Y);
    else
        supIzq.push(Math.floor((ventana[0].z / Vista.Mapa.Y) * Vista.Cuadrantes.Y));

    // Esquina inferior derecha
    if (ventana[3].x <= 0)
        infDer.push(0);
    else if (ventana[3].x > Vista.Mapa.X)
        infDer.push(Vista.Cuadrantes.X);
    else
        infDer.push(Math.floor((ventana[3].x / Vista.Mapa.X) * Vista.Cuadrantes.X));

    if (ventana[3].z <= 0)
        infDer.push(0);
    else if (ventana[3].z > Vista.Mapa.Y)
        infDer.push(Vista.Cuadrantes.Y);
    else
        infDer.push(Math.floor((ventana[3].z / Vista.Mapa.Y) * Vista.Cuadrantes.Y));

    var cuadrantes = [supIzq, infDer];

    return cuadrantes;

};

Vista.prototype.limpia = function(){
    this._cacheMunicipios = [];
    this._municipiosPintados = [];
    this._cuadrantesActuales = [[], []];
};

// Eventos observables

Vista.Evento = [];
Vista.Evento.CAMARA_PARADA = 0;


// Constantes Cuadrantes

Vista.Cuadrantes = [];
Vista.Cuadrantes.X = 5;
Vista.Cuadrantes.Y = 5;

// Constantes para el mapa

Vista.Mapa = [];
Vista.Mapa.X = 133;
Vista.Mapa.Y = 76;


