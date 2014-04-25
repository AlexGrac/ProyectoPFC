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
public class CoordenadasWGS84 {
       
    double _longitud;
    double _latitud;
    
    public CoordenadasWGS84(double longitud, double latitud){
        _longitud = longitud;
        _latitud = latitud;
    }

    public double getLongitud() {
        return _longitud;
    }

    public double getLatitud() {
        return _latitud;
    }

    public void setLongitud(double _longitud) {
        this._longitud = _longitud;
    }

    public void setLatitud(double _latitud) {
        this._latitud = _latitud;
    }
}
