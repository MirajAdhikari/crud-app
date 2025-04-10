import express from 'express';
import { v4 as uuidv4 } from 'uuid'; // Importing UUID library to generate unique IDs
import mysql from 'mysql2';

const router = express.Router();

// Database connection configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mydb'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database as ID ' + connection.threadId);
});

// Helper function to handle database queries
function queryDatabase(query, values, callback) {
    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Database error:', error);
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

// Adding a new user
router.post('/', (req, res) => {
    const user = req.body; // Extracting user data from the request body

    // Validating that all required fields are provided
    if (!user.first_name || !user.last_name || !user.email) {
        return res.status(400).json({ message: "First name, last name, and email are required!" });
    }

    // Generate a unique ID for the user
    const userId = uuidv4();

    // SQL query to insert a new user into the database
    const query = `
        INSERT INTO users (id, first_name, last_name, email)
        VALUES (?, ?, ?, ?)
    `;
    const values = [userId, user.first_name, user.last_name, user.email];

    // Execute the query
    queryDatabase(query, values, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "An error occurred while adding the user.", error: error.message });
        }

        // Respond with a success message and the newly created user object
        const newUser = { id: userId, ...user };
        res.json({ message: `${user.first_name} has been added to the database`, user: newUser });
    });
});

// Fetch data of all users
router.get('/users', (req, res) => {
    // SQL query to fetch all users from the database
    const query = `
        SELECT * FROM users
    `;

    // Execute the query
    queryDatabase(query, [], (error, results) => {
        if (error) {
            return res.status(500).json({ message: "An error occurred while fetching users.", error: error.message });
        }

        // Check if any users were found
        if (results.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        // Respond with the list of all users
        res.json(results);
    });
});

// Fetch data of a specific user
router.get('/users/:id', (req, res) => {
    const { id } = req.params; // Extracting the `id` parameter from the URL

    // SQL query to fetch a specific user by ID
    const query = `
        SELECT * FROM users WHERE id = ?
    `;
    const values = [id];

    // Execute the query
    queryDatabase(query, values, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "An error occurred while fetching the user.", error: error.message });
        }

        // Check if the user was found
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Respond with the user object if found
        res.json(results[0]);
    });
});

// Delete data of a user
router.delete('/:id', (req, res) => {
    const { id } = req.params; // Extracting the `id` parameter from the URL

    // SQL query to delete a user by ID
    const query = `
        DELETE FROM users WHERE id = ?
    `;
    const values = [id];

    // Execute the query
    queryDatabase(query, values, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "An error occurred while deleting the user.", error: error.message });
        }

        // Check if any rows were affected (i.e., if the user existed)
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Respond with a success message
        res.json({ message: `User with ID ${id} has been deleted` });
    });
});

// Update data of a user
router.patch('/users/:id', (req, res) => {
    const { id } = req.params; // Extract the user ID from the URL
    const { first_name, last_name, email } = req.body; // Extract fields to update from the request body

    // SQL query to update the user in the database
    let setClause = '';
    const values = [];
    let hasUpdates = false;

    // Dynamically build the SET clause based on which fields are provided
    if (first_name) {
        setClause += 'first_name = ?, ';
        values.push(first_name);
        hasUpdates = true;
    }
    if (last_name) {
        setClause += 'last_name = ?, ';
        values.push(last_name);
        hasUpdates = true;
    }
    if (email) {
        setClause += 'email = ?, ';
        values.push(email);
        hasUpdates = true;
    }

    // Remove trailing comma and space from the SET clause
    setClause = setClause.slice(0, -2);

    // If no fields were provided, respond with an error
    if (!hasUpdates) {
        return res.status(400).json({ message: "No fields provided for update" });
    }

    // Append the WHERE clause to the query
    setClause += ' WHERE id = ?';
    values.push(id);

    // Execute the query
    queryDatabase(setClause, values, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "An error occurred while updating the user.", error: error.message });
        }

        // Check if any rows were affected (i.e., if the user existed)
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch the updated user data from the database
        const getUserQuery = `
            SELECT * FROM users WHERE id = ?
        `;
        queryDatabase(getUserQuery, [id], (getError, getResults) => {
            if (getError) {
                return res.status(500).json({ message: "An error occurred while fetching the updated user.", error: getError.message });
            }

            // Respond with the updated user data
            res.json({
                message: `User with the ID ${id} has been updated.`,
                user: getResults[0],
            });
        });
    });
});

export default router; // Exporting the router for use in the main application file
