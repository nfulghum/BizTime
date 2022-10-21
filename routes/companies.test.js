const request = require("supertest");
const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");


// Pulled function from solution
beforeEach(createData);

afterAll(async () => {
    await db.end()
})

describe("GET /", () => {
    test("It should respond with array of companies", async () => {
        const response = await request(app).get("/companies");
        expect(response.body).toEqual({
            "companies": [
                { code: "apple", name: "Apple" },
                { code: "ibm", name: "IBM" },
            ]
        })
    })
})

describe("GET /apple", () => {
    test("Return company info", async () => {
        const response = await request(app).get("/companies/apple");
        expect(response.body).toEqual(
            {
                "company": {
                    code: "apple",
                    name: "Apple",
                    description: "Maker of OSX",
                    invoices: [1, 2]
                }
            }
        )
    });
    test("Should return 404 if company not found", async () => {
        const response = await request(app).get("/companies/sdfsdfsdf");
        expect(response.status).toEqual(404);
    })
})