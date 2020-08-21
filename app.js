// const http = require('http');
const fetch = require('node-fetch');

var express = require("express");
var app = express();

fetch('https://api.ratesapi.io/api/latest')
    .then(res => res.json())
    .then(json => console.log(json));

app.get("/url", (req, res, next) => {
    res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

app.get('/currencies', async (req, res) => {
    try {
        const request = await fetch('https://api.ratesapi.io/api/latest');

        const response = await request.json();

        res.json({
            data: response
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal error',
            data: {}
        });
    }
});

app.get('/currencies/:currency([A-Z]{3,3})', async (req, res) => {
    try {
        const request = await fetch('https://api.ratesapi.io/api/latest');

        const response = await request.json();

        if (!response.rates[req.params.currency]) {
            return res.status(422).json({
                message: 'Invalid currency.',
                data: {}
            })
        }

        res.json({
            data: {
                [req.params.currency]: response.rates[req.params.currency]
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal error',
            data: {}
        });
    }
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});