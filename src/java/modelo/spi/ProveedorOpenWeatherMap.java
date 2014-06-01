/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.spi;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author Graciano
 * 
 * 
 * El atributo _appID es el identificador de usuario de OpenWeatherMap
 */
public class ProveedorOpenWeatherMap implements IProveedorMeteorologia {

    final String _urlBase;
    final String _appID;

    public ProveedorOpenWeatherMap() {
        _appID = "3dcbd3bab72ceb436e5dc8f58c6e020f";
        _urlBase = "http://api.openweathermap.org/data/2.5/";
    }

    @Override   
    public DetallesMeteorologicos realizaPeticion(String url) {
        DetallesMeteorologicos detalles;
        JSONObject json;
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(new URL(url).openStream()));
            
            String cadena = "", linea;
            while ((linea = br.readLine()) != null) {
                cadena += linea;
            }
            
            // Parseamos la respuesta
            json = new JSONObject(cadena);            
            
            if (json.getInt("cod") != 200){
                throw new ExcepcionRespuestaInvalida();
            }
            
            //Rellenamos el mapa de los detalles
            Map mapaDetalles = new HashMap();
            // En este objeto va la humedad, la presion y las temperaturas
            JSONObject tiempo = json.getJSONObject("main");
            mapaDetalles.put("temperatura", tiempo.getDouble("temp") - 273.14);
            mapaDetalles.put("temperaturaMin", tiempo.getDouble("temp_min") - 273.14);
            mapaDetalles.put("temperaturaMax", tiempo.getDouble("temp_max") - 273.14);
            mapaDetalles.put("humedad", tiempo.getInt("humidity"));
            mapaDetalles.put("presion", tiempo.getInt("pressure"));
            // En este objeto van los datos correspondientes al viento
            JSONObject viento = json.getJSONObject("wind");
            mapaDetalles.put("velocidadViento", viento.getDouble("speed"));
            mapaDetalles.put("direccionViento", viento.getDouble("deg"));
            // En este objeto van los datos correspondientes al viento
            JSONObject nubes = json.getJSONObject("clouds");
            mapaDetalles.put("nubes", nubes.getInt("all"));
            // En este objeto va la prevision de lluvia
            if (json.isNull("rain"))
                mapaDetalles.put("precipitaciones", "0");
            else{
                JSONArray nombres = json.getJSONObject("rain").names();
                mapaDetalles.put("precipitaciones", nombres.get(0));
            }
            
            detalles = new DetallesMeteorologicos(mapaDetalles);

        } catch (IOException ex) {
            System.out.println(ex.toString());
            detalles = null;
        } catch (JSONException ex) {
            System.out.println(ex.toString());
            detalles = null;
        } catch (ExcepcionRespuestaInvalida ex) {
            System.out.println(ex.toString());
            detalles = null;
        }        
        return detalles;
    }

    @Override
    public DetallesMeteorologicos prediccion(String ciudad, String pais, Date fecha) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public DetallesMeteorologicos tiempoActual(String ciudad, String pais) {
        String url = _urlBase + "weather?q=" + ciudad + "," + pais + "&APPID=" + _appID;
        return realizaPeticion(url);
    }

    @Override
    public DetallesMeteorologicos tiempoActual(double latitud, double longitud) {
        String url = _urlBase + "weather?lat=" + latitud + "&lon=" + longitud + "&APPID=" + _appID;
        return realizaPeticion(url);
    }


}
