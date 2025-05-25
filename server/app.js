require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const PORT = 8090 || process.env.PORT;
const MONGO_URI = '' || process.env.MONGO_URI;
const staticRouter = require('./routes/staticRouter');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello from Server');
});

app.use('/api', staticRouter);

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