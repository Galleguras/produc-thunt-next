import React, { useState, useEffect } from 'react';

const useValidacion = (stateInitial, validar, fn) => {
  const [valores, guardarValores] = useState(stateInitial);
  const [errores, guardarErrores] = useState({});
  const [submitForm, guardarSubmitForm] = useState(false);
  useEffect(() => {
    if (submitForm) {
      const noErrores = Object.keys(errores).length === 0;
      if (noErrores) {
        fn();
      }
      guardarSubmitForm(false);
    }
  }, [errores]);
  //Funcion que se ejecutará cuando el usuario escriba algo
  const handleChange = (e) => {
    guardarValores({ ...valores, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = validar(valores);
    guardarErrores(erroresValidacion);
    guardarSubmitForm(true);
  };

  //cuando se realiza el evento
  const handleBlur = () => {
    const erroresValidacion = validar(valores);
    guardarErrores(erroresValidacion);
  };

  return {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur,
  };
};

export default useValidacion;
