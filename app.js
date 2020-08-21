require("dotenv").config();

const fetch = require("node-fetch");
const express = require("express");

const app = express();

/**
 * [GET] Get latest currencies.
 */
app.get("/currencies", async (req, res) => {
    try {
        const request = await fetch("https://api.ratesapi.io/api/latest");

        const response = await request.json();

        res.json({
            data: response,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal error",
            data: {},
        });
    }
});

/**
 * [GET] Get currency rate by currency code.
 */
app.get("/currencies/:currency([A-Z]{3,3})", async (req, res) => {
    try {
        const base = req.query.base && /[A-Z]{3,3}/.test(req.query.base)
            ? req.query.base
            : 'EUR';

        const request = await fetch(`https://api.ratesapi.io/api/latest?base=${base}`);

        const response = await request.json();

        if (!response.rates[req.params.currency]) {
            return res.status(422).json({
                message: "Invalid currency.",
                data: {},
            });
        }

        res.json({
            data: {
                base: response.base,
                currency: req.params.currency,
                rate: response.rates[req.params.currency]
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal error",
            data: {},
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
