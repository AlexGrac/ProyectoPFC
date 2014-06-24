/*
 * @author: Alejandro Graciano Segura
 * 
 * Clase que comapara dos municipios en función de su población.
 */

package modelo;

import java.util.Comparator;

/**
 *
 * @author Graciano
 */
public class ComparadorMunicipios implements Comparator{

    @Override
    public int compare(Object o1, Object o2) {
        return ((Municipio)o2).getPoblacion() - ((Municipio)o1).getPoblacion();
    }
    
}
