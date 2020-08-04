class Usuarios {
    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        };
        this.personas.push(persona);
        return this.personas;
    }

    getPersona(id) {
        let persona = this.personas.filter(persona => persona.id === id)[0]; //[0] regresamos el primer elemeto que coincida con el id
        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala); //retornamos persona.sala si es igual a ala sala del parametro
        return personasEnSala;
    }

    borrarPersona(id) {
        //regresa todas las personas que no sean el id del parametro
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(persona => persona.id != id);
        return personaBorrada;
    }
}

module.exports = {
    Usuarios
}