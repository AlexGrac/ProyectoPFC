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

ControlesMapa2 = function(camara, lookAt, dom) {

    var READY_STATE_UNINITIALIZED = 0;
    var READY_STATE_LOADING = 1;
    var READY_STATE_LOADED = 2;
    var READY_STATE_INTERACTIVE = 3;
    var READY_STATE_COMPLETE = 4;

    var RATON = {DERECHA: 0};
    var ESTADO = {NADA: 0, ARRASTRA: 1, SUELTA: 2, SCROOL: 3, MOVIMIENTO: 4};
    var CERO = 10e-8;
    var camara = camara;
    this.dom = (dom !== undefined) ? dom : document;
    var estado = ESTADO.NADA;
    var peticion;


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


        switch (estado) {
            case ESTADO.ARRASTRA:
                var factor = y > 1 ? y : 1;

                camara.position.set(x - desplazamiento.x, y, z - desplazamiento.y);
                lookAt.set(lx - desplazamiento.x, ly, lz - desplazamiento.y);
                estado = ESTADO.NADA;
                break;
            case ESTADO.SCROOL:

                camara.position.x += zoom * (lx - x) / 20;
                camara.position.y += zoom * (ly - y) / 20;
                camara.position.z += zoom * (lz - z) / 20;

                estado = ESTADO.NADA;
                break;
            case ESTADO.SUELTA:
                var factor = 1.01;

                camara.position.set(x - inercia.x, y, z - inercia.y);
                lookAt.set(lx - inercia.x, ly, lz - inercia.y);

                inercia.x /= factor;
                inercia.y /= factor;

                if (Math.abs(inercia.x) <= CERO && Math.abs(inercia.y) <= CERO)
                    estado = ESTADO.NADA;

                break;
        }


    };



    //listeners

    function pulsaRaton(evento) {

        a = proyectaPulsacion(evento.clientX, evento.clientY);
        console.log(evento.clientX + ", " + evento.clientY);
        document.addEventListener('mousemove', mueveRaton, false);
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
        if (estado !== ESTADO.NADA) {
            estado = ESTADO.SUELTA;
            inercia.x = desplazamiento.x;
            inercia.y = desplazamiento.y;
            desplazamiento.x = desplazamiento.y = 0;
        }

        document.body.style.cursor = 'default';
        document.removeEventListener('mousemove', mueveRaton);
    }
    ;


    function scrollRaton(evento) {
        estado = ESTADO.SCROOL;
        zoom = ((typeof evento.wheelDelta !== "undefined") ? (-evento.wheelDelta) : evento.detail);
        zoom = ((zoom < 0) ? 1 : -1);
    }

    function doblePulsacion(evento) {
        estado = ESTADO.SCROOL;
        zoom = 5;
    }

    function proyectaPulsacion(x, y) {
        var vector = new THREE.Vector3(x / alto * 2 - 1, -y / ancho * 2 + 1, 0.5);
        var proyector = new THREE.Projector();
        var rayo = new THREE.Raycaster();

        rayo = proyector.pickingRay(vector, camara);
        return rayo.ray.intersectPlane(plano);
    }

    function getVentanaVision() {
        var a, b, c, d;

        a = proyectaPulsacion(0, 0);
        b = proyectaPulsacion(alto, 0);
        c = proyectaPulsacion(0, ancho);
        d = proyectaPulsacion(alto, ancho);

        var ventana = [a, b, c, d];

        return ventana;

    }

    //Codigo AJAX

    function peticionAJAX() {
        var coordenadas = getVentanaVision();
        /*var json = {
         mundo0:{x:0,y:0},
         mundo1:{x:133,y:76},
         ventana:[]};*/
        var json = {ventana: []};
        var ventana = [];

        for (var i = 0; i < coordenadas.length; ++i) {
            ventana.push({
                x: coordenadas[i].x / 133, //Deberia haber alguna variable tamanoMapa
                y: coordenadas[i].z / 76
            });

            //console.log(coordenadas[i].x + ", " + coordenadas[i].z);
        }

        json.ventana = ventana;

        var url = "/ProyectoPFC/response";

        if (window.XMLHttpRequest) {
            peticion = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            peticion = new ActiveXObject("Microsoft.XMLHTTP");
        }
        peticion.open("Post", url, true);
        peticion.setRequestHeader('Content-Type', 'applicaction/json');
        peticion.onreadystatechange = respuestaAJAX;

        peticion.send(JSON.stringify(json));

    }

    function respuestaAJAX() {
        if (peticion.readyState === READY_STATE_COMPLETE) {
            if (peticion.status === 200) {
                parseaRespuesta();
            }
        }
    }


    function parseaRespuesta() {

        var municipiosJSON = JSON.parse(peticion.responseText);
        
        mun = municipiosJSON.municipios;
    }

    document.addEventListener('mousedown', pulsaRaton, false);
    document.addEventListener('mouseup', sueltaRaton, false);
    //document.addEventListener('mouseup', peticionAJAX, false);
    document.addEventListener('mousewheel', scrollRaton, false);
    document.addEventListener('DOMMouseScroll', scrollRaton, false); // firefox
    //document.addEventListener('mousewheel', peticionAJAX, false);
    //document.addEventListener('DOMMouseScroll', peticionAJAX, false); // firefox
    document.addEventListener('dblclick', doblePulsacion, false);

};



