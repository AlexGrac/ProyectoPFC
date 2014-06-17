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

    // Iniciamos la primera peticion


};

//Heredamos de la aplicacion generica
Aplicacion.prototype = new FwWebGL.Aplicacion;

//Nuestro inicializador de la aplicacion    
Aplicacion.prototype.inicia = function(parametros) {
    //Iniciamos la escena generica
    FwWebGL.Aplicacion.prototype.inicia.call(this, parametros);

    //Creamos nuestra escena
    var lookAt = new THREE.Vector3(Vista.Mapa.X / 3, 0, Vista.Mapa.Y / 3);
    this.camara.position.set(Vista.Mapa.X / 3, 10, Vista.Mapa.Y / 3 + 5);
    this.camara.lookAt(lookAt);

    var mar = new CapaMar();
    mar.inicia(this);

    var mapa = new Mapa();
    mapa.inicia(this);


    var controles = new ControlesMapa(this.camara, lookAt, vista, parametros.container);
    this.controles = controles;
    this.municipiosEnVentana = [];


};


Aplicacion.prototype.actualiza = function() {
    //Actualizamos controles
    this.controles.actualiza();

    var altura = this.getCamara().position.y;
    //Actualizamos los municipios
    if (vista._actualizaMunicipios) {
        vista._actualizaMunicipios = false;

        /*for (var i = 0; i < vista._municipiosPintados.length; ++i) {
         this.eliminaObjeto(vista._municipiosPintados[i]);
         }*/

        var actualizar = vista.getMunicipiosSinActualizar();
        vista._municipiosPintados = [];
        var nuevosParaCache = [];
        for (var i = 0; i < actualizar.length; ++i) {
            var municipio = vista.getVistaMunicipio(actualizar[i].nombre);

            if (municipio) {
                vista._municipiosPintados.push(municipio);
            } else {
                var vector = new THREE.Vector3(actualizar[i].x, 1, actualizar[i].y);
                var texto = actualizar[i].nombre;
                var temperatura = actualizar[i].temperatura;
                var nubes = actualizar[i].nubes;
                var tormenta = actualizar[i].tormenta;
                var precipitaciones = actualizar[i].precipitaciones;
                var nieve = actualizar[i].nieve;
                municipio = new VistaMunicipio(vector, texto, altura, temperatura, nubes, tormenta, precipitaciones, nieve);
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
                    yMunicipio >= supIzq.z && yMunicipio <= infIzq.z /*&& municipio._texto === "Madrid"*/) {
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
    loader.load('data/mapaWGS84.png', function(image) {

        textura.image = image;
        textura.needsUpdate = true;

    });

    var materialMapa = new THREE.MeshPhongMaterial({
        map: textura,
        transparent: true,
        depthWrite: false
                //wireframe: true
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


CapaMar = function() {

    FwWebGL.Objeto.call(this);

};

CapaMar.prototype = new FwWebGL.Objeto();

CapaMar.prototype.inicia = function(aplicacion) {
    var plano = new THREE.PlaneGeometry(500, 500);
     var material = new THREE.MeshBasicMaterial({color: 0xafe7f7/*depthWrite: false, transparent:false*/});
     var malla = new THREE.Mesh(plano, material);
     malla.position.x = 66;
     malla.position.y = -1;
     malla.position.z = 38;
     malla.rotation.x = -Math.PI / 2;

    this.setObjeto3D(malla);
    aplicacion.anadeObjeto(this);

};



VistaMunicipio = function(vector, texto, altura, temperatura, nubes, tormenta) {
    this._vector = vector;
    this._texto = texto;
    this._temperatura = temperatura;
    this._nubes = nubes;
    this._tormenta = tormenta;
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

    this._etiqueta = new Etiqueta(vector, texto, temperatura);
    
    var precip3h = (this._precipitaciones / 3 - 2) / 58;
    var nieve3h = (this._nieve * 10 / 3 - 2) / 58;
    
    // Elegimos el icono dependiendo de la prediccion
    
    if (this._tormenta){
        this._icono = new Tormenta(vector, 0xaaaaaa, 0.5, 1, THREE.NormalBlending);
    }else if (nieve3h > 0)
        this._icono = new Nieve(vector, 0xdddddd, 0.5, 5, 1, THREE.NormalBlending,nieve3h);
    else if (precip3h > 0)
        this._icono = new Lluvia(vector, 0xdddddd, 0.5, 5, 1, THREE.NormalBlending,precip3h);
    else if (this._nubes <= 5)
        this._icono = new Sol(vector);
    else if (this._nubes <= 50)
        this._icono = new ClarosNubes(vector, 0xeeeeee, 1, 1, 0.5, THREE.NormalBlending);
    else
        this._icono = new Nube(vector, 0xffffff, 0.5, 0.25, 1, THREE.NormalBlending);
    
   
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




Icono = function(vector) {
    this._vector = vector;
    this._geometria = null;
    
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


Etiqueta = function(vector, texto, temperatura) {
    this._texto = texto;
    this._vector = vector;
    this._temperatura = temperatura;
    this._geometria = null;
    //console.log("Se esta creando " + texto);
    FwWebGL.Objeto.call(this);
};

Etiqueta.prototype = new FwWebGL.Objeto();

Etiqueta.prototype.inicia = function(aplicacion) {

    var fuente = "Arial";
    var tama = 50;

    // Coordendas a escribir en el canvas
    var x = 5;
    var y = tama;

    var canvas = document.createElement('canvas');
    var contexto = canvas.getContext('2d');
    contexto.font = "Bold " + tama + "px " + fuente;

    // Fondo
    if (this._temperatura <= 0)
        contexto.fillStyle = "rgba(255,255,255,0.5)";
    else if (this._temperatura <= 10)
        contexto.fillStyle = "rgba(153,204,255,0.5)";
    else if (this._temperatura <= 20)
        contexto.fillStyle = "rgba(153,255,153,0.5)";
    else if (this._temperatura <= 30)
        contexto.fillStyle = "rgba(255,255,153,0.5)";
    else if (this._temperatura <= 35)
        contexto.fillStyle = "rgba(255,178,102,0.5)";
    else
        contexto.fillStyle = "rgba(255,51,51,0.5)";

    contexto.fillRect(0, 0, canvas.width, canvas.height);

    // Borde
    contexto.strokeStyle = "black";
    contexto.lineWidth = 4;
    contexto.rect(1, 1, canvas.width - 1, canvas.height - 1);
    contexto.stroke();

    //Texto    
    contexto.fillStyle = "black";
    if (this._texto.length > 12)
        this._texto = this._texto.substr(0, 10) + "...";
    contexto.fillText(this._texto, x, y);

    // El valor 20 es un factor para separar algo las dos lineas
    contexto.fillText(this._temperatura + "º", x, y + tama + 20);


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
