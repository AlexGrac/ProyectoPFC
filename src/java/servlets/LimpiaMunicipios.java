/*
 * @author: Alejandro Graciano Segura
 * 
 * Servlet que borra los detalles meteorológicos de memoria cuando se cambia de modo de previsión.
 */
package servlets;

import java.util.List;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import modelo.Municipio;
import modelo.QuadTree;

/**
 *
 * @author Graciano
 */
public class LimpiaMunicipios extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res) {
        procesaRespuesta(req, res);
    }

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse res) {
        procesaRespuesta(req, res);

    }

    private void procesaRespuesta(HttpServletRequest req, HttpServletResponse res) {
        // Obtenemos los municipios de la sesion
        QuadTree<Double, Municipio> municipios = (QuadTree) req.getSession().getAttribute("municipios");

        List<Municipio> lista = municipios.getValores();

        for (Municipio m : lista) {
            m.setDetalles(null);
        }

    }

}
