
/*
 * Framework para el uso de la libreria WebGL, Three.js
 * Basado en Sim.js de Tony Parisi
 * https://github.com/tparisi/Sim.js
 * 
 * 
 */


// Iniciamos el espacio de nombres
var FwWebGL = [];

/*
 * 
 * Clase de aplicación (Singleton)
 * 
 * 
 */


// Constructor. Inicializamos los atributos.
FwWebGL.Aplicacion = function() {
    this.renderer = null;
    this.escena = null;
    this.camara = null;
    this.objetos = [];
    this.stats = null;

};


// Iniciamos la escena
FwWebGL.Aplicacion.prototype.inicia = function(parametros) {
    // Evitamos que sea nulo
    parametros = parametros || [];
    var domCont = parametros.container;
    var canvas = parametros.canvas;

    // Creamos el renderer de Three.js y lo anadimos al div
    var renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);
    domCont.appendChild(renderer.domElement);

    // Creamos una escena Three
    var escena = new THREE.Scene();
    escena.datos = this;

    // Colocamos una camara en la escena y la iluminamos
    var camara = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camara.position.set(0, 10, 50);
    escena.add(new THREE.AmbientLight(0xffffff));

    escena.add(camara);

    // Creamos un objeto raiz para contener el resto de objetos en la escena
    var raiz = new THREE.Object3D();
    escena.add(raiz);

    // Creamos un proyector para manejar las pulsaciones de raton
    var proyector = new THREE.Projector();

    this.domCont = domCont;
    this.renderer = renderer;
    this.escena = escena;
    this.camara = camara;
    this.proyector = proyector;
    this.raiz = raiz;



    for (var i = 0; i < 100; i++)
    {
        var spritey = makeTextSprite("Jaén", {fontsize: 48, backgroundColor: {r: 255, g: 100, b: 100, a: 1}});
        spritey.position.x = Math.random() * 133;
        spritey.position.y = 5;
        spritey.position.z = Math.random() * 76;
    }

    /*this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.bottom = '0px';
    this.stats.domElement.style.zIndex = 100;
    domCont.appendChild(this.stats.domElement);*/

};

// Bucle infinito de la aplicacion
FwWebGL.Aplicacion.prototype.ejecuta = function() {
    
    var that = this;
    requestAnimationFrame(function() {
        that.ejecuta();
    });
    this.actualiza();
    TWEEN.update();
    this.renderer.render(this.escena, this.camara);
};

// Metodo que actualiza la escena dentro del metodo ejecuta()
FwWebGL.Aplicacion.prototype.actualiza = function() {
    //this.stats.update();
    for (var i = 0; i < this.objetos.length; ++i) {
        this.objetos[i].actualiza();
    }
};

// Metodo para anadir objetos a la escena
FwWebGL.Aplicacion.prototype.anadeObjeto = function(objeto) {
    this.objetos.push(objeto);

    // Si es renderizable, se anade a la raiz de la escena
    if (objeto.objeto3D) {
        this.raiz.add(objeto.objeto3D);
    }
};

// Metodo para anadir objetos a la escena
FwWebGL.Aplicacion.prototype.eliminaObjeto = function(objeto) {
    var indice = this.objetos.indexOf(objeto);

    if (indice > -1) {
        this.objetos.splice(indice, 1);

        // Si es renderizable, se elimina de la escena
        if (objeto.objeto3D) {
            this.raiz.remove(objeto.objeto3D);
        }
    }
};

// Manejadores de eventos
/*
 FwWebGL.Aplicacion.prototype.anadeManejadorDom = function(){
 window.addEventListener('resize', function(e){this.redimensionaVentana(e);}, false);
 };*/

FwWebGL.Aplicacion.prototype.redimensionaVentana = function() {
    this.renderer.setSize(this.domCont.offsetWidth, this.domCont.offsetHeight);
    this.camara.aspect = this.domCont.offsetWidth / this.domCont.offsetHeight;
    this.camara.updateProjectionMatrix();
};

