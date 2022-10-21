/** Routes for companies */

const express = require("express");
const ExpressError = require("../expressError");
const slugify = require("slugify");
let router = new express.Router();
const db = require("../db");

// Return list of companies
router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT code, name FROM companies ORDER BY name`);
        return res.json({ companies: results.rows })
    } catch (e) {
        return next(e);
    }
});

// Return company based on code
router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const compResults = await db.query(`SELECT code, name, descritpion FROM companies WHERE code = $1`, [code]);
        const invResults = await db.query(`SELECT id FROM invoices WHERE comp_code=$1`, [code])
        if (compResults.rows.length === 0) {
            throw new ExpressError(`${code} can't be found`, 404)
        }

        const company = compResults.rows[0];
        const invoices = invResults.rows;
        company.invoices = invoices.map(inv => inv.id)
        return res.send({ company: company })
    } catch (e) {
        return next(e)
    }
});

// Add a company
router.post('/', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        let code = slugify(name, { lower: true });

        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description]);
        return res.status(201).json({ companies: results.rows[0] })
    } catch (e) {
        return next(e)
    }
});

// Edit existing company
router.put('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const results = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`, [name, description, code]);
        if (results.rowCount.length === 0) {
            throw new ExpressError(`${code} can't be found`, 404)
        }
        return res.send({ companies: results.rows[0] })
    } catch (e) {
        return next(e)
    }
});

// Delete company
router.delete('/:code', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = db.query(`DELETE FROM companies WHERE code=$1`, [req.params.code]);
        if ((await results).rows.length === 0) {
            throw new ExpressError(`Company with id ${id} does not exist`, 404);
        }
        return res.send({ status: "Deleted" });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;