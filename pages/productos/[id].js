import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { Formulario, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';
import NuevoProducto from '../nuevo-producto';
const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = (props) => {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  console.log(router);

  const { firebase, usuario } = useContext(FirebaseContext);
  const [producto, guardarProducto] = useState({});
  const [error, guardarError] = useState(false);
  const [comentario, guardarComentario] = useState({});
  const [consultarDB, guardaConsultarBD] = useState(true);

  useEffect(() => {
    if (id && consultarDB) {
      console.log('YA HAY ID', id);
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection('productos').doc(id);
        const producto = await productoQuery.get();
        console.log('producto.data()', producto);

        if (producto.exists) {
          guardarProducto(producto.data());
          guardaConsultarBD(false);
        } else {
          guardarError(true);
        }
      };
      obtenerProducto();
    }
  }, [id]);
  if (Object.keys(producto).length === 0 && !error) return 'Cargando...';
  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    haVotado,
  } = producto;

  //Administrar votos
  const votarProducto = () => {
    if (!usuario) {
      return router.push('/login');
    }
    console.log('votando');
    //obtener y sumar un nuevo voto
    let nuevoTotal = votos + 1;
    //verificar que el usuario actual ha votado
    if (haVotado.includes(usuario.uid)) return;
    const nuevoHaVotado = [...haVotado, usuario.uid];
    console.log(nuevoTotal);
    //actualizamos el state
    guardarProducto({ ...producto, votos: nuevoTotal });
    //Actualizamos la bbdd
    firebase.db
      .collection('productos')
      .doc(id)
      .update({ votos: nuevoTotal, haVotado: nuevoHaVotado });
    guardaConsultarBD(true);
  };
  //funcion para crear comentarios
  const comentarioChange = (e) => {
    guardarComentario({ ...comentario, [e.target.name]: e.target.value });
  };

  //identifica si el comentario es del creador del producto
  const esCreador = (id) => {
    if ((creador.id = id)) {
      return true;
    }
  };

  const agregarComentario = (e) => {
    e.preventDefault();
    if (!usuario) {
      return router.push('/login');
    }
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;
    //tomamos copia del comentario y lo añadimos al arreglo
    const nuevosComentarios = [...comentarios, comentario];
    //Actualizamos la BD
    firebase.db
      .collection('productos')
      .doc(id)
      .update({ comentarios: nuevosComentarios });
    //Actualizamos el state
    guardarProducto({ ...producto, comentarios: nuevosComentarios });
    guardaConsultarBD(true);
  };

  //funcion que revisa usuario es creador del producto
  const puedeBorrar = () => {
    if (!usuario) {
      return false;
    }
    if (creador.id === usuario.uid) {
      return true;
    }
  };

  //elimina un producto de la bbdd
  const eliminarProducto = async () => {
    if (!usuario) {
      return router.push('/login');
    }
    if (creador.id !== usuario.uid) {
      return router.push('/');
    }
    try {
      await firebase.db.collection('productos').doc(id).delete();
      router.push('/');
    } catch (error) {
      console.log('Error al borrar producto-->', error);
    }
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div className="contenedor">
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {nombre}
            </h1>
            <ContenedorProducto>
              <div>
                <p>
                  {`Publicado hace ${formatDistanceToNow(new Date(creado), {
                    locale: es,
                  })}`}
                </p>
                <p>{`Publicado por ${creador.nombre} de ${empresa}`}</p>
                <img src={urlimagen} alt="" />
                <p>{descripcion}</p>
                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>
                    <Formulario onSubmit={agregarComentario}>
                      <div>
                        <input
                          type="text"
                          name="mensaje"
                          onChange={comentarioChange}
                        />
                      </div>
                      <InputSubmit
                        type="submit"
                        value="Agregar Comentario"
                      ></InputSubmit>
                    </Formulario>
                  </>
                )}
                <h2
                  css={css`
                    margin: 2rem 2rem;
                  `}
                >
                  Comentarios
                </h2>
                {comentarios.length === 0 ? (
                  'Sin comentarios'
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>{`Escrito por: ${comentario.usuarioNombre}`}</p>
                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>Es Creador</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <aside>
                <Boton target="_blank" bgColor="true" href={url}>
                  Visitar URL
                </Boton>

                <div
                  css={css`
                    margin-top: 5rem;
                  `}
                ></div>
                <p
                  css={css`
                    text-align: center;
                  `}
                >{`Votos ${votos}`}</p>
                {usuario && (
                  <>
                    <Boton onClick={votarProducto}>Votar</Boton>
                  </>
                )}
              </aside>
            </ContenedorProducto>
            {puedeBorrar() && (
              <Boton onClick={eliminarProducto}>Elimnar Producto</Boton>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
