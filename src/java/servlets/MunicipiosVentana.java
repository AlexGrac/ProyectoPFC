/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import modelo.ComparadorMunicipios;
import modelo.CoordenadasWGS84;
import modelo.Municipio;
import modelo.QuadTree;
import modelo.Ventana;
import modelo.spi.DetallesMeteorologicos;
import modelo.spi.ServicioMeteorologia;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MunicipiosVentana extends HttpServlet {
    private static final int ACTUAL = 0;
    private static final int HOY = 1;
    private static final int DIA1 = 2;
    private static final int DIA2 = 3;
    private static final int DIA3 = 4;
    
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
        // Obtenemos el QuadTree de la sesion
        QuadTree<Double, Municipio> municipios = (QuadTree)req.getSession().getAttribute("municipios");
        ServicioMeteorologia servicio = ServicioMeteorologia.getInstancia();
        
        //Parseamos el JSON de la peticion
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(req.getInputStream()));
            
            json = new JSONObject(br.readLine());
            JSONArray ventana = json.getJSONArray("ventana");
            int modo = json.getInt("modo");
            
            // Extraemos las esquinas de la ventana
            JSONObject coord = ventana.getJSONObject(0);
            CoordenadasWGS84 supIzq = new CoordenadasWGS84(coord.getDouble("x"), coord.getDouble("y"));
            coord = ventana.getJSONObject(1);
            CoordenadasWGS84 infDer = new CoordenadasWGS84(coord.getDouble("x"), coord.getDouble("y"));
            
            // Filtramos los municipios
            Ventana<Double> esquinas = new Ventana<Double>(supIzq.getX(), infDer.getX(), supIzq.getY(), infDer.getY());
            List<Municipio> filtrados = municipios.consulta(esquinas);
            
            // Pedimos la prevision al spi
            System.out.println(modo);
            for (Municipio m : filtrados){
                if (!m.tieneDetalles()){
                    CoordenadasWGS84 coordenadas = new CoordenadasWGS84(m.getLongitud(), m.getLatitud());
                    DetallesMeteorologicos detalles;
                    if (modo == ACTUAL)
                        detalles = servicio.tiempoActual(coordenadas.getLatitud(), coordenadas.getLongitud());
                    else
                        detalles = servicio.prediccion(coordenadas.getLatitud(), coordenadas.getLongitud(), modo);
                    m.setDetalles(detalles);
                }
            }
            
            Collections.sort(filtrados, new ComparadorMunicipios());
            

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
