const express = require('express');
const router = express.Router();

const Note = require('../models/notes');
const fetchUser = require('../middleware/fetchUser');


// ROUTE 1: Get all notes
// GET: /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchUser, async (req, res) => {

    try {

        const notes = await Note.find({ user: req.user.id });

        res.json(notes);

    } catch (error) {

        console.error(error.message);
        res.status(500).send("Internal Server Error");

    }

});


// ROUTE 2: Add a new note
// POST: /api/notes/addnote
router.post('/addnote', fetchUser, async (req, res) => {

    try {

        const { title, description, tag } = req.body;

        const note = new Note({
            title: title,
            description: description,
            tag: tag,
            user: req.user.id
        });

        const savedNote = await note.save();

        res.json(savedNote);

    } catch (error) {

        console.error(error.message);
        res.status(500).send("Internal Server Error");

    }

});


// ROUTE 3: Update an existing note
// PUT: /api/notes/updatenote/:id
router.put('/updatenote/:id', fetchUser, async (req, res) => {

    try {

        const { title, description, tag } = req.body;

        const newNote = {};

        if (title) {
            newNote.title = title;
        }

        if (description) {
            newNote.description = description;
        }

        if (tag) {
            newNote.tag = tag;
        }

        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Note not found");
        }

if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
}

        note = await Note.findByIdAndUpdate(
            req.params.id,
            { $set: newNote },
            { new: true }
        );

        res.json(note);

    } catch (error) {

        console.error(error.message);
        res.status(500).send("Internal Server Error");

    }

});


// ROUTE 4: Delete an existing note
// DELETE: /api/notes/deletenote/:id
router.delete('/deletenote/:id', fetchUser, async (req, res) => {

    try {

        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Note not found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id);

        res.json({
            message: "Note deleted successfully",
            note: note
        });

    } catch (error) {

        console.error(error.message);
        res.status(500).send("Internal Server Error");

    }

});

module.exports = router;