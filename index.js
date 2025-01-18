const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const { router } = require('./Settings/router')

const { Client } = require('pg');
const port = 5000;

// Middleware

// Initialize Express app
const app = express();

// Middleware

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

// Sync database
// const Post = require('./models/Post');

// sequelize.sync({ force: false }) // Set to `true` only for development (drops and recreates tables)
//     .then(() => console.log('Database synced'))
//     .catch(err => console.error('Error syncing database:', err));



// index.js
// const Post = require('./models/Post');





// PostgreSQL client setup
const pool = new Client({
    user: 'j',
    host: 'localhost',
    database: 'chati',
    password: 'j',
    port: 5432,
});
pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('PostgreSQL connection error:', err));




function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'biruk', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    });
}



app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        // Generate JWT with a reasonable expiration time (e.g., 1 hour)
        const token = jwt.sign(
            { userId: result.rows[0].id },
            'biruk',
            { expiresIn: '1h' } // Set expiration to 1 hour
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0],
            token, // Send the token in the response
        });
    } catch (error) {
        res.status(400).json({ error: 'User already exists or invalid data' });
    }
});

// (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
// (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count
// FROM posts p
// JOIN users u ON p.user_id = u.id
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await pool.query(`
            SELECT * FROM posts ORDER BY created_at DESC
        `);
        res.status(200).json(posts.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});




// Route to create a
app.post('/api/posts', authenticateToken, async (req, res) => {
    const { body, title } = req.body; // Get body and title from the request
    const user_id = req.body.user_id; // Get user ID from the JWT

    // Validate input
    if (!body) {
        return res.status(400).json({ error: 'Body is required' });
    }

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO posts (user_id, body, title) VALUES ($1, $2, $3) RETURNING *',
            [user_id, body, title]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});



// Route to like a post
app.post('/api/posts/:postId/like', async (req, res) => {
    const { postId } = req.params;
    const { user_id } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO likes (post_id, user_id) VALUES ($1, $2) RETURNING *',
            [postId, user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to like post' });
    }
});

// Route to comment on a post
app.post('/api/posts/:postId/comment', async (req, res) => {
    const { postId } = req.params;
    const { user_id, content } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
            [postId, user_id, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to comment on post' });
    }
});
// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, username: user.username }, 'biruk', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during login' });
    }
});



