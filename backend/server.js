import express from 'express';
import router from './users.js';
import cors from 'cors'; // Add this

const app = express();
app.use(express.json());
app.use(cors()); // Add this
app.use('/', router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});