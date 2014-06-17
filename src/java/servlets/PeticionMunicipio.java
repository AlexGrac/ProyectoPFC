/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import modelo.Municipio;
import modelo.QuadTree;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author Graciano
 */
public class PeticionMunicipio extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res) {
        procesaRespuesta(req, res);
    }

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse res) {
        procesaRespuesta(req, res);

    }

    private void procesaRespuesta(HttpServletRequest req, HttpServletResponse res) {
        try {
            // Obtenemos el parametro y los municipios de la sesion
            String municipio = new String(req.getParameter("municipio").getBytes(), "UTF-8");
            QuadTree<Double, Municipio> municipios = (QuadTree) req.getSession().getAttribute("municipios");

            List<Municipio> lista = municipios.getValores();
            Municipio munRespuesta = null;

            for (Municipio m : lista) {
                if (m.getNombre().equals(municipio)) {
                    munRespuesta = m;
                    break;
                }
            }

            String nombre;
            double latitud, longitud;
            if (munRespuesta != null) {
                nombre = munRespuesta.getNombre();
                longitud = munRespuesta.getLongitud();
                latitud = munRespuesta.getLatitud();
            } else {
                nombre = "";
                longitud = 0;
                latitud = 0;
            }
            JSONObject respuesta = new JSONObject();
            respuesta.put("municipio", nombre);
            respuesta.put("latitud", latitud);
            respuesta.put("longitud", longitud);

            //Enviamos la respuesta
            res.setContentType("application/json");
            res.setHeader("Cache-Control", "no-cache");

            String outString = respuesta.toString();
            res.getWriter().write(outString);

        } catch (JSONException ex) {
            Logger.getLogger(PeticionVentana.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(PeticionMunicipio.class.getName()).log(Level.SEVERE, null, ex);
        }

    }
}
