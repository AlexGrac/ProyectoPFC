/*
 * @author: Alejandro Graciano Segura
 * 
 * Objeto que representa el patrón observador (observable)
 * 
 */

Observable = function(){
    this._observadores = [];
};

// Se anade un nuevo observador al vector
Observable.prototype.anadeObservador = function(evento, observador, callback){
    var obsConcretos = this._observadores[evento];
    if (obsConcretos){
        if (this.buscaObservador(obsConcretos, observador) !== -1){
            // Evitamos duplicados
            return;
        }
    }else{
        // Creamos un nuevo tipo de evento
        obsConcretos = [];
        this._observadores[evento] = obsConcretos;
    }
    // Introducimos un objeto con el observador y su callback
    obsConcretos.push({observador:observador, callback:callback});
};

// Se elimina un observador del vector o un tipo completo de eventos
Observable.prototype.eliminaObservador = function(evento, observador, callback){
    if (observador){
        var obsConcretos = this._observadores[evento];
        
        if (obsConcretos){
            var indice = this.buscaObservador(obsConcretos, observador, callback);
            if (indice !== -1){
                // Eliminamos el observador concreto
                this._observadores[evento].splice(indice,1);
            }
        }
    }else{
        // Eliminamos el tipo completo de evento
        delete this._observadores[evento];
    }
};

// Se notifican a los observadores del evento, todos los argumentos son pasados después del evento
// aunque no se definan explicitamente. Accedemos con el objeto arguments[]. WTF Javascript!
Observable.prototype.notifica = function(evento){
    var obsConcretos = this._observadores[evento];
    
    if (obsConcretos){
        for (var i=0; i<obsConcretos.length; ++i){
            var parametros = [];
            
            for (var j=0; j<arguments.length-1; ++j){
                parametros.push(arguments[j + 1]);
            }
            // Notificamos al callback
            obsConcretos[i].callback.apply(obsConcretos[i].observador, parametros);
        }
    }
};

// Metodo auxiliar para buscar un observador concreto
Observable.prototype.buscaObservador = function(obsConcretos, observador){
    for(var i=0; i<obsConcretos.length; ++i){
        if (obsConcretos[i] === observador){
            return i;
        }
    }
    return -1;
};
