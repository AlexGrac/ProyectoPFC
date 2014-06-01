/* 
 * Paquete vista
 */

Vista = function(modelo, controlador, controles) {
    Observable.call(this);

    this._modelo = modelo;
    this._controlador = controlador;
    this._controles = controles;
    this._actualizaMunicipios = false;
    this._actualizaVentana = false;
    this._municipiosPintados = []; // Con Vista de municipios
    this._municipiosSinPintar = []; // Con formato de la vista (coordenadas) para poder pintar
    this._cacheMunicipios = []; // Con Vista de municipios

    this._modelo.anadeObservador(Modelo.Evento.NUEVOS_MUNICIPIOS, this, this.municipiosCambiados);
};

Vista.prototype = new Observable();

/*
 Vista.prototype.municipiosCambiados = function() {
 console.log("------------------Municipios Cambiados-----------------");
 var municipios = this._modelo.getCacheMunicipios();
 this._municipiosSinPintar = [];
 
 for (var i = 0; i < municipios.length; ++i) {
 var indice = this._municipiosPintados.indexOf(municipios[i]);
 if (indice === -1) {
 this._municipiosPintados.push(municipios[i]);
 // Ponemos las coordenadas en funcion del mapa
 var nombre = municipios[i].nombre;
 var poblacion = municipios[i].poblacion;
 var x = municipios[i].longitud;
 var y = municipios[i].latitud;
 console.log(nombre);
 this._municipiosSinPintar.push({
 nombre: nombre,
 poblacion: poblacion,
 x: x * Vista.Mapa.X,
 y: y * Vista.Mapa.Y
 });
 }
 }
 
 this._actualiza = true;
 
 };
 */
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
    
    this._municipiosSinPintar = [];
    for (var i = 0; i < municipios.length; ++i) {
        // Ponemos las coordenadas en funcion del mapa
        var nombre = municipios[i].nombre + 
                ": " + municipios[i].detalles.detalles.temperatura;
        console.log(nombre);
        var poblacion = municipios[i].poblacion;
        var x = municipios[i].longitud;
        var y = municipios[i].latitud;
        this._municipiosSinPintar.push({
            nombre: nombre,
            poblacion: poblacion,
            x: x * Vista.Mapa.X,
            y: y * Vista.Mapa.Y
        });
    }
    
    // Avisamos de que la vista debe actualizarse
    this._actualizaMunicipios = true;

};


Vista.prototype.getMunicipiosSinPintar = function() {
    return this._municipiosSinPintar;
};


Vista.prototype.camaraParada = function() {
    this.notifica(Vista.Evento.CAMARA_PARADA);
};

Vista.prototype.setControles = function(controles) {
    this._controles = controles;
};

Vista.prototype.getVentanaVision = function() {
    return this._controles.getVentanaVision();
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

    // Esquina superior derecha
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


