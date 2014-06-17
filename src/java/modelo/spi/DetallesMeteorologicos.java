/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package modelo.spi;

import java.util.Map;

/**
 *
 * @author Graciano
 * 
 * Clase auxiliar para facilitar el tratamiento de valores
 * Contiene un mapa que alberga cada uno de los detalles, se puede recuperar con el método getDetalles pasando como 
 * parámetro.
 * -temperatura
 * -temperaturaMax
 * -temperaturaMin
 * -humedad
 * -presion
 * -velocidadViento
 * -direccionViento
 * -nubes
 * -precipitaciones
 */
public class DetallesMeteorologicos {
    
    //Map<String,Object> _detalles;
    double _temperatura;
    double _temperaturaMax;
    double _temperaturaMin;
    int _humedad;
    double _presion;
    double _velocidadViento;
    double _direccionViento;
    int _nubes;
    double _precipitaciones;
    boolean _tormenta;

    public DetallesMeteorologicos(double _temperatura, double _temperaturaMax, double _temperaturaMin, int _humedad, double _presion, double _velocidadViento, double _direccionViento, int _nubes, double _precipitaciones, boolean _tormenta) {
        this._temperatura = _temperatura;
        this._temperaturaMax = _temperaturaMax;
        this._temperaturaMin = _temperaturaMin;
        this._humedad = _humedad;
        this._presion = _presion;
        this._velocidadViento = _velocidadViento;
        this._direccionViento = _direccionViento;
        this._nubes = _nubes;
        this._precipitaciones = _precipitaciones;
        this._tormenta = _tormenta;
    }

    public DetallesMeteorologicos() {
        
    }

    public void setTormenta(boolean _tormenta) {
        this._tormenta = _tormenta;
    }

    public boolean isTormenta() {
        return _tormenta;
    }

    public double getTemperatura() {
        return _temperatura;
    }

    public double getTemperaturaMax() {
        return _temperaturaMax;
    }

    public double getTemperaturaMin() {
        return _temperaturaMin;
    }

    public int getHumedad() {
        return _humedad;
    }

    public double getPresion() {
        return _presion;
    }

    public double getVelocidadViento() {
        return _velocidadViento;
    }

    public double getDireccionViento() {
        return _direccionViento;
    }

    public int getNubes() {
        return _nubes;
    }

    public double getPrecipitaciones() {
        return _precipitaciones;
    }

    public void setTemperatura(double _temperatura) {
        this._temperatura = _temperatura;
    }

    public void setTemperaturaMax(double _temperaturaMax) {
        this._temperaturaMax = _temperaturaMax;
    }

    public void setTemperaturaMin(double _temperaturaMin) {
        this._temperaturaMin = _temperaturaMin;
    }

    public void setHumedad(int _humedad) {
        this._humedad = _humedad;
    }

    public void setPresion(double _presion) {
        this._presion = _presion;
    }

    public void setVelocidadViento(double _velocidadViento) {
        this._velocidadViento = _velocidadViento;
    }

    public void setDireccionViento(double _direccionViento) {
        this._direccionViento = _direccionViento;
    }

    public void setNubes(int _nubes) {
        this._nubes = _nubes;
    }

    public void setPrecipitaciones(double _precipitaciones) {
        this._precipitaciones = _precipitaciones;
    }
    

    
}
