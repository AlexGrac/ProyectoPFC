/* 
 * Paquete aplicacion
 */

Aplicacion = function() {

    FwWebGL.Aplicacion.call(this);

    var modelo = new Modelo();
    var controlador = new Controlador(modelo);
    var vista = new Vista(modelo, controlador);

};

//Heredamos de la aplicacion generica
Aplicacion.prototype = new FwWebGL.Aplicacion;

//Nuestro inicializador de la aplicacion    
Aplicacion.prototype.inicia = function(parametros) {
    //Iniciamos la escena generica
    FwWebGL.Aplicacion.prototype.inicia.call(this, parametros);

    //Creamos nuestra escena

    this.camara.position.set(0, 10, 5);
    this.camara.lookAt(this.escena.position);
    var mapa = new Mapa();
    mapa.inicia(this);
    //this.anadeObjeto(mapa);

    var controles = new ControlesMapa2(this.camara, this.escena.position);
    this.controles = controles;

};


Aplicacion.prototype.actualiza = function() {
    //Actualizar controles
    this.controles.actualiza();
    FwWebGL.Aplicacion.prototype.actualiza.call(this);
};


Mapa = function() {

    FwWebGL.Objeto.call(this);

};

Mapa.prototype = new FwWebGL.Objeto();

Mapa.prototype.inicia = function(aplicacion) {
    /*var materialEsfera = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe:true});
     
     var geometriaEsfera = new THREE.SphereGeometry(1, 32, 32);
     
     var texture = THREE.ImageUtils.loadTexture("earth_surface_2048.jpg");
     var material = new THREE.MeshBasicMaterial( { map: texture } );
     var mesh = new THREE.Mesh( geometriaEsfera, materialEsfera ); 
     
     
     this.setObjeto3D(mesh);*/

    var terrainLoader = new THREE.TerrainLoader();
    //var escena = this.escena;
    var that = this;
    /*terrainLoader.load('data/DEMEspana2.bin', function(data) {
     
     //var geometry = new THREE.PlaneGeometry(144, 103, 520, 372);//GDEMJaen
     //var geometry = new THREE.PlaneGeometry(60, 60, 199, 199);//JaenDEM
     var geometry = new THREE.PlaneGeometry(133, 76, 591, 365);//GDEMEspana
     //var geometry = new THREE.PlaneGeometry(116, 96, 393, 243);//GDEMEspana30
     for (var i = 0; i < geometry.vertices.length; i++) {
     geometry.vertices[i].z = data[i] / 65535 * 1.5;
     }
     
     var material1 = new THREE.MeshPhongMaterial({
     map: THREE.ImageUtils.loadTexture('data/JaenTexturaSintetica30.jpg')
     });
     
     var material2 = new THREE.MeshPhongMaterial({
     map: THREE.ImageUtils.loadTexture('data/espanaWGS84.jpg')
     });
     
     var material = new THREE.MeshBasicMaterial({
     color: 0xdddddd,
     wireframe: true
     });
     
     var material3 = new THREE.MeshLambertMaterial({
     color: 0xaaaaaa
     });
     
     var plane = new THREE.Mesh(geometry, material2);
     //plane.position.x = 66;
     //plane.position.z = 38;
     plane.position.y = -0.5;
     plane.rotation.x = -Math.PI / 2;
     that.setObjeto3D(plane);
     aplicacion.anadeObjeto(that);
     
     });*/
    var textura = new THREE.Texture();
    var loader = new THREE.ImageLoader();
    loader.load('data/mapaWGS84Alpha.png', function(image) {

        textura.image = image;
        textura.needsUpdate = true;

    });

    var materialMapa = new THREE.MeshPhongMaterial({
        map: textura,
        transparent: true
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

Mapa.prototype.actualiza = function() {
    //console.log(this.objeto3D.geometry.vertices.length);
};