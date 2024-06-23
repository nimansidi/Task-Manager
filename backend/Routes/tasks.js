const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const Task = require('../Models/Task');

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new task
router.post('/', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get a single task
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (req.body.title != null) {
            task.title = req.body.title;
        }
        if (req.body.description != null) {
            task.description = req.body.description;
        }
        if (req.body.dueDate != null) {
            task.dueDate = req.body.dueDate;
        }

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;

        // Validate ObjectID format
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            console.error(`Invalid ID format: ${taskId}`);
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            console.error(`Task not found: ${taskId}`);
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted' });
    } catch (err) {
        console.error('Error deleting task:', err); // Detailed error logging
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
});

module.exports = router;
