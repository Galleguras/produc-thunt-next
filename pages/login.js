import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { css } from '@emotion/react';
import { Formulario, InputSubmit, Error } from '../components/ui/Formulario';
import validarIniciarSesion from '../validacion/validarIniciarSesion';
import Router from 'next/router';
import firebase from '../firebase';
//validaciones
import useValidacion from '../hooks/useValidacion';
const STATE_INICIAL = { email: '', password: '' };
const Login = () => {
  const [error, guardarError] = useState(false);
  const {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);
  const { email, password } = valores;
  async function iniciarSesion() {
    console.log('Iniciando sesion');
    try {
      const usuario = await firebase.login(email, password);
      console.log(usuario);
      Router.push('/');
    } catch (error) {
      console.error('hubo un error al iniciar la sesion', error.message);
      guardarError(error.message);
    }
  }

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
            Iniciar Sesión
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
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
            <InputSubmit type="submit" value="Iniciar Sesión" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default Login;