FwWebGL.Aplicacion.prototype.getCamara = function() {
    return this.camara;
};

/*
 * 
 * Clase de objeto
 * 
 * 
 */

// Constructor. Iniciaizamos parametros
FwWebGL.Objeto = function() {
    this.objeto3D = null;
    this.hijos = [];
};



// Actualizamos objeto
FwWebGL.Objeto.prototype.actualiza = function() {
    this.actualizaHijos();
};

// Mueve el objeto a una nueva posicion
FwWebGL.Objeto.prototype.traslada = function(x, y, z) {
    if (this.objeto3D) {
        if (x !== null)
            this.objeto3D.position.x = x;
        if (y !== null)
            this.objeto3D.position.x = x;
        if (z !== null)
            this.objeto3D.position.x = x;
    }
};

// Escala el objeto
FwWebGL.Objeto.prototype.escala = function(x, y, z) {
    if (this.objeto3D) {
        this.objeto3D.scale.set(x, y, z);
    }
};

// Actualizamos todos los hijos
FwWebGL.Objeto.prototype.actualiza = function() {
    for (var i = 0; i < this.hijos.length; ++i) {
        this.hijos[i].actualiza();
    }
};

// Se anade un objeto 3D al objeto
FwWebGL.Objeto.prototype.setObjeto3D = function(objeto3D) {
    objeto3D.dato = this;
    this.objeto3D = objeto3D;
};

// Se anade un hijo al objeto
FwWebGL.Objeto.prototype.anadeHijo = function(hijo) {
    this.hijos.push(hijo);

    // Si el objeto es renderizable, se anade a su objeto3D
    if (hijo.objet3D) {
        this.objeto3D.add(hijo.objeto3D);
    }
};

// Se elimina un hijo del objeto
FwWebGL.Objeto.prototype.eliminaHijo = function(hijo) {
    var indice = this.hijos.indexOf(hijo);

    if (indice > -1) {
        this.hijos.slice(indice, 1);

        // Si el objeto es renderizable, se anade a su objeto3D
        if (hijo.objet3D) {
            this.objeto3D.remove(hijo.objeto3D);
        }
    }
};

// Metodos utiles
FwWebGL.Objeto.prototype.getEscena = function() {
    var escena = null;
    if (this.objeto3D) {
        var obj = this.objeto3D;
        while (obj.parent) {
            obj = obj.parent;
        }
        escena = obj;
    }

    return escena;
};

FwWebGL.Objeto.prototype.getApp = function() {
    var escena = this.getEscena();
    return escena ? escena.datos : null;
};




function makeTextSprite(message, parameters)
{
    if (parameters === undefined)
        parameters = {};

    var fontface = parameters.hasOwnProperty("fontface") ?
            parameters["fontface"] : "Arial";

    var fontsize = parameters.hasOwnProperty("fontsize") ?
            parameters["fontsize"] : 18;

    var borderThickness = parameters.hasOwnProperty("borderThickness") ?
            parameters["borderThickness"] : 1;

    var borderColor = parameters.hasOwnProperty("borderColor") ?
            parameters["borderColor"] : {r: 0, g: 0, b: 0, a: 1.0};

    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
            parameters["backgroundColor"] : {r: 255, g: 255, b: 255, a: 1.0};

    var spriteAlignment = THREE.SpriteAlignment.topLeft;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;

    // get size data (height depends only on font size)
    var metrics = context.measureText(message);
    var textWidth = metrics.width;

    // background color
    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
            + backgroundColor.b + "," + backgroundColor.a + ")";
    // border color
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
            + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    //roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
    // 1.4 is extra height factor for text below baseline: g,j,p,q.

    // text color
    context.fillStyle = "rgba(0, 0, 0, 1.0)";

    context.fillText(message, borderThickness, fontsize + borderThickness);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial(
            {map: texture, useScreenCoordinates: false, alignment: spriteAlignment});
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(10, 5, 1.0);
    return sprite;
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r)
{
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}