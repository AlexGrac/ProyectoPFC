/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import modelo.Municipio;
import modelo.QuadTree;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.nio.charset.StandardCharsets;
import modelo.CoordenadasWGS84;
import modelo.spi.DetallesMeteorologicos;
import modelo.spi.ServicioMeteorologia;

/**
 *
 * @author Graciano
 */
public class CargaMunicipios extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res) {
        procesaRespuesta(req, res);
    }

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse res) {
        procesaRespuesta(req, res);

    }

    private void procesaRespuesta(HttpServletRequest req, HttpServletResponse res) {

        JSONObject json;
        ServicioMeteorologia servicio = ServicioMeteorologia.getInstancia();
        try {

            // Parseamos el fichero de municipios
            ServletContext contexto = getServletContext();
            BufferedReader br = new BufferedReader(new InputStreamReader(contexto.getResourceAsStream("/WEB-INF/classes/recursos/MunicipiosNuevos.json"), StandardCharsets.UTF_8));

            String cadena = "", linea;

            while ((linea = br.readLine()) != null) {
                cadena += linea;
            }

            json = new JSONObject(cadena);
            JSONArray municipiosJSON = json.getJSONArray("municipios");

            //Lo introducimos en el QuadTree
            int tama = municipiosJSON.length();
            QuadTree<Double, Municipio> municipios = new QuadTree<Double, Municipio>();

            // Creamos los municipios y normalizamos las coordendas
            for (int i = 0; i < tama; ++i) {
                JSONObject mun = municipiosJSON.getJSONObject(i);
                String nombre = mun.getString("nombre");
                
                double longitud = CoordenadasWGS84.normalizaLongitud(mun.getDouble("longitud"));
                double latitud = CoordenadasWGS84.normalizaLatitud(mun.getDouble("latitud"));
                int poblacion = mun.getInt("poblacion");
                //DetallesMeteorologicos detalles = servicio.tiempoActual(mun.getDouble("latitud"), mun.getDouble("longitud"));
                municipios.inserta(longitud, latitud, new Municipio(nombre, longitud, latitud, poblacion, null));
            }
            
            // Introducimos el QuadTree en la sesion
            req.getSession().setAttribute("municipios", municipios);

        } catch (IOException e) {
            Logger.getLogger(CargaMunicipios.class.getName()).log(Level.SEVERE, null, e);
        } catch (JSONException e) {
            Logger.getLogger(CargaMunicipios.class.getName()).log(Level.SEVERE, null, e);
        }

    }
}
