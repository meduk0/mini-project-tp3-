const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initPool } = require('./db');
const userORM = require('./orm');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await userORM.findAll();
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
});


// Add new user
app.post('/add', async (req, res) => {
    try {
        const { name, class: userClass, nationality } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({ success: false, error: 'Name is required' });
        }

        const newUser = await userORM.create({
            name,
            class: userClass || '',
            nationality: nationality || ''
        });

        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ success: false, error: 'Failed to add user' });
    }
});

// Modify user
app.put('/modify/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, class: userClass, nationality } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({ success: false, error: 'Name is required' });
        }

        const updatedUser = await userORM.update(id, {
            name,
            class: userClass || '',
            nationality: nationality || ''
        });

        if (!updatedUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, data: updatedUser });
    } catch (error) {
        console.error('Error modifying user:', error);
        res.status(500).json({ success: false, error: 'Failed to modify user' });
    }
});

// Remove user
app.delete('/remove/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deleted = await userORM.delete(id);

        if (!deleted) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error removing user:', error);
        res.status(500).json({ success: false, error: 'Failed to remove user' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// Initialize database and start server
const startServer = async () => {
    try {
        await initPool();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
