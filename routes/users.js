const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const cert = fs.readFileSync("./config/private.pem");

/**
 * @swagger
 * tags: 
 *   name: Users
 *   description: User management
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     security: []  
 *     requestBody:
 *       $ref: '#/components/requestBodies/UserRegisterBody'
 *     responses:
 *       "200":
 *         description: Successful operation
 *       "500": 
 *         description: Internal server error
 *
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     security: []  
 *     requestBody:
 *       $ref: '#/components/requestBodies/UserLoginBody'
 *     responses:
 *       "200":
 *         description: Successful operation
 *       "400": 
 *         description: Wrong password
 *       "404": 
 *         description: User not found
 * /followers:
 *   get:
 *     summary: Get user followers
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Follow'      
*/
module.exports = (router, client) => {
    router.get("/users", async (req, res) => {
        const results = await client.query("select * from users");
        res.status(200);
        res.send(JSON.stringify(results.rows));
    });

    router.get("/followers", async (req, res) => {
        const results = await client.query("select username from (select follow_user_id from follow where user_id = $1) f join users u on f.follow_user_id = u.id",[req.user.id]);
        res.status(200);
        res.send(JSON.stringify(results.rows));
    });

    router.post("/register", async (req, res) => {
        const username = req.body.username;
        const user_password = req.body.user_password;
        const hash = await bcrypt.hash(user_password, 10);
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const email = req.body.email;
        try {
            const results = await client.query(`insert into users (username,user_password,first_name,last_name,email) values($1,$2,$3,$4,$5);`, [username, hash, first_name, last_name, email]);
            const id = await client.query(`select id from users where username = $1`, [username])[0];
            res.status(200);
            //create jwt token
            const token = jwt.sign({
                "id": id
            }, cert, { algorithm: "RS256", expiresIn: "15m" });
            res.send(token);
        }
        catch (err) {
            res.status(500)
            res.send(err.stack);
        }
    });
    router.post("/login", async (req, res) => {
        const username = req.body.username;
        const password = req.body.user_password;

        const user = await client.query(`select id, user_password from users where username = $1`, [username]);
        if (user.rowCount==0) {
            res.status(404)
            res.send("User not found!");
        }

        const match = await bcrypt.compare(password, user.rows[0].user_password);
        if (!match) {
            res.status(400)
            res.send("Wrong password!");
        }

        //create jwt token
        const token = jwt.sign({
            "id": user.rows[0].id
        }, cert, { algorithm: "RS256", expiresIn: "15m" });
        res.status(200);
        res.send(token);
    });
}