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
    var ESTADO = {NADA: 0, ARRASTRA: 1, SUELTA: 2, SCROOL: 3, PARADO: 4, INCORRECTO: 5};
    var CERO = 10e-4;
    var camara = camara;
    var dom = (dom !== undefined) ? dom : document;
    var estado = ESTADO.NADA;
    var contadorReloj;
    this.distanciaMax = 60;
    this.distanciaMin = 6;

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
    var centro = new THREE.Vector3(Vista.Mapa.X / 2, 0, Vista.Mapa.Y / 2);
    var posicionRetorno = new THREE.Vector3();
    var lookAtRetorno = new THREE.Vector3();

    this.actualiza = function() {
        var x = camara.position.x;
        var y = camara.position.y;
        var z = camara.position.z;

        var lx = lookAt.x;
        var ly = lookAt.y;
        var lz = lookAt.z;

        contadorReloj++;
//        console.log(x + ", " + y + ", " + z);
//        console.log(lx + ", " + ly + ", " + lz);
//        console.log(centro.x + ", " + centro.y + ", " + centro.z);
        switch (estado) {

            case ESTADO.PARADO:
                //this.vista._borraMunicipios = true;
                this.vista.camaraParada();

                estado = ESTADO.NADA;
                break;
            case ESTADO.ARRASTRA:
                this.vista._actualizaVentana = true;
                var factor = y > 1 ? y : 1;
                contadorReloj = 0;
                camara.position.set(x - desplazamiento.x, y, z - desplazamiento.y);
                lookAt.set(lx - desplazamiento.x, ly, lz - desplazamiento.y);
                if (this.movimientoValido()) {
                    posicionRetorno.x = camara.position.x;
                    posicionRetorno.y = camara.position.y;
                    posicionRetorno.z = camara.position.z;

                    lookAtRetorno.x = lookAt.x;
                    lookAtRetorno.y = lookAt.y;
                    lookAtRetorno.z = lookAt.z;
                }

                estado = ESTADO.PARADO;

                break;
            case ESTADO.SCROOL:
                var inicio = {x: x, y: y, z: z};
                var final = {x: x + zoom * (lx - x) / 4, y: y + zoom * (ly - y) / 4, z: z + zoom * (lz - z) / 4};
                var camaraActual = new THREE.Vector3();
                camaraActual.x = camara.position.x;
                camaraActual.y = camara.position.y;
                camaraActual.z = camara.position.z;
                camara.position.x += zoom * (lx - x) / 4;
                camara.position.y += zoom * (ly - y) / 4;
                camara.position.z += zoom * (lz - z) / 4;
                if (this.movimientoValido()) {
                    
                    camara.position.x = camaraActual.x;
                    camara.position.y = camaraActual.y;
                    camara.position.z = camaraActual.z;
                    posicionRetorno.x = camara.position.x;
                    posicionRetorno.y = camara.position.y;
                    posicionRetorno.z = camara.position.z;

                    lookAtRetorno.x = lookAt.x;
                    lookAtRetorno.y = lookAt.y;
                    lookAtRetorno.z = lookAt.z;
                    var that = this;
                    var tween = new TWEEN.Tween(inicio)
                            .to(final, 250)
                            .easing(TWEEN.Easing.Linear.None)
                            .onUpdate(function() {
                                camara.position.x = inicio.x;
                                camara.position.y = inicio.y;
                                camara.position.z = inicio.z;
                            }).onComplete(function() {
                                /*if (zoom === 1)
                                    that.vista._actualizaVentana = true;
                                else*/
                                   
                    }).start();
                     estado = ESTADO.PARADO;
                } else {
                    camara.position.x = camaraActual.x;
                    camara.position.y = camaraActual.y;
                    camara.position.z = camaraActual.z;
                }
                //estado = ESTADO.NADA;
                break;
            case ESTADO.SUELTA:
                if (this.movimientoValido()) {
                    if (contadorReloj < 5) {
                        //console.log("Inercia x " + inercia.x);
                        //console.log("Inercia y " + inercia.y);
                        contadorReloj = 0;
                        var factor = 1.01;

                        posicionRetorno.x = camara.position.x;
                        posicionRetorno.y = camara.position.y;
                        posicionRetorno.z = camara.position.z;

                        lookAtRetorno.x = lookAt.x;
                        lookAtRetorno.y = lookAt.y;
                        lookAtRetorno.z = lookAt.z;

                        camara.position.set(x - inercia.x, y, z - inercia.y);
                        lookAt.set(lx - inercia.x, ly, lz - inercia.y);

                        inercia.x /= factor;
                        inercia.y /= factor;

                        if (Math.abs(inercia.x) <= CERO && Math.abs(inercia.y) <= CERO) {
                            estado = ESTADO.PARADO;
                        }
                    } else {
                        estado = ESTADO.NADA;
                    }

                } else {
                    estado = ESTADO.INCORRECTO;

                }

                break;
            case ESTADO.INCORRECTO:

                var inicio = {x: camara.position.x, y: camara.position.y, z: camara.position.z};
                var final = {x: posicionRetorno.x, y: posicionRetorno.y, z: posicionRetorno.z};
                lookAt.x = lookAtRetorno.x;
                lookAt.y = lookAtRetorno.y;
                lookAt.z = lookAtRetorno.z;
                var tween = new TWEEN.Tween(inicio)
                        .to(final, 250)
                        .easing(TWEEN.Easing.Back.Out)//Cubic.out
                        .onUpdate(function() {
                            camara.position.x = inicio.x;
                            camara.position.y = inicio.y;
                            camara.position.z = inicio.z;
                        }).onComplete(function() {
                    estado = ESTADO.PARADO;
                }).start();

                //estado = ESTADO.PARADO;
                break;

        }

        /*if (this.primero) {
            this.primero = false;
            estado = ESTADO.PARADO;
        }*/

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
        
        posicionRetorno.x = camara.position.x;
        posicionRetorno.y = camara.position.y;
        posicionRetorno.z = camara.position.z;

        lookAtRetorno.x = lookAt.x;
        lookAtRetorno.y = lookAt.y;
        lookAtRetorno.z = lookAt.z;

        var inicio = {x: camara.position.x, y: camara.position.y, z: camara.position.z};
        var final = {x: x, y: y, z: z + 2};
        var that = this;
        var tween = new TWEEN.Tween(inicio)
                .to(final, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(function() {
                    camara.position.x = inicio.x;
                    camara.position.y = inicio.y;
                    camara.position.z = inicio.z;
                }).onComplete(function() {
            estado = ESTADO.PARADO;
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
        //if (contadorReloj < 5) {
        estado = ESTADO.SUELTA;
        inercia.x = desplazamiento.x;
        inercia.y = desplazamiento.y;
        desplazamiento.x = desplazamiento.y = 0;
        //}

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

    ControlesMapa.prototype.movimientoValido = function() {

        var sup = lookAt.x >= 1;
        var inf = lookAt.x <= Vista.Mapa.X - 1;
        var izq = lookAt.z >= 1;
        var der = lookAt.z <= Vista.Mapa.Y + 1;
        return sup && inf && der && izq && 
                camara.position.y >= this.distanciaMin &&
                camara.position.y <= this.distanciaMax;

    };

    ControlesMapa.prototype.distancia = function(a, b) {
        var x = Math.pow(a.x - b.x, 2);
        var y = Math.pow(a.y - b.y, 2);
        var z = Math.pow(a.z - b.z, 2);
        return Math.sqrt(x + y + z);
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



