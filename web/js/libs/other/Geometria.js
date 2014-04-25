/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Geometria = function(camara) {
    
    var plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    
this.proyectaPulsacion = function(x, y) {
    var vector = new THREE.Vector3(x / this.alto * 2 - 1, -y / this.ancho * 2 + 1, 0.5);
    var proyector = new THREE.Projector();
    var rayo = new THREE.Raycaster();

    rayo = proyector.pickingRay(vector, camara);
    return rayo.ray.intersectPlane(plano);
};

this.getVentanaVision = function() {
    var a, b, c, d;

    a = proyectaPulsacion(0, 0);
    b = proyectaPulsacion(0, this.ancho);
    c = proyectaPulsacion(this.alto, 0);
    d = proyectaPulsacion(this.alto, this.ancho);

    var ventana = [a, b, c, d];

    return ventana;

};


};

this.alto = window.outerHeight;
this.ancho = window.outerWidth;
this.CERO = 10e-8;

