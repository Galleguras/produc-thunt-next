import React from 'react';
import Layout from '../components/layout/Layout';
import { css } from '@emotion/react';
import { Formulario, InputSubmit } from '../components/ui/Formulario';
const CrearCuenta = () => (
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
        <Formulario>
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              placeholder="Tu Nombre"
              name="nombre"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" placeholder="Tu Email" name="email" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Tu Password"
              name="password"
            />
          </div>
          <InputSubmit type="submit" value="Crear Cuenta" />
        </Formulario>
      </>
    </Layout>
  </div>
);

export default CrearCuenta;
