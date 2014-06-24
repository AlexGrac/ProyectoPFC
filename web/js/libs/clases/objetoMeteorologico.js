
/*
 * @author: Alejandro Graciano Segura
 * 
 * Objetos que representan los iconos atmosféricos
 * 
 */


/*
 * Clase que representa el icono de Sol
 */
Sol = function(vector) {
    this._posicion = vector;
    this._geometria = null;
    this._sprite = null;
    FwWebGL.Objeto.call(this);
};

Sol.prototype = new FwWebGL.Objeto();


Sol.prototype.inicia = function(aplicacion) {

    var geometriaEsfera = new THREE.SphereGeometry(1, 32, 32);
    var materialEsfera = new THREE.MeshBasicMaterial({color: 0xffff9c});
    var mallaEsfera = new THREE.Mesh(geometriaEsfera, materialEsfera);
    //mallaEsfera.position.set(this._posicion);
    var spriteMaterial = new THREE.SpriteMaterial(
            {
                map: ContenedorTexturas.sol,
                useScreenCoordinates: false,
                alignment: THREE.SpriteAlignment.center,
                color: 0xcccc00,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

    this._sprite = new THREE.Sprite(spriteMaterial);
    this._sprite.scale.set(4, 4, 1);
    mallaEsfera.add(this._sprite); // this centers the glow at the mesh
    mallaEsfera.position.x = this._posicion.x;
    mallaEsfera.position.y = this._posicion.y;
    mallaEsfera.position.z = this._posicion.z;
    this._geometria = mallaEsfera;

    this.setObjeto3D(this._geometria);

};

Sol.prototype.escala = function(x, y, z) {
    this._geometria.scale.set(x / 3, y / 3, z / 3);
    this._sprite.scale.set(x * 1.3, y * 1.3, 1);
    this._geometria.position.x = this._posicion.x + x / 2;
};

Sol.prototype.actualiza = function() {
    //alert("actualiza");
};


/*
 * Clase que representa el icono de Nube
 */
Nube = function(vector, color, rangoX, rangoY, tamano, blending) {
    this._posicion = vector;
    this._color = color;
    this._rangoX = rangoX;
    this._rangoY = rangoY;
    this._tamano = tamano;
    this._blending = blending;
    this._geometria = null;
    this._material = null;
    FwWebGL.Objeto.call(this);
};

Nube.prototype = new FwWebGL.Objeto();

Nube.prototype.inicia = function(aplicacion) {
    this._material = new THREE.ParticleBasicMaterial({
        size: this._tamano,
        transparent: true,
        opacity: 0.6,
        map: ContenedorTexturas.nube,
        blending: this._blending,
        sizeAttenuation: true,
        depthWrite: false,
        color: this._color
    });

    var particulas = new THREE.Geometry();
    for (var i = 0; i < 10; i++) {
        var particula = new THREE.Vector3(
                Math.random() * this._rangoX - this._rangoX / 2,
                Math.random() * this._rangoX - this._rangoX / 2,
                Math.random() * this._rangoY - this._rangoY / 2);
        particulas.vertices.push(particula);
    }

    var sistemaParticulas = new THREE.ParticleSystem(particulas, this._material);
    sistemaParticulas.sortParticles = true;
    sistemaParticulas.position.x = this._posicion.x;
    sistemaParticulas.position.y = this._posicion.y;
    sistemaParticulas.position.z = this._posicion.z;

    this._geometria = sistemaParticulas;
    this.setObjeto3D(this._geometria);
};

Nube.prototype.escala = function(x, y, z) {
    this._geometria.scale.set(x, y, z);
    this._material.size = this._tamano * x * 2;
    this._geometria.position.x = this._posicion.x + x / 2;
};

Nube.prototype.actualiza = function() {

};


/*
 * Clase que representa el icono de Lluvia
 */
Lluvia = function(vector, color, rangoX, rangoY, tamano, blending, gotas) {
    this._nube = new Nube(vector, color, rangoX, rangoX / 2, tamano, blending);
    this._rangoX = rangoX;
    this._rangoY = rangoY;
    this._gotas = gotas;
    this._posicion = vector;
    this._geometria = new THREE.Mesh();
    this._material = null;
    this._sistemaParticulas = null;
    FwWebGL.Objeto.call(this);
};

Lluvia.prototype = new FwWebGL.Objeto();

Lluvia.prototype.inicia = function(aplicacion) {

    this._nube.inicia(aplicacion);
    var texture = ContenedorTexturas.lluvia;
    var geometriaParticulas = new THREE.Geometry();

    this._material = new THREE.ParticleBasicMaterial({
        size: 0.5,
        transparent: true,
        opacity: 0.7,
        map: texture,
        blending: THREE.NormalBlending,
        sizeAttenuation: true,
        color: 0xebf4ff,
        depthWrite: false
    });

    var rangoLluvia = this._rangoX + 4;
    for (var i = 0; i < this._gotas * 100; i++) {
        var particula = new THREE.Vector3(
                Math.random() * rangoLluvia,
                //(Math.random() * this._rangoY - this._rangoY / 2),
                Math.random() * -this._rangoY,
                Math.random() * rangoLluvia);

        particula.velocidadY = 0.10;
        geometriaParticulas.vertices.push(particula);
    }


    this._sistemaParticulas = new THREE.ParticleSystem(geometriaParticulas, this._material);
    this._sistemaParticulas.position.x = this._posicion.x;
    this._sistemaParticulas.position.y = this._posicion.y;
    this._sistemaParticulas.position.z = this._posicion.z;
    this._sistemaParticulas.sortParticles = true;


    //this._nube._geometria.add(this._sistemaParticulas);

    this._geometria.add(this._nube._geometria);
    this._geometria.add(this._sistemaParticulas);
    this._geometria.position.set(0, 1.5, 0);

    this.setObjeto3D(this._geometria);
};

Lluvia.prototype.escala = function(x, y, z) {
    this._nube.escala(x, y, z);
    this._sistemaParticulas.scale.set(x / 5, y / 5, z / 5);
    this._material.size = x / 5;
    //this._sistemaParticulas.position.x = this._posicion.x + x / 2;
};

Lluvia.prototype.actualiza = function() {
    var gotas = this._sistemaParticulas.geometry.vertices;
    var that = this;
    gotas.forEach(function(v) {
        v.y -= (v.velocidadY);

        if (v.y < -that._rangoY) {
            //v.y = (Math.random() * that._rangoY - that._rangoY / 2) - that._rangoX * 10;
            v.y = Math.random() * -that._rangoY;
        }
    });

};


/*
 * Clase que representa el icono de Claros y nubes
 */
ClarosNubes = function(vector, color, rangoX, rangoY, tamano, blending) {
    this._nube = new Nube(vector, color, rangoX, rangoY, tamano, blending);
    this._sol = new Sol(vector);
    this._geometria = new THREE.Mesh();
    FwWebGL.Objeto.call(this);
};

ClarosNubes.prototype = new FwWebGL.Objeto();

ClarosNubes.prototype.inicia = function(aplicacion) {

    this._sol.inicia(aplicacion);
    this._nube.inicia(aplicacion);
    this._geometria.add(this._sol._geometria);
    this._geometria.add(this._nube._geometria);

    this.setObjeto3D(this._geometria);
};

ClarosNubes.prototype.escala = function(x, y, z) {
    this._sol.escala(x, y, z);
    this._nube.escala(x, y, z);
};

ClarosNubes.prototype.actualiza = function() {

};

/*
 * Clase que representa el icono de Lluvia
 */


Nieve = function(vector, color, rangoX, rangoY, tamano, blending, copos) {
    this._nube = new Nube(vector, color, rangoX, rangoX / 2, tamano, blending);
    this._rangoX = rangoX;
    this._rangoY = rangoY;
    this._rangoNieve = rangoY;
    this._copos = copos;
    this._posicion = vector;
    this._geometria = new THREE.Mesh();
    this._material = null;
    this._sistemaParticulas = null;
    FwWebGL.Objeto.call(this);
};

Nieve.prototype = new FwWebGL.Objeto();

Nieve.prototype.inicia = function(aplicacion) {

    this._nube.inicia(aplicacion);
    var texture = ContenedorTexturas.nieve;
    var geometriaParticulas = new THREE.Geometry();

    this._material = new THREE.ParticleBasicMaterial({
        size: 0.5,
        transparent: true,
        opacity: 0.7,
        map: texture,
        blending: THREE.NormalBlending,
        sizeAttenuation: true,
        //color: 0xebf4ff,
        depthWrite: false
    });

    for (var i = 0; i < this._copos * 100; i++) {
        var particula = new THREE.Vector3(
                Math.random() * this._rangoNieve,
                //(Math.random() * this._rangoY - this._rangoY / 2),
                Math.random() * -this._rangoY,
                Math.random() * this._rangoNieve);

        particula.velocidadY = 0.05;
        var rand = Math.random() > 0.5 ? -1 : 1;
        particula.velocidadX = (Math.random() / 50) * rand;
        geometriaParticulas.vertices.push(particula);
    }


    this._sistemaParticulas = new THREE.ParticleSystem(geometriaParticulas, this._material);
    this._sistemaParticulas.position.x = this._posicion.x;
    this._sistemaParticulas.position.y = this._posicion.y;
    this._sistemaParticulas.position.z = this._posicion.z;
    this._sistemaParticulas.sortParticles = true;


    //this._nube._geometria.add(this._sistemaParticulas);

    this._geometria.add(this._nube._geometria);
    this._geometria.add(this._sistemaParticulas);
    this._geometria.position.set(0, 1.5, 0);

    this.setObjeto3D(this._geometria);
};

Nieve.prototype.escala = function(x, y, z) {
    this._nube.escala(x, y, z);
    this._sistemaParticulas.scale.set(x / 5, y / 5, z / 5);
    this._material.size = x / 5;
    //this._sistemaParticulas.position.x = this._posicion.x + x / 2;
};

Nieve.prototype.actualiza = function() {
    var copos = this._sistemaParticulas.geometry.vertices;
    var that = this;
    copos.forEach(function(v) {
        v.y -= (v.velocidadY);
        v.x -= (v.velocidadX);

        if (v.y < -that._rangoY) {
            v.x = Math.random() * that._rangoNieve;
            v.y = Math.random() * -that._rangoY;
            v.z = Math.random() * that._rangoNieve;
        }

    });

};




Tormenta = function(vector, color, rangoX, tamano, blending) {
    this._nube = new Nube(vector, color, rangoX, rangoX, tamano, blending);
    this._rangoX = rangoX;
    this._posicion = vector;
    this._blending = blending;
    this._malla = null;
    this._geometria = new THREE.Mesh();
    this._material = null;
    this._texturas = ContenedorTexturas.tormenta;
    this._indiceTextura = Math.floor(Math.random() * this._texturas.length);
    FwWebGL.Objeto.call(this);
};

Tormenta.prototype = new FwWebGL.Objeto();

Tormenta.prototype.inicia = function(aplicacion) {
    
    this._nube.inicia(aplicacion);
    this._material = new THREE.MeshBasicMaterial({
        depthWrite: false,
        map: this._texturas[this._indiceTextura],
        color: 0xffff00,
        transparent: true,
        blending: this._blending});

    var plano = new THREE.PlaneGeometry(10, 10);
    this._malla = new THREE.Mesh(plano, this._material);
    //this._malla.scale.set(0.3, 0.3, 0.3);
    this._malla.rotation.x = -Math.PI / 3;
    this._malla.position.x = this._posicion.x;
    this._malla.position.y = this._posicion.y - 2;
    this._malla.position.z = this._posicion.z + 3;

    

    //nube.geometria.position.z = 5;


    this._geometria.add(this._malla);
    this._geometria.add(this._nube._geometria);

    this.setObjeto3D(this._geometria);
};



Tormenta.prototype.actualiza = function() {
    this._material.opacity = this._material.opacity >= 1 ? 0 : this._material.opacity + 0.02;
    if (this._material.opacity === 0) {
        this._material.map = this._texturas[this._indiceTextura++ % this._texturas.length];
    }

};


Tormenta.prototype.escala = function(x, y, z) {
    this._nube.escala(x, y, z);
    this._malla.scale.set(x/4, y/4, 1.0);
    this._malla.position.x = this._posicion.x + x / 2;
    this._malla.position.z = this._posicion.z + z * 1.25;
};
