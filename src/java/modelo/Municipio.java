/*
 * @author: Alejandro Graciano Segura
 * 
 * Clase que encapsula la información de un municipio.
 */

package modelo;

import modelo.spi.DetallesMeteorologicos;

/**
 *
 * @author Graciano
 */
public class Municipio {
    String _nombre;
    double _longitud;
    double _latitud;
    int _poblacion;
    DetallesMeteorologicos _detalles;

    public Municipio(String _nombre, double _longitud, double _latitud, int _poblacion, DetallesMeteorologicos _detalles) {
        this._nombre = _nombre;
        this._longitud = _longitud;
        this._latitud = _latitud;
        this._poblacion = _poblacion;
        this._detalles = _detalles;
    }

    public String getNombre() {
        return _nombre;
    }

    public double getLongitud() {
        return _longitud;
    }

    public double getLatitud() {
        return _latitud;
    }

    public int getPoblacion() {
        return _poblacion;
    }
    
    public DetallesMeteorologicos getDetalles(){
        return _detalles;
    }

    public void setNombre(String _nombre) {
        this._nombre = _nombre;
    }

    public void setLongitud(double _longitud) {
        this._longitud = _longitud;
    }

    public void setLatitud(double _latitud) {
        this._latitud = _latitud;
    }

    public void setPoblacion(int _poblacion) {
        this._poblacion = _poblacion;
    }
    
    public void setDetalles(DetallesMeteorologicos detalles){
        this._detalles = detalles;
    }
    
    public boolean tieneDetalles(){
        return !(this._detalles == null);
    }
    
    /*@Override
    public String toString(){
        return this._nombre;
    }*/
    
}
