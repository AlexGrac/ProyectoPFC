/*
 * @author: Alejandro Graciano Segura
 * 
 * Clase que representa una transformación de coordenadas entre la 
 * proyección WGS84 y coordenadas normalizadas del mapa.
 */

package modelo;

/**
 *
 * @author Graciano
 */
public class CoordenadasWGS84 {
       
    final static double LON_MIN = -9.4892611;
    final static double LAT_MIN = 43.9434760;
    final static double LON_MAX = 4.8776323;
    final static double LAT_MAX = 34.8539025;
    

    double _x;
    double _y;
    // Se deben recibir coordenadas normalizadas [0,1]
    public CoordenadasWGS84(double x, double y){
        _x = x;
        _y = y;

        
    }

    public double getX() {
        return _x;
    }

    public double getY() {
        return _y;
    }

    public double getLongitud() {
        return _x * (LON_MAX - LON_MIN) + LON_MIN;
    }

    public double getLatitud() {
        return _y * (LAT_MAX - LAT_MIN) + LAT_MIN;
    }

    public void setX(double x) {
        this._x = x;
    }

    public void setY(double y) {
        this._y = y;
    } 
    
    static public double normalizaLongitud(double longitud){
        return (longitud - LON_MIN) / (LON_MAX - LON_MIN);
    }

    static public double normalizaLatitud(double latitud){
        return (latitud - LAT_MIN) / (LAT_MAX - LAT_MIN);
    }
}
