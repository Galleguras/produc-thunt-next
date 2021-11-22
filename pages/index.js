import React from 'react';
import DetallesProducto from '../components/layout/DetallesProducto';
import Layout from '../components/layout/Layout';
import useProducto from '../hooks/useProducto';
const Home = () => {
  const { productos } = useProducto('creado');
  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {productos.map((producto) => {
                return (
                  <DetallesProducto key={producto.id} producto={producto} />
                );
              })}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
