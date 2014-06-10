/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package modelo.spi;

/**
 *
 * @author Graciano
 * 
 * Interfaz que define el SPI
 */
public interface IProveedorMeteorologia {
    
    public DetallesMeteorologicos tiempoActual(String ciudad, String pais);
    public DetallesMeteorologicos tiempoActual(double latitud, double longitud);    
    public DetallesMeteorologicos prediccion(String ciudad, String pais, int fecha);
    public DetallesMeteorologicos prediccion(double latitud, double longitud, int fecha);
    public DetallesMeteorologicos realizaPeticionActual(String url);
    public DetallesMeteorologicos realizaPeticionPrecidiccion(String url);
}
