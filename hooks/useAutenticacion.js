import React, { useEffect, useState } from 'react';
import firebase from '../firebase';

function useAutenticacion() {
  const [usuarioAutenticado, guardarUsuarioAutenticado] = useState(null);
  useEffect(() => {
    const onSuscribe = firebase.auth.onAuthStateChanged((usuario) => {
      if (usuario) {
        guardarUsuarioAutenticado(usuario);
      } else {
        guardarUsuarioAutenticado(null);
      }
    });
    () => {
      onSuscribe();
    };
  }, []);
  return usuarioAutenticado;
}
export default useAutenticacion;
