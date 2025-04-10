import express from 'express';
import { v4 as uuidv4 } from 'uuid'; // Importing UUID library to generate unique IDs

const router = express.Router();

// Sample data
const users = [];



// Adding a new user
router.post('/', (req, res) => {
    const user = req.body; // Extracting user data from the request body

    // Validating that all required fields are provided
    if (!user.first_name || !user.last_name || !user.email) {
        return res.status(400).json({ message: "First name, last name, and email are required!" });
    }

    // Creating a new user object with a unique ID
    const newUser = { ...user, id: uuidv4() };

    // Adding the new user to the `users` array
    users.push(newUser);

    // Responding with a success message and the newly created user object
    res.json({ message: `${user.first_name} has been added to the database`, user: newUser });
});



// Fetch data of all users
router.get('/users', (req, res) => {
    // Checking if the `users` array is empty
    if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }

    // Responding with the list of all users
    res.json(users);
});



// Fetch data of specific user
router.get('/users/:id', (req, res) => {
    const { id } = req.params; // Extracting the `id` parameter from the URL

    // Searching for the user with the matching ID
    const user = users.find((u) => u.id === id);

    // Responding with a 404 error if the user is not found
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Responding with the user object if found
    res.json(user);
});



// Delete data of a user
router.delete('/:id', (req, res) => {
    const { id } = req.params; // Extracting the `id` parameter from the URL

    // Finding the index of the user with the matching ID
    const userIndex = users.findIndex((u) => u.id === id);

    // Responding with a 404 error if the user is not found
    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    // Removing the user from the `users` array
    users.splice(userIndex, 1);

    // Responding with a success message
    res.json({ message: `User with ID ${id} has been deleted` });
});



// Update data of a user
router.patch('/users/:id', (req, res) => {
    const { id } = req.params; // Extract the user ID from the URL
    const { first_name, last_name, email } = req.body; // Extract fields to update from the request body

    // Find the index of the user in the array
    const userIndex = users.findIndex((user) => user.id === id);

    // Check if the user exists
    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    // Create a new user object with updated fields
    const updatedUser = {
        ...users[userIndex], // Copy existing user data
        first_name: first_name || users[userIndex].first_name, // Update first_name if provided
        last_name: last_name || users[userIndex].last_name, // Update last_name if provided
        email: email || users[userIndex].email, // Update email if provided
    };

    // Replace the old user with the updated user in the array
    users[userIndex] = updatedUser;

    // Respond with the updated user data
    res.json({
        message: `User with the ID ${id} has been updated.`,
        user: updatedUser,
    });
});

export default router; // Exporting the router for use in the main application file