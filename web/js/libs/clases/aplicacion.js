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
    var lookAt = new THREE.Vector3(Vista.Mapa.X / 2, 0, Vista.Mapa.Y / 2);
    this.camara.position.set(Vista.Mapa.X / 2, 10, Vista.Mapa.Y / 2 + 5);
    this.camara.lookAt(lookAt);
    var mapa = new Mapa();

    mapa.inicia(this);
    this.anadeObjeto(mapa);

    // Puntos de prueba
    /*    for (var i = 0; i < 300; ++i) {
     var punto = new Punto(Math.random() * 133, Math.random() * 76);
     punto.inicia(this);
     }*/
    var controles = new ControlesMapa2(this.camara, lookAt, vista, parametros.container);
    this.controles = controles;
    this.municipiosEnVentana = [];

};


Aplicacion.prototype.actualiza = function() {
    //Actualizamos controles
    this.controles.actualiza();
    
    var altura = this.getCamara().position.y;
    //Actualizamos los municipios
    if (vista._actualizaMunicipios) {
        console.log("Actualiza municipios");
        vista._actualizaMunicipios = false;

        /*for (var i = 0; i < vista._municipiosPintados.length; ++i) {
         this.eliminaObjeto(vista._municipiosPintados[i]);
         }*/

        var actualizar = vista.getMunicipiosSinPintar();
        vista._municipiosPintados = [];
        var nuevosParaCache = [];
        for (var i = 0; i < actualizar.length; ++i) {
            var municipio = vista.getVistaMunicipio(actualizar[i].nombre);

            if (municipio) {
                vista._municipiosPintados.push(municipio);
            } else {
                var vector = new THREE.Vector3(actualizar[i].x, 1, actualizar[i].y);
                var texto = actualizar[i].nombre;
                municipio = new VistaMunicipio(vector, texto, altura);
                municipio.inicia(this);
                vista._municipiosPintados.push(municipio);
                nuevosParaCache.push(municipio);
            }


        }
        vista._cacheMunicipios = vista._cacheMunicipios.concat(nuevosParaCache);
        /*for (var i=0; i<vista._municipiosPintados.length; ++i){
         this.anadeObjeto(vista._municipiosPintados[i]);
         }*/
        vista._actualizaVentana = true;
    }

    if (vista._actualizaVentana) {
        vista._actualizaVentana = false;
        console.log("Actualiza ventana");
        // Eliminamos los objetos de la escena para evitar la sobrecarga
        for (var i = 0; i < this.municipiosEnVentana.length; ++i) {
            this.eliminaObjeto(this.municipiosEnVentana[i].getEtiqueta());
            this.eliminaObjeto(this.municipiosEnVentana[i].getIcono());
            //this.eliminaObjeto(this.municipiosEnVentana[i].getBB());
        }
        this.municipiosEnVentana = [];

        // Pintamos los municipios que caigan exclusivamente en la ventana de vision
        var ventana = vista.getVentanaVision();
        var supIzq = ventana[0];
        var supDer = ventana[1];
        var infIzq = ventana[2];
        var infDer = ventana[3];


        for (var i = 0; i < vista._municipiosPintados.length; ++i) {
            var municipio = vista._municipiosPintados[i];
            var xMunicipio = municipio._vector.x;
            var yMunicipio = municipio._vector.z;

            // Comprobamos si colisiona
            var colisiona = false;
            for (var j = 0; j < this.municipiosEnVentana.length; ++j) {
                if (municipio.colisiona(this.municipiosEnVentana[j])) {
                        colisiona = true; 
                        break;
                }
            }

            // Lo escalamos a razon del nivel de zoom
            if (!colisiona && xMunicipio >= supIzq.x && xMunicipio <= supDer.x &&
                    yMunicipio >= supIzq.z && yMunicipio <= infIzq.z) {

                if (altura < 12) {
                    municipio.escalaMunicipio(2.5);
                } else if (altura < 18) {
                    municipio.escalaMunicipio(4.5);
                } else if (altura < 24) {
                    municipio.escalaMunicipio(6.5);
                } else {
                    municipio.escalaMunicipio(8.5);
                }
                this.municipiosEnVentana.push(municipio);
                this.anadeObjeto(municipio.getEtiqueta());
                this.anadeObjeto(municipio.getIcono());
                //this.anadeObjeto(municipio.getBB());
            }
        }
    }

    FwWebGL.Aplicacion.prototype.actualiza.call(this);
};


Mapa = function() {

    FwWebGL.Objeto.call(this);

};

Mapa.prototype = new FwWebGL.Objeto();

