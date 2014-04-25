/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package modelo;

/**
 *
 * @author Graciano
 */
public class Municipio {
    String _nombre;
    double _longitud;
    double _latitud;
    int _poblacion;

    public Municipio(String _nombre, double _longitud, double _latitud, int _poblacion) {
        this._nombre = _nombre;
        this._longitud = _longitud;
        this._latitud = _latitud;
        this._poblacion = _poblacion;
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
    
    
}
