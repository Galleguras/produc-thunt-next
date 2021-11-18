import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { css } from '@emotion/react';
import { Formulario, InputSubmit, Error } from '../components/ui/Formulario';
import validarCrearCuenta from '../validacion/validarCrearCuenta';
import Router from 'next/router';
import firebase from '../firebase';
//validaciones
import useValidacion from '../hooks/useValidacion';
const STATE_INICIAL = { nombre: '', email: '', password: '' };
const CrearCuenta = () => {
  const [error, guardarError] = useState(false);
  const {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);
  async function crearCuenta() {
    console.log('Creando cuenta...');
    try {
      await firebase.registrar(nombre, email, password);

      Router.push('/');
    } catch (error) {
      console.error('hubo un error al crear el formulario', error.message);
      guardarError(error.message);
    }
  }
  const { nombre, email, password } = valores;
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
            Crear Cuenta
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
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
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                placeholder="Tu Email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errores.email && <Error>{errores.email}</Error>}
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Tu Password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errores.password && <Error>{errores.password}</Error>}
            {error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="Crear Cuenta" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default CrearCuenta;
