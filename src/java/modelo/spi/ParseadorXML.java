/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.spi;

import java.util.HashMap;
import java.util.Map;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

/**
 *
 * @author Graciano
 * 
 * 
 * El atributo _etiquetas contiene el contenido del fichero xml:
 * El primer key contiene el valor de la etiqueta, mientras que el
 * mapa interno contiene el conjunto de atributos y el valor.
 * 
 */
public class ParseadorXML extends DefaultHandler {

    Map<String, Map<String,String>> _etiquetas;

    @Override
    public void startDocument() throws SAXException {
        _etiquetas = new HashMap();
    }

    @Override
    public void endDocument() throws SAXException {

    }

    @Override
    public void startElement(String URI, String nombreLocal, String q, Attributes a) throws SAXException {
        Map atributos = new HashMap();

        for (int i = 0; i < a.getLength(); ++i) {
            atributos.put(a.getQName(i),a.getValue(i));
        }

        _etiquetas.put(nombreLocal, atributos);

    }

    public Map getEtiquetas() {
        return _etiquetas;
    }


}
