/*
 * @author: Alejandro Graciano Segura
 * 
 * Servlet que se encarga de introducir los municipios en memoria cuando se ejecuta la aplicación.
 */
package servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.List;
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
        req.getSession().invalidate();
        try {

            // Parseamos el fichero de municipios
            ServletContext contexto = getServletContext();
            BufferedReader br = new BufferedReader(new InputStreamReader(contexto.getResourceAsStream("/WEB-INF/classes/recursos/MunicipiosNuevos.json"), "UTF-8"));

            String cadena = "", linea;

            while ((linea = br.readLine()) != null) {
                cadena += linea;
            }

            json = new JSONObject(cadena);
            JSONArray municipiosJSON = json.getJSONArray("municipios");

            //Lo introducimos en el QuadTree
            int tama = municipiosJSON.length();
            QuadTree<Double, Municipio> municipios = new QuadTree<Double, Municipio>();
            List<Municipio> lista = new LinkedList();

            // Creamos los municipios y normalizamos las coordendas
            for (int i = 0; i < tama; ++i) {
                JSONObject mun = municipiosJSON.getJSONObject(i);
                String nombre = mun.getString("nombre");

                double longitud = CoordenadasWGS84.normalizaLongitud(mun.getDouble("longitud"));
                double latitud = CoordenadasWGS84.normalizaLatitud(mun.getDouble("latitud"));
                int poblacion = mun.getInt("poblacion");
                DetallesMeteorologicos detalles = null;
                Municipio m = new Municipio(nombre, longitud, latitud, poblacion, detalles);
                if (nombre.equals("Madrid")
                        || nombre.equals("Barcelona")
                        || nombre.equals("Valencia")
                        || nombre.equals("Sevilla")
                        || nombre.equals("Zaragoza")
                        || nombre.equals("Granada")
                        || nombre.equals("Murcia")
                        || nombre.equals("Bilbao")
                        || nombre.equals("Valladolid")
                        || nombre.equals("Vigo")
                        || nombre.equals("Ferrol")
                        || nombre.equals("Gijón")
                        || nombre.equals("Plasencia")
                        || nombre.equals("Badajoz")
                        || nombre.equals("Ciudad Real")) {
                    detalles = servicio.tiempoActual(mun.getDouble("latitud"), mun.getDouble("longitud"));
                    m.setDetalles(detalles);
                    lista.add(m);
                }
                municipios.inserta(longitud, latitud, m);
            }

            // Introducimos el QuadTree en la sesion
            req.getSession().setAttribute("municipios", municipios);
            
            JSONObject respuesta = new JSONObject();
            respuesta.put("municipios", lista);

            //Enviamos la respuesta
            res.setContentType("application/json; charset=UTF-8");
            res.setHeader("Cache-Control", "no-cache");

            String outString = respuesta.toString();
            res.getWriter().write(outString);

        } catch (IOException e) {
            Logger.getLogger(CargaMunicipios.class.getName()).log(Level.SEVERE, null, e);
        } catch (JSONException e) {
            Logger.getLogger(CargaMunicipios.class.getName()).log(Level.SEVERE, null, e);
        }

    }
}
