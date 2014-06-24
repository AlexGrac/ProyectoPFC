/*
 * @author: Alejandro Graciano Segura
 * 
 * Clase que representa una ventana de visión.
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
