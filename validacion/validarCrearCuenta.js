export default function validarCrearCuenta(valores) {
  let errores = {};

  //validar el nombre
  if (!valores.nombre) {
    errores.nombre = 'El nombre es obligatorio';
  }
  //validar el email
  let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  //validar el email
  if (!valores.email) {
    errores.email = 'El email es obligatorio';
  } else if (!emailRegex.test(valores.email)) {
    errores.email = 'El email es incorrecto';
  }
  //validar el pass
  if (!valores.password) {
    errores.password = 'El password es obligatorio';
  } else if (valores.password.length < 6) {
    errores.password = 'El password debe ser de almenos 6 caracteres';
  }
  return errores;
}
