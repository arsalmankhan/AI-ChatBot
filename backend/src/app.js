const express = require("express");

const app = express();

app.get('/', (req,res) => {
    res.send("This API Working  ")
})

module.exports = app;
