/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package modelo;

/**
 *
 * @author Graciano
 * @param <Key>
 */
public class Ventana<Key extends Comparable> {
    Key _xMin;
    Key _xMax;
    Key _yMin;
    Key _yMax;

    public Ventana(Key _xMin, Key _xMax, Key _yMin, Key _yMax) {
        this._xMin = _xMin;
        this._xMax = _xMax;
        this._yMin = _yMin;
        this._yMax = _yMax;
    }

    public Key getxMin() {
        return _xMin;
    }

    public Key getxMax() {
        return _xMax;
    }

    public Key getyMin() {
        return _yMin;
    }

    public Key getyMax() {
        return _yMax;
    }
    
    public boolean contiene(Key x, Key y){
        
        return (_xMin.compareTo(x) <= 0 && 
                _xMax.compareTo(x) >= 0 && 
                _yMin.compareTo(y) <= 0 && 
                _yMax.compareTo(y) >= 0);
    }
    
    
}
