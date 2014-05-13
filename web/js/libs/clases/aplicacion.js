/* 
 * Paquete aplicacion
 */

var modelo;
var controlador;
var vista;

Aplicacion = function() {

    FwWebGL.Aplicacion.call(this);

    modelo = new Modelo();
    vista = new Vista(modelo);
    controlador = new Controlador(modelo, vista);
    
    //modelo.nuevosMunicipios();

};

//Heredamos de la aplicacion generica
Aplicacion.prototype = new FwWebGL.Aplicacion;

//Nuestro inicializador de la aplicacion    
Aplicacion.prototype.inicia = function(parametros) {
    //Iniciamos la escena generica
    FwWebGL.Aplicacion.prototype.inicia.call(this, parametros);

    //Creamos nuestra escena

    this.camara.position.set(0, 10, 5);
    this.camara.lookAt(this.escena.position);
    var mapa = new Mapa();
    mapa.inicia(this);
    //this.anadeObjeto(mapa);

    var controles = new ControlesMapa2(this.camara, this.escena.position, vista);
    this.controles = controles;

};


Aplicacion.prototype.actualiza = function() {
    //Actualizar controles
    this.controles.actualiza();
    FwWebGL.Aplicacion.prototype.actualiza.call(this);
};


Mapa = function() {

    FwWebGL.Objeto.call(this);

};

Mapa.prototype = new FwWebGL.Objeto();

Mapa.prototype.inicia = function(aplicacion) {

    var terrainLoader = new THREE.TerrainLoader();
    //var escena = this.escena;
    var that = this;

    var textura = new THREE.Texture();
    var loader = new THREE.ImageLoader();
    loader.load('data/mapaWGS84Alpha.png', function(image) {

        textura.image = image;
        textura.needsUpdate = true;

    });

    var materialMapa = new THREE.MeshPhongMaterial({
        map: textura,
        transparent: true
    });

    var objLoader = new THREE.OBJLoader();
    objLoader.load('data/DEMEspana.obj', function(object) {

        object.traverse(function(child) {

            if (child instanceof THREE.Mesh) {
                child.position.x = 66;
                child.position.z = 38;
                child.position.y = -0.5;
                child.rotation.x = -Math.PI / 2;
                child.material = materialMapa;
            }

        });
        that.setObjeto3D(object);
        aplicacion.anadeObjeto(that);

    });

};

Mapa.prototype.actualiza = function() {
    //console.log(this.objeto3D.geometry.vertices.length);
};