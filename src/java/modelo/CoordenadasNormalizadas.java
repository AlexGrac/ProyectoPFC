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
public class CoordenadasNormalizadas {
    double _x;
    double _y;
    
    public CoordenadasNormalizadas(double x, double y){
        _x = x;
        _y = y;
    }

    public double getX() {
        return _x;
    }

    public double getY() {
        return _y;
    }

    public void setX(double x) {
        _x = x;
    }

    public void setY(double y) {
        _y = y;
    }
    
    /* 
    Convierte coordenadas del mundo a coordenadas geográficas
    */

}
