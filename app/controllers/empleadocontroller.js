const db = require('../config/db.config.js');
const Empleado = db.Empleado;

exports.create = (req, res) => {
    let empleado = {};

    // Validaciones de los datos requeridos
    if (!req.body.primer_nombre || !req.body.primer_apellido || !req.body.nit) {
        return res.status(400).json({
            message: "Faltan datos requeridos (primer_nombre, primer_apellido, nit)"
        });
    }

    try {
        empleado.primer_nombre = req.body.primer_nombre;
        empleado.segundo_nombre = req.body.segundo_nombre;
        empleado.primer_apellido = req.body.primer_apellido;
        empleado.segundo_apellido = req.body.segundo_apellido;
        empleado.nit = req.body.nit;
        empleado.salario = req.body.salario;
        empleado.estatus = req.body.estatus;

        Empleado.create(empleado).then(result => {
            res.status(200).json({
                message: "Empleado creado exitosamente con id = " + result.id_emp,
                empleado: result,
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "¡Fallo al crear el empleado!",
            error: error.message
        });
    }
};

exports.retrieveAllEmpleados = (req, res) => {
    Empleado.findAll({
        order: [
            ['primer_apellido', 'ASC'], // Ordenar por el primer apellido en orden ascendente
        ]
    })
    .then(empleadoInfos => {
        res.status(200).json({
            message: "¡Empleados obtenidos exitosamente!",
            empleados: empleadoInfos
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "¡Error al obtener los empleados!",
            error: error
        });
    });
};

exports.getEmpleadoById = (req, res) => {
    let empleadoId = req.params.id;
    Empleado.findByPk(empleadoId)
        .then(empleado => {
            if (!empleado) {
                return res.status(404).json({
                    message: "Empleado no encontrado con id = " + empleadoId
                });
            }
            res.status(200).json({
                message: "Empleado obtenido exitosamente con id = " + empleadoId,
                empleado: empleado
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "¡Error al obtener empleado con id!",
                error: error
            });
        });
};

exports.updateById = async (req, res) => {
    try {
        let empleadoId = req.params.id;
        let empleado = await Empleado.findByPk(empleadoId);
    
        if (!empleado) {
            return res.status(404).json({
                message: "No se encontró el empleado para actualizar con id = " + empleadoId,
                error: "404"
            });
        } else {    
            let updatedObject = {
                primer_nombre: req.body.primer_nombre,
                segundo_nombre: req.body.segundo_nombre,
                primer_apellido: req.body.primer_apellido,
                segundo_apellido: req.body.segundo_apellido,
                nit: req.body.nit,
                salario: req.body.salario,
                estatus: req.body.estatus
            };

            let result = await Empleado.update(updatedObject, {returning: true, where: {id_emp: empleadoId}});
            
            if (result[0] === 0) {
                return res.status(500).json({
                    message: "No se puede actualizar un empleado con id = " + req.params.id,
                    error: "No se pudo actualizar el empleado",
                });
            }

            res.status(200).json({
                message: "Actualización exitosa de un empleado con id = " + empleadoId,
                empleado: updatedObject,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "No se puede actualizar un empleado con id = " + req.params.id,
            error: error.message
        });
    }
};

exports.deleteById = async (req, res) => {
    try {
        let empleadoId = req.params.id;
        let empleado = await Empleado.findByPk(empleadoId);

        if (!empleado) {
            return res.status(404).json({
                message: "No existe el empleado con id = " + empleadoId,
                error: "404",
            });
        } else {
            await empleado.destroy();
            res.status(200).json({
                message: "Eliminación exitosa del empleado con id = " + empleadoId,
                empleado: empleado,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "No se puede eliminar un empleado con id = " + req.params.id,
            error: error.message,
        });
    }
};
