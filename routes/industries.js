const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM industries`);
        return res.json({ invoices: results.rows });
    } catch (e) {
        return next(e)
    }
});

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(`SELECT * FROM industries WHERE code =$1`, [code]);
        return res.json({ indstury: results.rows[0] });
    } catch (e) {
        return next(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { name } = req.body;
        const results = await db.query(`INSERT INTO companies (code, name) VALUES ($1, $2) RETURNING code, name`, [code, name]);
        return res.status(201).json({ company: results.rows[0] });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;