const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8080;
const execRouter = require('./routes/execRouter');

app.use(cors({
    origin: ['http://localhost:8090'],
    credentials: true,
    methods: ['GET', 'POST'],
}));

app.use(express.json());

app.use("/exec", execRouter);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});