// Send friend request
app.post('/friend-requests', authenticateToken, async (req, res) => {
    const { recipientId } = req.body;

    try {
        await pool.query(
            'INSERT INTO friend_requests (sender_id, recipient_id) VALUES ($1, $2)',
            [req.user.userId, recipientId]
        );
        res.status(201).json({ message: 'Friend request sent' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send friend request' });
    }
});

// Notifications
app.get('/notifications', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Create a group
app.post('/groups', authenticateToken, async (req, res) => {
    const { name, description } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO groups (name, description, creator_id) VALUES ($1, $2, $3) RETURNING id',
            [name, description, req.user.userId]
        );
        res.status(201).json({ groupId: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create group' });
    }
});

// Join a group
app.post('/groups/:id/join', authenticateToken, async (req, res) => {
    const groupId = req.params.id;

    try {
        await pool.query(
            'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [groupId, req.user.userId]
        );
        res.status(200).json({ message: 'Joined group' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to join group' });
    }
});

// Create a page
app.post('/pages', authenticateToken, async (req, res) => {
    const { name, description } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO pages (name, description, creator_id) VALUES ($1, $2, $3) RETURNING id',
            [name, description, req.user.userId]
        );
        res.status(201).json({ pageId: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create page' });
    }
});

// Follow a page
app.post('/pages/:id/follow', authenticateToken, async (req, res) => {
    const pageId = req.params.id;

    try {
        await pool.query(
            'INSERT INTO page_followers (page_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [pageId, req.user.userId]
        );
        res.status(200).json({ message: 'Followed page' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to follow page' });
    }
});














const { Pool } = require("pg");
app.post("/table-data", async (req, res) => {
    const { host, user, password, tableName } = req.body;

    const pool = new Pool({
        host:'localhost',
        user:'j',
        password:'j',
        database: "chati", // Start with the default 'postgres' database
        port:'5432',
    });
    try {
        const client = await pool.connect();

        // Fetch column names
        const columnQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = $1
        `;
        const columnResult = await client.query(columnQuery, [tableName]);
        const columns = columnResult.rows.map((row) => row.column_name);

        // Fetch table rows (limit 100 for performance)
        const dataQuery = `SELECT * FROM ${tableName} LIMIT 100`;
        const dataResult = await client.query(dataQuery);

        client.release();

        res.json({
            columns,
            rows: dataResult.rows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/connecti", async (req, res) => {
    // const { host, user, password, port = 5432 } = req.body;

    // Connect to the server using the default database (can be any database the user has access to)
    const pool = new Pool({
        host:'localhost',
        user:'j',
        password:'j',
        database: "chati", // Start with the default 'postgres' database
        port:'5432',
    });

    try {
        const client = await pool.connect();

        // Query to get all databases on the server
        const databasesResult = await client.query(
            `SELECT datname FROM pg_database WHERE datistemplate = false`
        );
        const databases = databasesResult.rows.map((row) => row.datname);

        const dbStructure = {};

        // Iterate over each database to fetch its structure
        for (const dbName of databases) {
            const dbPool = new Pool({
                host:'localhost',
                user:'j',
                password:'j',
                database: dbName,
                port:'5432',
            });

            const dbClient = await dbPool.connect();

            // Get schemas and their tables for the current database
            const schemasResult = await dbClient.query(
                `SELECT schema_name FROM information_schema.schemata`
            );

            dbStructure[dbName] = {};

            for (const schema of schemasResult.rows) {
                const schemaName = schema.schema_name;

                const tablesResult = await dbClient.query(
                    `SELECT table_name FROM information_schema.tables WHERE table_schema = $1`,
                    [schemaName]
                );

                dbStructure[dbName][schemaName] = {};

                for (const table of tablesResult.rows) {
                    const tableName = table.table_name;

                    const columnsResult = await dbClient.query(
                        `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2`,
                        [schemaName, tableName]
                    );

                    dbStructure[dbName][schemaName][tableName] = columnsResult.rows;
                }
            }

            dbClient.release();
        }

        client.release();
        res.json(dbStructure);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post("/connect", async (req, res) => {
    // const { host, user, password } = req.body;
console.log(req.body);

    const pool2 = new Client({
        host  : 'localhost',
         
        user: 'j',
        password: 'j',
        database: "postgres", // Connect to the default database initially
        port: 5432,
    });

    try {
        const client = await pool2.connect();

        // Fetch all databases
        const databasesResult = await client.query(
            `SELECT datname FROM pg_database WHERE datistemplate = false`
        );
        const databases = databasesResult.rows.map((row) => row.datname);

        const dbStructure = {};

        // Iterate through each database and fetch its structure
        for (const dbName of databases) {
            const dbPool = new Client({
                host  : 'localhost',
         
                user: 'j',
                password: 'j',
                database: dbName,
                port: 5432,
            });

            const dbClient = await dbPool.connect();

            // Get schemas for the current database
            const schemas = await dbClient.query(
                `SELECT schema_name FROM information_schema.schemata`
            );

            dbStructure[dbName] = {};

            for (const schema of schemas.rows) {
                const schemaName = schema.schema_name;

                const tables = await dbClient.query(
                    `SELECT table_name FROM information_schema.tables WHERE table_schema = $1`,
                    [schemaName]
                );

                dbStructure[dbName][schemaName] = {};

                for (const table of tables.rows) {
                    const tableName = table.table_name;

                    const columns = await dbClient.query(
                        `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2`,
                        [schemaName, tableName]
                    );

                    dbStructure[dbName][schemaName][tableName] = columns.rows;
                }
            }

            dbClient.release();
        }

        client.release();
        res.json(dbStructure);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
