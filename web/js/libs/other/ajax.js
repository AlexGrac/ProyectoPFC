/* 
 * 
 * 
 * 
 * 
 */

/* Espacio de nombres */
var ajax = [];

/* Declaración de costantes */
ajax.READY_STATE_UNINITIALIZED = 0;
ajax.READY_STATE_LOADING = 1;
ajax.READY_STATE_LOADED = 2;
ajax.READY_STATE_INTERACTIVE = 3;
ajax.READY_STATE_COMPLETE = 4;

/* Clase que encapsula la peticion Ajax */
ajax.PeticionAjax = function(url, onload, onerror, metodo, params, tipoCont) {
    this.peticion = null;
    this.onload = onload;
    this.onerror = (onerror) ? onerror : this.errorDefecto;
    this.realizaPeticion(url, metodo, params, tipoCont);
};


ajax.PeticionAjax.prototype.realizaPeticion = function(url, metodo, params, tipoCont) {
    if (!metodo) {
        metodo = "GET";
    }
    if (!tipoCont && metodo === "POST") {
        tipoCont = "application/x-www-form-urlencoded";
    }

    // Diferenciamos entre IE y el resto de navegadores
    if (window.XMLHTTPRequest) {
        this.peticion = new XMLHTTPRequest();
    } else if (window.ActiveXObject) {
        this.peticion = new ActiveXObject("Micrososft.XMLHTTP");
    }

    // Realizamos la peticion
    if (this.peticion) {
        try {
            var peticionAjax = this;
            this.peticion.onreadystatechange = function() {
                ajax.PeticionAjax.estadoPreparado.call(peticionAjax);
            };
            this.peticion.open(metodo, url, true);
            if (tipoCont) {
                this.peticion.setRequestHeader('Content-Type', tipoCont);
            }
            this.peticion.send(params);
        } catch (error) {
            this.onerror.call(this);
        }
    }
};


ajax.PeticionAjax.estadoPreparado = function() {
    var peticion = this.peticion;
    var preparado = peticion.readyState;
    var estadoHTTP = peticion.status;
    if (preparado === ajax.READY_STATE_COMPLETE) {
        if (estadoHTTP === 200 || estadoHTTP === 0) {
            this.onload.call(this);
        } else {
            this.onerror.call(this);
        }
    }
};
