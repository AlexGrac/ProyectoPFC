/*
 * @author Alejandro Graciano Segura
 * @version 1.2
 * @date 01-04-2014
 * 
 * Controles para el manejo de la cámara para la API de WebGL. Three.js
 * http://threejs.org/docs/
 * 
 */

/* Se debe cambiar el formato*/

ControlesMapa = function(camara, lookAt, vista, dom) {

    var RATON = {DERECHA: 0};
    var ESTADO = {NADA: 0, ARRASTRA: 1, SUELTA: 2, SCROOL: 3, PARADO: 4};
    var CERO = 10e-4;
    var camara = camara;
    var dom = (dom !== undefined) ? dom : document;
    var estado = ESTADO.NADA;
    var contadorReloj;

    // Referencia a su vista para indicar cuando esta parada la camara.
    this.vista = vista;
    this.vista.setControles(this);
    this.primero = true;
    var a = new THREE.Vector3();
    var b = new THREE.Vector3();
    var desplazamiento = new THREE.Vector2();

    var ancho = window.outerHeight;
    var alto = window.outerWidth;



    var plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);


    //variables para el zoom
    var zoom = 1;
    var incr = 0.2;
    var lookAt = lookAt;

    //variables para la inercia
    var inercia = new THREE.Vector2();

    

    this.actualiza = function() {
        var x = camara.position.x;
        var y = camara.position.y;
        var z = camara.position.z;

        var lx = lookAt.x;
        var ly = lookAt.y;
        var lz = lookAt.z;

        contadorReloj++;
        switch (estado) {
            case ESTADO.PARADO:
                //this.vista._borraMunicipios = true;
                this.vista.camaraParada();
                
                estado = ESTADO.NADA;
                break;
            case ESTADO.ARRASTRA:
                this.vista._actualizaVentana = true;
                if (this.movimientoValido(desplazamiento.x, desplazamiento.y)) {
                    var factor = y > 1 ? y : 1;
                    contadorReloj = 0;
                    camara.position.set(x - desplazamiento.x, y, z - desplazamiento.y);
                    lookAt.set(lx - desplazamiento.x, ly, lz - desplazamiento.y);
                }
                
                estado = ESTADO.PARADO;

                break;
            case ESTADO.SCROOL:
                var yResultante = camara.position.y + zoom * (ly - y) / 20;
                if (this.movimientoValido(-zoom * 2, -zoom * 2) && yResultante > 6) {
                    this.vista._actualizaVentana = true;
                    camara.position.x += zoom * (lx - x) / 20;
                    camara.position.y += zoom * (ly - y) / 20;
                    camara.position.z += zoom * (lz - z) / 20;
                }
                estado = ESTADO.PARADO;
                break;
            case ESTADO.SUELTA:
                if (this.movimientoValido(inercia.x, inercia.y)) {
                    var factor = 1.01;

                    camara.position.set(x - inercia.x, y, z - inercia.y);
                    lookAt.set(lx - inercia.x, ly, lz - inercia.y);

                    inercia.x /= factor;
                    inercia.y /= factor;


                    if (Math.abs(inercia.x) <= CERO && Math.abs(inercia.y) <= CERO) {
                        estado = ESTADO.PARADO;
                    }
                } else {
                    estado = ESTADO.PARADO;
                }

                break;

        }

        if (this.primero){
            this.primero = false;
            estado = ESTADO.PARADO;
        }

    };


    this.mueveCamara = function(x, y, z) {
        y = (y !== null) ? y : camara.position.y;

        var lx = camara.position.x - x;
        var ly = camara.position.y - y;
        var lz = camara.position.z - z;

        //camara.position.x = x;
        //camara.position.y = y;
        //camara.position.z = z;

        lookAt.x -= lx;
        lookAt.y -= ly;
        lookAt.z -= lz;
        
        var inicio = {x: camara.position.x, y: camara.position.y, z:camara.position.z};
        var final = {x:x , y:y, z:z + 2};
        var that = this;
        var tween = new TWEEN.Tween(inicio)
                    .to(final, 1000)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate(function(){
                        camara.position.x = inicio.x;
                        camara.position.y = inicio.y;
                        camara.position.z = inicio.z;
                    }).onComplete(function() {
                        that.vista.camaraParada();
                    }).start();
                    
    };
    

    //listeners

    function pulsaRaton(evento) {

        a = proyectaPulsacion(evento.clientX, evento.clientY);
        dom.addEventListener('mousemove', mueveRaton, false);
    }
    ;

    function mueveRaton(evento) {
        estado = ESTADO.ARRASTRA;
        document.body.style.cursor = 'move';
        if (evento.button === RATON.DERECHA) {
            b = proyectaPulsacion(evento.clientX, evento.clientY);
            desplazamiento.x = b.x - a.x;
            desplazamiento.y = b.z - a.z;

        }
    }
    ;

    function sueltaRaton(evento) {
        if (contadorReloj < 5) {
            estado = ESTADO.SUELTA;
            inercia.x = desplazamiento.x;
            inercia.y = desplazamiento.y;
            desplazamiento.x = desplazamiento.y = 0;
        }

        document.body.style.cursor = 'default';
        dom.removeEventListener('mousemove', mueveRaton);
    }
    ;


    function scrollRaton(evento) {
        estado = ESTADO.SCROOL;
        zoom = ((typeof evento.wheelDelta !== "undefined") ? (-evento.wheelDelta) : evento.detail);
        zoom = ((zoom < 0) ? 1 : -1);
    }

    function proyectaPulsacion(x, y) {
        var vector = new THREE.Vector3(x / alto * 2 - 1, -y / ancho * 2 + 1, 0.5);
        var proyector = new THREE.Projector();
        var rayo = new THREE.Raycaster();
        rayo = proyector.pickingRay(vector, camara);
        return rayo.ray.intersectPlane(plano);
    }

    ControlesMapa.prototype.movimientoValido = function(dx, dy) {
        var ventana = this.getVentanaVision();

        /*console.log("a" + ventana[0].x + ", " + ventana[0].z);
         console.log("b" + ventana[1].x + ", " + ventana[1].z);
         console.log("c" + ventana[2].x + ", " + ventana[2].z);
         console.log("d" + ventana[3].x + ", " + ventana[3].z);*/
        var sup = ventana[0].z - dy >= 1;
        var inf = ventana[3].z - dy <= Vista.Mapa.Y - 1;
        var izq = ventana[2].x - dx >= 1;
        var der = ventana[3].x - dx <= Vista.Mapa.X - 1;
        return sup && inf && der && izq;
    };

    ControlesMapa.prototype.getVentanaVision = function() {
        var a, b, c, d;
        
        a = proyectaPulsacion(0, 0);
        b = proyectaPulsacion(alto, 0);
        c = proyectaPulsacion(0, ancho);
        d = proyectaPulsacion(alto, ancho);
        var ventana = [a, b, c, d];

        return ventana;

    };


    dom.addEventListener('mousedown', pulsaRaton, false);
    dom.addEventListener('mouseup', sueltaRaton, false);
    dom.addEventListener('mousewheel', scrollRaton, false);
    dom.addEventListener('DOMMouseScroll', scrollRaton, false); // firefox
    
    
};



