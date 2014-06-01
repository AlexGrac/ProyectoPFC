package modelo;

import java.util.LinkedList;
import java.util.List;


/*************************************************************************
 *  Compilation:  javac QuadTree.java
 *  Execution:    java QuadTree M N
 *
 *  Quad tree.
 * 
 * @param <Key>
 * @param <Valor>
 *************************************************************************/

public class QuadTree<Key extends Comparable, Valor>  {
    private Nodo _raiz;
    
    // helper node data type
    private class Nodo {
        Key x, y;              // x-, y- coordenadas
        Nodo NW, NE, SE, SW;   // cuatro subarboles
        Valor valor;           // datos asociados

        Nodo(Key x, Key y, Valor valor) {
            this.x = x;
            this.y = y;
            this.valor = valor;
        }
    }


  /***********************************************************************
    *  Insert (x, y) into appropriate quadrant
     * @param x
     * @param y
     * @param valor
    ***********************************************************************/
    
    public void inserta(Key x, Key y, Valor valor) {
        _raiz = inserta(_raiz, x, y, valor);
    }

    private Nodo inserta(Nodo h, Key x, Key y, Valor valor) {
        if (h == null) return new Nodo(x, y, valor);
        //// if (igual(x, h.x) && igual(y, h.y)) h.valor = valor;  // duplicate
        else if ( menor(x, h.x) &&  menor(y, h.y)) h.SW = inserta(h.SW, x, y, valor);
        else if ( menor(x, h.x) && !menor(y, h.y)) h.NW = inserta(h.NW, x, y, valor);
        else if (!menor(x, h.x) &&  menor(y, h.y)) h.SE = inserta(h.SE, x, y, valor);
        else if (!menor(x, h.x) && !menor(y, h.y)) h.NE = inserta(h.NE, x, y, valor);
        return h;
    }


  /***********************************************************************
    *  Range search.
     * @param rect
     * @return 
    ***********************************************************************/

    public List<Municipio> consulta(Ventana rect) {
//        System.out.println("Se va a comparar con la ventana:");
//        System.out.println(rect.getxMin() + ", " + rect.getxMax());
//        System.out.println(rect.getyMin() + ", " + rect.getyMax());
        return consulta(_raiz, rect);
    }

    private List<Municipio> consulta(Nodo h, Ventana rect) {
        List<Municipio> lista = new LinkedList<Municipio>();
//        if (h != null){
//        System.out.println("Turno de: ");
//        System.out.println(((Municipio)h.valor).getNombre());
//        System.out.println(h.x + ", " + h.y);
//        }
        if (h == null) return lista;
        Key xmin = (Key)rect.getxMin();
        Key ymin = (Key)rect.getyMin();
        Key xmax = (Key)rect.getxMax();
        Key ymax = (Key)rect.getyMax();
        if (rect.contiene(h.x, h.y)){
            //System.out.println("    (" + h.x + ", " + h.y + ") " + h.valor.toString());            
            lista.add((Municipio)h.valor);
        }
        if ( menor(xmin, h.x) &&  menor(ymin, h.y)){
            lista.addAll(consulta(h.SW, rect));
        }
        if ( menor(xmin, h.x) && !menor(ymax, h.y)){
            lista.addAll(consulta(h.NW, rect));
        }
        if (!menor(xmax, h.x) &&  menor(ymin, h.y)){
            lista.addAll(consulta(h.SE, rect));
        }
        if (!menor(xmax, h.x) && !menor(ymax, h.y)){
            lista.addAll(consulta(h.NE, rect));
        }
        
        return lista;
    }
    
    public void imprime(){
        imprimeNodo(_raiz);
    }
    
    private void imprimeNodo(Nodo n){
        System.out.println(n.valor.toString());
        
        if (n.NE != null) imprimeNodo(n.NE);
        if (n.NW != null) imprimeNodo(n.NW);
        if (n.SE != null) imprimeNodo(n.SE);
        if (n.SW != null) imprimeNodo(n.SW);
    }
    
    public List<Valor> getValores(){
        return getValor(_raiz);
    }
    
    private List<Valor> getValor(Nodo n){
        List<Valor> lista = new LinkedList();
        lista.add(n.valor);
        
        if (n.NE != null) lista.addAll(getValor(n.NE));
        if (n.NW != null) lista.addAll(getValor(n.NW));
        if (n.SE != null) lista.addAll(getValor(n.SE));
        if (n.SW != null) lista.addAll(getValor(n.SW));
        
        return lista;
    }


   /*************************************************************************
    *  helper comparison functions
    *************************************************************************/

    private boolean menor(Key k1, Key k2) { return k1.compareTo(k2) <  0; }
    private boolean igual  (Key k1, Key k2) { return k1.compareTo(k2) == 0; }



}