Mapa.prototype.inicia = function(aplicacion) {

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
    objLoader.load('data/DEMEspana25.obj', function(object) {

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



VistaMunicipio = function(vector, texto, altura) {
    this._vector = vector;
    this._texto = texto;
    this._tamanoBB = 1;

    var factor;

    if (altura < 12) {
        factor = 2.5;
    } else if (altura < 18) {
        factor = 4.5;
    } else if (altura < 24) {
        factor = 6.5;
    } else {
        factor = 8.5;
    }

    var min = new THREE.Vector3();
    var max = new THREE.Vector3();

    max.setX((this._vector.x + factor) * this._tamanoBB);
    max.setY((this._vector.y + factor / 2) * this._tamanoBB);
    max.setZ((this._vector.z + factor / 2) * this._tamanoBB);

    min.setX((this._vector.x - factor) * this._tamanoBB);
    min.setY((this._vector.y - factor / 2) * this._tamanoBB);
    min.setZ((this._vector.z - factor / 2) * this._tamanoBB);

    this._BB = new THREE.Box3(min, max);

    this._etiqueta = new Etiqueta(vector, texto);
    this._icono = new Icono(vector);
    //this._BB = new CajaEnvolvente(vector);
};

VistaMunicipio.prototype.inicia = function(aplicacion) {
    this._etiqueta.inicia(aplicacion);
    this._icono.inicia(aplicacion);
    //this._BB.inicia(aplicacion);
};

VistaMunicipio.prototype.escalaMunicipio = function(factor) {
    this._etiqueta.escala(factor, factor / 2, 1.0);
    this._icono.escala(factor, factor, factor);
    //this._BB.escala(this._tamanoBB * factor * 2,this._tamanoBB * factor,this._tamanoBB * factor);

    this._BB.max.x = (this._vector.x + factor) * this._tamanoBB;
    this._BB.max.y = (this._vector.y + factor / 2) * this._tamanoBB;
    this._BB.max.z = (this._vector.z + factor / 2) * this._tamanoBB;

    this._BB.min.x = (this._vector.x - factor) * this._tamanoBB;
    this._BB.min.y = (this._vector.y - factor / 2) * this._tamanoBB;
    this._BB.min.z = (this._vector.z - factor / 2) * this._tamanoBB;

    //var caja2 = new CajaEnvolvente2(this._vector);
    //caja2.inicia(this._aplicacion, this._BB.max.x - this._BB.min.x, this._BB.max.y - this._BB.min.y, this._BB.max.z - this._BB.min.z);
    // Guardamos la distancia
    this._etiqueta._geometria.position.x = this._vector.x - factor / 2;
    this._icono._geometria.position.x = this._vector.x + factor / 2;
};

VistaMunicipio.prototype.getEtiqueta = function() {
    return this._etiqueta;
};

VistaMunicipio.prototype.getIcono = function() {
    return this._icono;
};

/*VistaMunicipio.prototype.getBB = function(){
 return this._BB;
 };*/


VistaMunicipio.prototype.colisiona = function(municipio) {
    return this._BB.isIntersectionBox(municipio._BB);
};


/*CajaEnvolvente2 = function(vector) {
    this._vector = vector;
    this._geometria = null;
    //console.log("Se esta creando " + texto);
    FwWebGL.Objeto.call(this);
};

CajaEnvolvente2.prototype = new FwWebGL.Objeto();

CajaEnvolvente2.prototype.inicia = function(aplicacion, x, y, z) {

    // Esfera
    var geometriaIcono = new THREE.CubeGeometry(x, y, z);
    this._geometria = new THREE.Mesh(geometriaIcono, new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true}));
    this._geometria.position.x = this._vector.x;
    this._geometria.position.y = this._vector.y;
    this._geometria.position.z = this._vector.z;

    //etiqueta.add(icono);

    this.setObjeto3D(this._geometria);
    aplicacion.anadeObjeto(this);

};


CajaEnvolvente = function(vector) {
    this._vector = vector;
    this._geometria = null;
    //console.log("Se esta creando " + texto);
    FwWebGL.Objeto.call(this);
};

CajaEnvolvente.prototype = new FwWebGL.Objeto();

CajaEnvolvente.prototype.inicia = function(aplicacion) {

    // Esfera
    var geometriaIcono = new THREE.CubeGeometry(1, 1, 1);
    this._geometria = new THREE.Mesh(geometriaIcono, new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true}));
    this._geometria.position.x = this._vector.x;
    this._geometria.position.y = this._vector.y;
    this._geometria.position.z = this._vector.z;

    //etiqueta.add(icono);

    this.setObjeto3D(this._geometria);
    //aplicacion.anadeObjeto(this);

};
*/


Icono = function(vector) {
    this._vector = vector;
    this._geometria = null;
    //console.log("Se esta creando " + texto);
    FwWebGL.Objeto.call(this);
};

Icono.prototype = new FwWebGL.Objeto();

Icono.prototype.inicia = function(aplicacion) {

    // Esfera
    var geometriaIcono = new THREE.CubeGeometry(1, 1, 1);
    this._geometria = new THREE.Mesh(geometriaIcono, new THREE.MeshBasicMaterial({color: 0x0000ff}));
    this._geometria.position.x = this._vector.x;
    this._geometria.position.y = this._vector.y;
    this._geometria.position.z = this._vector.z;

    //etiqueta.add(icono);

    this.setObjeto3D(this._geometria);
    //aplicacion.anadeObjeto(this);

};


Etiqueta = function(vector, texto) {
    this._texto = texto;
    this._vector = vector;
    this._geometria = null;
    //console.log("Se esta creando " + texto);
    FwWebGL.Objeto.call(this);
};

Etiqueta.prototype = new FwWebGL.Objeto();

Etiqueta.prototype.inicia = function(aplicacion) {



    var fuente = "Arial";
    var tama = 48;
    var anchoBorde = 1;

    //var alineamiento = THREE.SpriteAlignment.topLeft;

    var canvas = document.createElement('canvas');

    var contexto = canvas.getContext('2d');
    contexto.font = "Bold " + tama + "px " + fuente;

    contexto.fillText(this._texto, 0, tama);

    var textura = new THREE.Texture(canvas);
    textura.needsUpdate = true;

    var materialEtiqueta = new THREE.SpriteMaterial(
            {map: textura, useScreenCoordinates: false});
    this._geometria = new THREE.Sprite(materialEtiqueta);

    this._geometria.scale.set(2.5, 1.25, 1.0);

    this._geometria.position.x = this._vector.x;
    this._geometria.position.y = this._vector.y;
    this._geometria.position.z = this._vector.z;


    this.setObjeto3D(this._geometria);
    //aplicacion.anadeObjeto(this);


};

