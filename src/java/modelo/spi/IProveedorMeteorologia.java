/*
 * @author: Alejandro Graciano Segura
 * 
 * Interfaz a implementar por todos los servicios web subscritos.
 */

package modelo.spi;

public interface IProveedorMeteorologia {
    
    public DetallesMeteorologicos tiempoActual(String ciudad, String pais);
    public DetallesMeteorologicos tiempoActual(double latitud, double longitud);    
    public DetallesMeteorologicos prediccion(String ciudad, String pais, int fecha);
    public DetallesMeteorologicos prediccion(double latitud, double longitud, int fecha);
    public DetallesMeteorologicos realizaPeticionActual(String url);
    public DetallesMeteorologicos realizaPeticionPrecidiccion(String url);
}
