/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package modelo.spi;

import java.util.Date;
import java.util.Iterator;
import java.util.ServiceLoader;

/**
 *
 * @author Graciano
 */
public class ServicioMeteorologia {
    
    private static ServicioMeteorologia _instancia;
    private final ServiceLoader<IProveedorMeteorologia> _loader;
    
    private ServicioMeteorologia(){
        _loader = ServiceLoader.load(IProveedorMeteorologia.class);
    }
    
    public static ServicioMeteorologia getInstancia(){
        if (_instancia == null)
            _instancia = new ServicioMeteorologia();
        
        return _instancia;
    }
    
    public DetallesMeteorologicos tiempoActual(String ciudad, String pais){
        DetallesMeteorologicos detalles = null;
        
        Iterator<IProveedorMeteorologia> servicio = _loader.iterator();
        if (servicio.hasNext()){
            IProveedorMeteorologia p = servicio.next();
            detalles = p.tiempoActual(ciudad, pais);
        }            
        
        return detalles;
    }
    
    public DetallesMeteorologicos tiempoActual(double latitud, double longitud){
        DetallesMeteorologicos detalles = null;
        
        Iterator<IProveedorMeteorologia> servicio = _loader.iterator();
        if (servicio.hasNext()){
            IProveedorMeteorologia p = servicio.next();
            detalles = p.tiempoActual(latitud, longitud);
        }            
        
        return detalles;
    }
    
    public DetallesMeteorologicos prediccion(String ciudad, String pais, int fecha){
        DetallesMeteorologicos detalles = null;
        
        Iterator<IProveedorMeteorologia> servicio = _loader.iterator();
        if (servicio.hasNext()){
            IProveedorMeteorologia p = servicio.next();
            detalles = p.prediccion(ciudad, pais, fecha);
        }            
        
        return detalles;
    }
    
    public DetallesMeteorologicos prediccion(double latitud, double longitud, int dia){
        DetallesMeteorologicos detalles = null;
        
        Iterator<IProveedorMeteorologia> servicio = _loader.iterator();
        if (servicio.hasNext()){
            IProveedorMeteorologia p = servicio.next();
            detalles = p.prediccion(latitud, longitud, dia);
        }            
        
        return detalles;
    }
    
}
