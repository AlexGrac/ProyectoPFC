THREE.TerrainLoader = function ( manager ) {
        
        /*Un loadingManager maneja y realiza un seguimiento de los datos pendiente de descarga*/
        this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.TerrainLoader.prototype = {

        constructor: THREE.TerrainLoader,

        load: function ( url, onLoad, onProgress, onError ) {
                var scope = this;
                /* XMLHttpRequest es una interfaz empleada para realizar peticiones HTTP y HTTPS a servidores Web.
                 * Se puede usar cualquier codificación; XML, JSON, texto plano, HTML o en nuestro caso, binarios*/
                var request = new XMLHttpRequest();

                
                if ( onLoad !== undefined ) {
                        /* Cuando cargue la página ejecutamos la función pasada como parámetro creando un array de enteros
                         * con precisión de 16 bits */
                        request.addEventListener( 'load', function ( event ) {

                                onLoad( new Uint16Array( event.target.response ) );
                                
                                scope.manager.itemEnd( url );

                        }, false );

                }

                if ( onProgress !== undefined ) {

                        request.addEventListener( 'progress', function ( event ) {

                                onProgress( event );

                        }, false );

                }

                if ( onError !== undefined ) {

                        request.addEventListener( 'error', function ( event ) {

                                onError( event );

                        }, false );

                }

                if ( this.crossOrigin !== undefined ) request.crossOrigin = this.crossOrigin;
                
                /* Abrimos el fichero por get */
                request.open( 'GET', url, true );
                
                /* El tipo de la respuesta es un array */
                request.responseType = 'arraybuffer';

                request.send( null );

                scope.manager.itemStart( url );

        },

        setCrossOrigin: function ( value ) {

                this.crossOrigin = value;

        }

};