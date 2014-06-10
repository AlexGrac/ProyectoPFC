/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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
