export default function validarCrearCuenta(valores) {
  let errores = {};

  //validar el nombre
  if (!valores.nombre) {
    errores.nombre = 'El nombre es obligatorio';
  }

  //validar la empresa
  if (!valores.empresa) {
    errores.empresa = 'El nombre de la empresa es obligatorio';
  }

  //validar la url
  if (!valores.url) {
    errores.url = 'La url del producto es obligatoria';
  } else if (
    /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/gim.test(
      valores.url
    )
  ) {
    errores.url = 'Url mal formateada o no valida';
  }
  //validar la descripcion
  if (!valores.descripcion) {
    errores.descripcion = 'El nombre de la descripcion es obligatorio';
  }
  return errores;
}
