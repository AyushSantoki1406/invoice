import express from 'express';
import Template from '../models/Template.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
});

router.post('/', async (req, res) => {
  try {
    const template = await Template.create(req.body);
    res.status(201).json(template);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create template' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete template' });
  }
});

export default router;
