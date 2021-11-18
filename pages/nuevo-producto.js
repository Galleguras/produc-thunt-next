import React, { useState, useContext } from 'react';
import Layout from '../components/layout/Layout';
import { css } from '@emotion/react';
import { Formulario, InputSubmit, Error } from '../components/ui/Formulario';
import validarCrearProducto from '../validacion/validarCrearProducto';
import Router, { useRouter } from 'next/router';
import firebase, { FirebaseContext } from '../firebase';
//validaciones
import useValidacion from '../hooks/useValidacion';
import FileUploader from 'react-firebase-file-uploader';
const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  /*   imagen: '', */
  url: '',
  descripcion: '',
};

const NuevoProducto = () => {
  //state de las imagenes
  const [nombreImagen, guardarNombre] = useState('');
  const [subiendo, guardarSubiendo] = useState(false);
  const [progreso, guardarProgreso] = useState(0);
  const [urlImagen, guardarUrlImagen] = useState('');

  const [error, guardarError] = useState(false);
  const {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);
  const { nombre, empresa, imagen, url, descripcion } = valores;

  //hook de routing para redirecionar
  const router = useRouter();

  //context con las operaciones CRUD de firebase
  const { usuario, firebase } = useContext(FirebaseContext);
  async function crearProducto() {
    console.log('Creando producto...');
    //Si el usuario no esta autenticado llevar a login
    if (!usuario) {
      return router.push('/login');
    }
    //crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlImagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
    };

    //insertarlo en la BBDD
    firebase.db.collection('productos').add(producto);
    return router.push('/');
  }

  const handleUploadStart = () => {
    guardarProgreso(0);
    guardarSubiendo(true);
  };

  const handleProgress = (progreso) => guardarProgreso({ progreso });

  const handleUploadError = (error) => {
    guardarSubiendo(error);
    console.error(error);
  };

  const handleUploadSuccess = (nombre) => {
    guardarProgreso(100);
    guardarSubiendo(false);
    guardarNombre(nombre);
    firebase.storage
      .ref('productos')
      .child(nombre)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        guardarUrlImagen(url);
      });
  };

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            Nuevo Producto
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            <fieldset>
              <legend>Informacion General</legend>
              <div>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Tu Nombre"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errores.nombre && <Error>{errores.nombre}</Error>}
              <div>
                <label htmlFor="nombre">Empresa</label>
                <input
                  type="text"
                  id="empresa"
                  placeholder="Nombre Empresa"
                  name="empresa"
                  value={empresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errores.empresa && <Error>{errores.empresa}</Error>}
              <div>
                <label htmlFor="imagen">Imagen</label>
                <FileUploader
                  accept="image/*"
                  id="imagen"
                  name="imagen"
                  /*        value={imagen}
                  onChange={handleChange}
                  onBlur={handleBlur} */
                  randomizeFilename
                  storageRef={firebase.storage.ref('images')}
                  onUploadStart={handleUploadStart}
                  onUploadError={handleUploadError}
                  onUploadSuccess={handleUploadSuccess}
                  onProgress={handleProgress}
                />
              </div>
              {/*          {errores.imagen && <Error>{errores.imagen}</Error>} */}
              <div>
                <label htmlFor="url">URL</label>
                <input
                  type="url"
                  id="url"
                  placeholder="Url de tu producto"
                  name="url"
                  value={url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errores.url && <Error>{errores.url}</Error>}
            </fieldset>
            <fieldset>
              <legend>Sobre tu producto</legend>
              <div>
                <label htmlFor="descripcion">Descripcion</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errores.descripcion && <Error>{errores.descripcion}</Error>}
            </fieldset>
            <InputSubmit type="submit" value="Crear Cuenta" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default NuevoProducto;
