const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Create and Save a new User
exports.create = async (req, res) => {

    const foundUser = await User.findOne ({ "email" : req.body.email });

    if (foundUser) {
        console.log(foundUser);
        return res.status(400).json({
            status: "error",
            message: "Пользовотель с таким email уже существует",
            fu: foundUser
        });
    }
    // Validate request
    if (!req.body.firstName) {
        return res.status(400).json({
            status: "error",
            message: "Поле имя обязательно для заполнения"
        });
    }
    if (!req.body.lastName) {
        return res.status(400).json({
            status: "error",
            message: "Поле фамилия обязательно для заполнения"
        });
    }
    if (!req.body.email) {
        return res.status(400).json({
            status: "error",
            message: "Поле электронная почта обязательно для заполнения"
        });
    }
    if (!req.body.password) {
        return res.status(400).json({
            status: "error",
            message: "Поле пароль обязательно для заполнения"
        });
    }
    if (!req.body.organization) {
        return res.status(400).json({
            status: "error",
            message: "Поле организация обязательно для заполнения"
        });
    }
    // Create a User
    //TODO в ближайшей итерации хешировать пароль и хранить его хеш с солью
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        organization: req.body.organization,
    });
    // Save User in the database
    user.save()
        .then(data => {
            const token = jwt.sign({ email: data.email }, process.env.SECRET);
            res.json({
                status: "ok",
                message: {
                    id: data._id,
                    token: token
                }
            });
        }).catch(err => {
        res.status(500).send({
            status: "error",
            message: err.message || "Some error occurred while creating the User."
        });
    });

};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Note.find()
        .then(notes => {
            res.send({
                status: "ok",
                message: notes
            });
        }).catch(err => {
        res.status(500).send({
            status: "error",
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    Note.findById(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    status: "error",
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send({
                status: "ok",
                message: note
            });
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                status: "error",
                message: "Note not found with id " + req.params.noteId
            });
        }
        return res.status(500).send({
            status: "error",
            message: "Error retrieving note with id " + req.params.noteId
        });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.content) {
        return res.status(400).send({
            status: "error",
            message: "Note content can not be empty"
        });
    }

    // Find note and update it with the request body
    Note.findByIdAndUpdate(req.params.noteId, {
        title: req.body.title || "Untitled Note",
        content: req.body.content
    }, {new: true})
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    status: "error",
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send({
                status: "ok",
                message: note
            });
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                status: "error",
                message: "Note not found with id " + req.params.noteId
            });
        }
        return res.status(500).send({
            status: "error",
            message: "Error updating note with id " + req.params.noteId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Note.findByIdAndRemove(req.params.noteId)
        .then(note => {
            if(!note) {
                return res.status(404).send({
                    status: "error",
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send({
                status: "ok",
                message: "Note deleted successfully!"
            });
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                status: "error",
                message: "Note not found with id " + req.params.noteId
            });
        }
        return res.status(500).send({
            status: "error",
            message: "Could not delete note with id " + req.params.noteId
        });
    });
};