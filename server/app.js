require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 8090 || process.env.PORT;
const MONGO_URI = '' || process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Server');
});

mongoose.connect(MONGO_URI)
.then(() => { 
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}/`)
    });
})
.catch((err) => {
    console.log(err);
});