import { Router } from 'express';

import { sequelize } from '../../data/init.js';
import { Notes, NotesModel } from '../models/notes.js';

Notes.init(NotesModel, { sequelize, modelName: 'notes' });

const notesRouter = new Router();

notesRouter.get('/notes', async (req, res) => {
  const notes = await Notes.findAll();
  res.json(notes);
});

notesRouter.get('/notes/:id', async (req, res) => {
  const note = await Notes.findByPk(req.params.id);

  res.json(note);
});

notesRouter.post('/notes', async (req, res) => {
  const note = await Notes.create(req.body);
  res.json(note);
});

notesRouter.put('/notes/:id', async (req, res) => {
  const note = await Notes.findByPk(req.params.id);
  if (note) {
    await note.update(req.body);
    res.json(note);
  } else {
    res.status(404).json({ message: 'Notes not found' });
  }
});

notesRouter.delete('/notes/:id', async (req, res) => {
  const note = await Notes.findByPk(req.params.id);
  if (note) {
    await note.destroy();
    res.json({ message: 'Notes deleted' });
  } else {
    res.status(404).json({ message: 'Notes not found' });
  }
});

export default notesRouter;
