const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8080;
const execRouter = require('./routes/execRouter');
const GENERAL_BACKEND_URI = (process.env.GENERAL_BACKEND_URI).split(',') || ['https://main-backend.harshvashiyar.in:8090'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || GENERAL_BACKEND_URI.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST'],
}));

app.use(express.json());

app.use("/exec", execRouter);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});