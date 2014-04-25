/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Mapa = function(rutaDEM, material) {

    
    var terrainLoader = new THREE.TerrainLoader();
    this.plano;
    var malla;
    var geometry;


    terrainLoader.load(rutaDEM, function(data) {
        //var geometry = new THREE.PlaneGeometry(144, 103, 520, 372);//GDEMJaen
        //var geometry = new THREE.PlaneGeometry(60, 60, 199, 199);//JaenDEM
        geometry = new THREE.PlaneGeometry(133, 76, 591, 365);//GDEMEspana
        //var geometry = new THREE.PlaneGeometry(116, 96, 393, 243);//GDEMEspana30
        for (var i = 0; i < geometry.vertices.length; i++) {
            geometry.vertices[i].z = data[i] / 65535 * 1.5;
        }

        var malla = new THREE.Mesh(geometry, material);
        malla.position.x = 66;
        malla.position.z = 38;
        malla.y = -0.5;
        malla.x = -Math.PI / 2;
        this.plano = malla;

    });
    
    
    this.render = function(escena){
        alert(malla);
        escena.add(this.plano);
    };

    this.actualiza = function() {

    };


    //listeners


    /*document.addEventListener('mouseup', sueltaRaton, false);
    document.addEventListener('mousewheel', scrollRaton, false);
    document.addEventListener('DOMMouseScroll', scrollRaton, false);*/ // firefox

};