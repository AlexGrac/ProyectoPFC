
/*
 * Framework para el uso de la libreria WebGL, Three.js
 * Basado en Sim.js de Tony Parisi
 * https://github.com/tparisi/Sim.js
 * 
 * 
 */


// Iniciamos el espacio de nombres
FwWebGL = [];

/*
 * 
 * Clase de aplicación (Singleton)
 * 
 * 
 */


// Constructor. Inicializamos los atributos.
FwWebGL.Aplicacion = function(){
    this.renderer = null;
    this.escena = null;
    this.camara = null;
    this.objetos = [];
    
};


// Iniciamos la escena
FwWebGL.Aplicacion.prototype.inicia = function(parametros){
    // Evitamos que sea nulo
    parametros = parametros || [];
    var domCont = parametros.container;
    var canvas = parametros.canvas;
    
    // Creamos el renderer de Three.js y lo anadimos al div
    var renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    domCont.appendChild( renderer.domElement );
    
    // Creamos una escena Three
    var escena = new THREE.Scene();
    escena.datos = this;
    
    // Colocamos una camara en la escena y la iluminamos
    var camara = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camara.position.set(0, 10, 5);
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
    
    
    // Activamos los manejadores de eventos
    //this.anadeManejadorDom();
    
};

// Bucle infinito de la aplicacion
FwWebGL.Aplicacion.prototype.ejecuta = function(){
    var that = this;
    requestAnimationFrame(function() { that.ejecuta(); });
    this.actualiza();
    this.renderer.render(this.escena, this.camara);	
};

// Metodo que actualiza la escena dentro del metodo ejecuta()
FwWebGL.Aplicacion.prototype.actualiza = function(){
    
    for(var i=0; i<this.objetos.length; ++i){
        this.objetos[i].actualiza();
    }
};

// Metodo para anadir objetos a la escena
FwWebGL.Aplicacion.prototype.anadeObjeto = function(objeto){
    this.objetos.push(objeto);
    
    // Si es renderizable, se anade a la raiz de la escena
    if (objeto.objeto3D){
        this.raiz.add(objeto.objeto3D);
    }
};

// Metodo para anadir objetos a la escena
FwWebGL.Aplicacion.prototype.eliminaObjeto = function(objeto){
    var indice = this.objetos.indexOf(objeto);
    
    if (indice > -1){
        this.objetos.splice(indice, 1);

        // Si es renderizable, se elimina a la raiz de la escena
        if (objeto.objeto3D){
            this.raiz.remove(objeto.objeto3D);
        }
    }
};

// Manejadores de eventos
/*
FwWebGL.Aplicacion.prototype.anadeManejadorDom = function(){
    window.addEventListener('resize', function(e){this.redimensionaVentana(e);}, false);
};*/

FwWebGL.Aplicacion.prototype.redimensionaVentana = function(){
    this.renderer.setSize(this.domCont.offsetWidth, this.domCont.offsetHeight);
    this.camara.aspect = this.domCont.offsetWidth / this.domCont.offsetHeight;
    this.camara.updateProjectionMatrix();
};

/*
 * 
 * Clase de objeto
 * 
 * 
 */

// Constructor. Iniciaizamos parametros
FwWebGL.Objeto = function(){
    this.objeto3D = null;
    this.hijos = [];
};



// Actualizamos objeto
FwWebGL.Objeto.prototype.actualiza = function(){
    this.actualizaHijos();
};

// Mueve el objeto a una nueva posicion
FwWebGL.Objeto.prototype.traslada = function(x, y, z){
    if (this.objeto3D){
        this.objeto3D.position.set(x, y, z);
    }
};

// Escala el objeto
FwWebGL.Objeto.prototype.escala = function(x, y, z){
    if (this.objeto3D){
        this.objeto3D.scale.set(x, y, z);
    }
};

// Actualizamos todos los hijos
FwWebGL.Objeto.prototype.actualiza = function(){
    for (var i=0; i<this.hijos.length; ++i){
        this.hijos[i].actualiza();
    }
};

// Se anade un objeto 3D al objeto
FwWebGL.Objeto.prototype.setObjeto3D = function(objeto3D){
    objeto3D.dato = this;
    this.objeto3D = objeto3D;
};

// Se anade un hijo al objeto
FwWebGL.Objeto.prototype.anadeHijo = function(hijo){
    this.hijos.push(hijo);
    
    // Si el objeto es renderizable, se anade a su objeto3D
    if (hijo.objet3D){
        this.objeto3D.add(hijo.objeto3D);
    }
};

// Se elimina un hijo del objeto
FwWebGL.Objeto.prototype.eliminaHijo = function(hijo){
    var indice = this.hijos.indexOf(hijo);
    
    if (indice > -1){
        this.hijos.slice(indice, 1);

        // Si el objeto es renderizable, se anade a su objeto3D
        if (hijo.objet3D){
            this.objeto3D.remove(hijo.objeto3D);
        }
    }
};

// Metodos utiles
FwWebGL.Objeto.prototype.getEscena = function(){
    var escena = null;
    if (this.objeto3D){
        var obj = this.objeto3D;
        while(obj.parent){
            obj = obj.parent;
        }
        escena = obj;
    }
    
    return escena;
};

FwWebGL.Objeto.prototype.getApp = function(){
    var escena = this.getEscena();
    return escena ? escena.datos : null;
};


