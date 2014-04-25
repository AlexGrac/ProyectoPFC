/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.Map;
import java.util.TreeMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import modelo.CoordenadasNormalizadas;
import modelo.Municipio;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MunicipiosVentana extends HttpServlet {

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

        //Parseamos el JSON de la peticion
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(req.getInputStream()));
            
            json = new JSONObject(br.readLine());
            JSONArray ventana = json.getJSONArray("ventana");

            int tama = ventana.length();
            LinkedList<CoordenadasNormalizadas> coordenadas = new LinkedList<CoordenadasNormalizadas>();

            for (int i = 0; i < tama; ++i) {
                JSONObject coord = ventana.getJSONObject(i);
                double x = coord.getDouble("x");
                double y = coord.getDouble("y");

                coordenadas.add(new CoordenadasNormalizadas(x, y));
            }

            //Recorremos los municipios y filtramos
            ServletContext contexto = getServletContext();
            br = new BufferedReader(new InputStreamReader(contexto.getResourceAsStream("/WEB-INF/classes/recursos/PoblacionCoordenadas.json")));

            String cadena = "", linea;

            while ((linea = br.readLine()) != null) {
                cadena += linea;
            }

            json = new JSONObject(cadena);
            JSONArray municipiosJSON = json.getJSONArray("municipios");
            
            
            tama = municipiosJSON.length();
            LinkedList<Municipio> municipios = new LinkedList<Municipio>();

            for (int i = 0; i < tama; ++i) {
                JSONObject mun = municipiosJSON.getJSONObject(i);
                String nombre = mun.getString("nombre");
                double longitud = mun.getDouble("longitud");
                double latitud = mun.getDouble("latitud");
                int poblacion = mun.getInt("poblacion");

                municipios.add(new Municipio(nombre, longitud, latitud, poblacion));
            }
            
            //Filtramos los municipios
            JSONObject c0 = json.getJSONObject("coordenadas0");
            JSONObject c1 = json.getJSONObject("coordenadas1");
            CoordenadasNormalizadas supIzq = new CoordenadasNormalizadas(c0.getDouble("longitud"), c0.getDouble("latitud"));
            CoordenadasNormalizadas infDer = new CoordenadasNormalizadas(c1.getDouble("longitud"), c1.getDouble("latitud"));
            double distLongitud = infDer.getX() - supIzq.getX();
            double distLatitud = infDer.getY() - supIzq.getY();
            
                      
            JSONArray filtrados = new JSONArray();
            for(Municipio m:municipios){
                //normalizamos las coordenadas
                double lonNorm = (m.getLongitud() - supIzq.getX())/distLongitud;
                double latNorm = (m.getLatitud() - supIzq.getY())/distLatitud;
                                
                if ((lonNorm > coordenadas.get(0).getX() && lonNorm < coordenadas.get(3).getX()) && 
                    (latNorm > coordenadas.get(1).getY() && latNorm < coordenadas.get(2).getY())){
                    TreeMap mapa = new TreeMap();
                    
                    mapa.put("nombre", m.getNombre());
                    mapa.put("longitud", lonNorm);
                    mapa.put("latitud", latNorm);
                    mapa.put("poblacion", m.getPoblacion());
                    filtrados.put(mapa);
                }
            }
            
            JSONObject respuesta = new JSONObject();
            respuesta.put("municipios", filtrados);
            
            //Enviamos la respuesta
            
            res.setContentType("application/json");
            res.setHeader("Cache-Control", "no-cache");
            
            String outString = respuesta.toString();
            res.getWriter().write(outString);
            

        } catch (IOException ex) {
            Logger.getLogger(MunicipiosVentana.class.getName()).log(Level.SEVERE, null, ex);
        } catch (JSONException ex) {
            Logger.getLogger(MunicipiosVentana.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}
