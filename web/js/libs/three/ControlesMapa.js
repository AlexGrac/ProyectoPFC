

ControlesMapa = function(camara, lookAt, dom) {

    var RATON = {DERECHA: 0};
    var ESTADO = {NADA: 0, MOVIMIENTO: 1, SUELTA: 2, SCROOL: 3, PULSADO: 4 };
    this.camara = camara;
    this.dom = (dom !== undefined) ? dom : document;
    var estado = ESTADO.NADA;

    var a = new THREE.Vector2();
    var b = new THREE.Vector2();
    var desplazamiento = new THREE.Vector2();
    var inercia = new THREE.Vector2();
    var zoom = 1;
    var incr = 0.2;
    this.lookAt = lookAt;
    
    
    this.actualiza = function() {

        var x = this.camara.position.x;
        var y = this.camara.position.y;
        var z = this.camara.position.z;

        var lx = this.lookAt.x;
        var ly = this.lookAt.y;
        var lz = this.lookAt.z;

        
        switch (estado) {
            case ESTADO.MOVIMIENTO:
                var factor = y > 1 ? y : 1;
                this.camara.position.set(x - (desplazamiento.x) / 200 * factor, y, z - (desplazamiento.y) / 200 * factor);
                this.lookAt.set(lx - (desplazamiento.x) / 200 * factor, ly, lz - (desplazamiento.y) / 200 * factor);
                
                estado = ESTADO.NADA;
                break;
            case ESTADO.SCROOL:
                camara.position.x += zoom * (lx - x) / 20;
                camara.position.y += zoom * (ly - y) / 20;
                camara.position.z += zoom * (lz - z) / 20;
                
                estado = ESTADO.NADA;
                break;
            case ESTADO.SUELTA:
                var factor = y > 1 ? y : 1;
                
                this.camara.position.set(x - inercia.x / 200 * factor, y, z - inercia.y / 200 * factor);
                this.lookAt.set(lx - inercia.x / 200 * factor, ly, lz - inercia.y / 200 * factor);
                
                if (inercia.x > 0)
                    inercia.x--;
                else if (inercia.x < 0 )
                    inercia.x++;
                
                if (inercia.y > 0)
                    inercia.y--;
                else if (inercia.y < 0 )
                    inercia.y++;
                
                if (inercia.x === 0 && inercia.y === 0)
                    estado = ESTADO.NADA;               
                
                break;
        }

        
    };


    //listeners
    function pulsaRaton(evento) {
        estado = ESTADO.PULSADO;
        a.x = evento.clientX;
        a.y = evento.clientY;
        document.addEventListener('mousemove', mueveRaton, false);
    }
    ;

    function sueltaRaton(evento) {
        estado = ESTADO.SUELTA;
        inercia.x = desplazamiento.x;
        inercia.y = desplazamiento.y;
        desplazamiento.x = desplazamiento.y = 0;
        document.removeEventListener('mousemove', mueveRaton);

    }
    ;

    function mueveRaton(evento) {
        estado = ESTADO.MOVIMIENTO;
        if (evento.button === RATON.DERECHA) {
            b.x = evento.clientX;
            b.y = evento.clientY;
            desplazamiento.x = b.x - a.x;
            desplazamiento.y = b.y - a.y;
            a.x = b.x;
            a.y = b.y;

        }

    }
    ;

    function scrollRaton(evento) {
        estado = ESTADO.SCROOL;
        zoom = ((typeof evento.wheelDelta !== "undefined") ? (-evento.wheelDelta) : evento.detail);
        zoom = ((zoom < 0) ? 1 : -1);
        //console.log(evento.wheelDelta + ", " + evento.detail );
    }

    function desplazaRaton(evento) {
        
    }


    document.addEventListener('mousedown', pulsaRaton, false);
    document.addEventListener('mouseup', sueltaRaton, false);
    document.addEventListener('mousewheel', scrollRaton, false);
    document.addEventListener('mousemove', desplazaRaton, false);
    document.addEventListener('DOMMouseScroll', scrollRaton, false); // firefox

};

ControlesMapa.prototype = THREE.EventDispatcher.prototype;


