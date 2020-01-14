const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require('express-jwt');
const fs = require("fs");
const public = fs.readFileSync("./config/public.pem");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const port = process.env.PORT || 3000;
app.use(bodyParser.json());

const { Client } = require('pg');
const client = new Client({
    "user": "u151170",
    "password": "151170",
    "host": "localhost",
    "port": 5432,
    "database": "db_201920z_gv_ind_052"
});

const connect = async () => {
    try {
        await client.connect();
        //set active schema
        await client.query("set search_path to video_share");
        console.log("Connected successfully to database.");
    }
    catch (e) {
        console.error(`Failed to connect ${e}`);
    }
}

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Video share API",
            version: '1.0.0',
            description: "Applicaion for sharing videos",
        },
        license: {
            name: "MIT",
            url: "https://choosealicense.com/licenses/mit/"
        },
        contact: {
            name: "kikoano",
            url: "https://github.com/kikoano",
            email: "kikoano111@gmail.com"
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http", //apiKey
                    scheme: "bearer",
                    bearerFormat: "JWT",
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./routes/*.js", "./models/*.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocs);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
router.use(jwt({ secret: public}).unless({path: ["/api/v1/register","/api/v1/login"]}));

require("./models/user");
require("./models/follow");
require("./models/video");
require("./models/playlist");

require("./routes/users")(router, client);
require("./routes/videos")(router, client);
require("./routes/playlist")(router, client);

app.use("/api/v1", router);

app.listen(port, () => {
    console.log(`Server listening to port ${port}`)
});

connect();
