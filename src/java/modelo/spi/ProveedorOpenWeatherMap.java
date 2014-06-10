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
import java.text.DecimalFormat;
import java.util.Date;
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
    public DetallesMeteorologicos realizaPeticionActual(String url) {
        DetallesMeteorologicos detalles = new DetallesMeteorologicos();
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
            
            DecimalFormat df = new DecimalFormat("#.#");
            
            
            // En este objeto va la humedad, la presion y las temperaturas
            JSONObject tiempo = json.getJSONObject("main");
            detalles.setTemperatura(Double.valueOf(df.format(tiempo.getDouble("temp") - 273.15).replace(',', '.')));
            detalles.setTemperaturaMin(Double.valueOf(df.format(tiempo.getDouble("temp_min") - 273.15).replace(',', '.')));
            detalles.setTemperaturaMax(Double.valueOf(df.format(tiempo.getDouble("temp_max") - 273.15).replace(',', '.')));
            detalles.setHumedad(tiempo.getInt("humidity"));
            detalles.setPresion(tiempo.getInt("pressure"));
            // En este objeto van los datos correspondientes al viento
            JSONObject viento = json.getJSONObject("wind");
            detalles.setVelocidadViento(viento.getDouble("speed"));
            detalles.setDireccionViento(viento.getDouble("deg"));
            // En este objeto van los datos correspondientes a las nubes
            JSONObject nubes = json.getJSONObject("clouds");
            detalles.setNubes(nubes.getInt("all"));
            // En este objeto va la prevision de lluvia
            if (json.isNull("rain"))
                detalles.setPrecipitaciones(0);
            else{
                JSONObject objeto = json.getJSONObject("rain");
                JSONArray nombres = objeto.names();
                detalles.setPrecipitaciones(objeto.getDouble(nombres.getString(0)));
            }
            
           

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
    public DetallesMeteorologicos realizaPeticionPrecidiccion(String url) {
        DetallesMeteorologicos detalles = new DetallesMeteorologicos();
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
            
            DecimalFormat df = new DecimalFormat("#.#");
            
            int cnt = json.getInt("cnt");
            JSONArray lista = json.getJSONArray("list");
            JSONObject prevision = lista.getJSONObject(cnt - 1);
            // En este objeto van las temperaturas
            JSONObject temperatura = prevision.getJSONObject("temp");
            double tempMedia = (temperatura.getDouble("max") + temperatura.getDouble("min")) / 2 - 273.15;
            detalles.setTemperatura(Double.valueOf(df.format(tempMedia).replace(',', '.')));
            detalles.setTemperaturaMin(Double.valueOf(df.format(temperatura.getDouble("min") - 273.15).replace(',', '.')));
            detalles.setTemperaturaMax(Double.valueOf(df.format(temperatura.getDouble("max") - 273.15).replace(',', '.')));
            detalles.setHumedad(prevision.getInt("humidity"));
            detalles.setPresion(prevision.getInt("pressure"));
            detalles.setVelocidadViento(prevision.getDouble("speed"));
            detalles.setDireccionViento(prevision.getDouble("deg"));
            detalles.setNubes(prevision.getInt("clouds"));
            // En este objeto va la prevision de lluvia
            if (prevision.isNull("rain"))
                detalles.setPrecipitaciones(0);
            else{
                detalles.setPrecipitaciones(prevision.getDouble("rain"));
            }
            
           

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
    public DetallesMeteorologicos prediccion(String ciudad, String pais, int fecha) {
        String url = _urlBase + "forecast/" + "daily?q=" + ciudad + "," + pais + "&cnt=" + fecha + "&APPID=" + _appID;
        return realizaPeticionPrecidiccion(url);    
    }

    @Override
    public DetallesMeteorologicos prediccion(double latitud, double longitud, int fecha) {
        String url = _urlBase + "forecast/" + "daily?lat=" + latitud + "&lon=" + longitud + "&cnt=" + fecha + "&APPID=" + _appID;
        return realizaPeticionPrecidiccion(url);        
    }

    @Override
    public DetallesMeteorologicos tiempoActual(String ciudad, String pais) {
        String url = _urlBase + "weather?q=" + ciudad + "," + pais + "&APPID=" + _appID;
        return realizaPeticionActual(url);
    }

    @Override
    public DetallesMeteorologicos tiempoActual(double latitud, double longitud) {
        String url = _urlBase + "weather?lat=" + latitud + "&lon=" + longitud + "&APPID=" + _appID;
        return realizaPeticionActual(url);
    }


}
