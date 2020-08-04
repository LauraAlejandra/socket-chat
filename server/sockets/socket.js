//Este archivo es el servidor

const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { CrearMensaje, crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {
    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }
        //para conectarse a una sala
        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));
        callback(usuarios.getPersonasPorSala(data.sala));

    });

    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        if (!(personaBorrada === undefined)) {
            client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje(`Administrador`, `${personaBorrada.nombre} salió`));
            client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
        }

    });

    //lo que va a hacer el servidor cuando alguien quiera mandar un mensaje privado a alguien
    //Escuchar Mensajes privados
    client.on('mensajePrivado', data => {
        //mandar mensaje a todos los que estan conectados
        let persona = usuarios.getPersona(client.id);
        //data.para recuperda el id de la persona a la que quieres mandar el mensaje y to lo manda a esa persona
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});