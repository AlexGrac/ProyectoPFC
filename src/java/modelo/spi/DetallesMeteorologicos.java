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
    
    Map<String,Object> _detalles;
    
    public DetallesMeteorologicos(Map detalles){
        _detalles = detalles;
    }
    
    public Object getDetalles(String campo){
        return _detalles.get(campo);
    }
    
    public Map getDetalles(){
        return _detalles;
    }
    
}
