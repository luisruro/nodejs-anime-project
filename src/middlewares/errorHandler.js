//Si ocurre un error en cualquier parte de la aplicación, este middleware se encargará de capturarlo y enviar una respuesta adecuada al cliente.

//Declaramos una función expresada que va actuar como middleware para manejar los errores
//son los parametros de la función
//err=es el objeto de error que contiene info sobre lo que salio mal, 
//req=es el objeto de la solicitud, 
//rest=es el objeto de la respuesta, 
//next=es una función que se utiliza para darle paso al siguiente middleware 
//Un stack trace es una lista que muestra la secuencia de funciones llamadas en el código que llevaron al error. Esto es muy útil para depurar problemas, 
//ya que te proporciona un recorrido detallado de cómo y dónde ocurrió el error.
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Ocurrió un error en el servidor"});//Envía una respuesta JSON al cliente con un mensaje que indica que ocurrió un error en el servidor.
};
//Exporta el middleware para que pueda ser utilizado en otros archivos de la aplicación cada archivo en Node.js es considerado un módulo y la palabra "module" representa el archivo actual
//para exportar una sola función
export default errorHandler;