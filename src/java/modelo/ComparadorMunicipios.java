/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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
