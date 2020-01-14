
/**
 * @swagger
 * tags: 
 *   name: Playlist
 *   description: Playlist management
 * /playlist:
 *   post:
 *     summary: Create playlist
 *     tags: [Playlist]
 *     requestBody:
 *       $ref: '#/components/requestBodies/PlaylistBody'
 *     responses:
 *       "200":
 *         description: Successful operation
*   delete:
 *     summary: Delete playlist
 *     tags: [Playlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                  type: integer
 *     responses:
 *       "200":
 *         description: Successful operation
 *   get:
 *     summary: Get user playlist
 *     tags: [Playlist]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type:
 *               items:
 *                 $ref: '#/components/schemas/Playlist'  
*/
module.exports = (router, client) => {
    router.post("/playlist", async (req, res) => {
        const playlist_name = req.body.playlist_name;
        const results = await client.query("insert into playlist (user_id,playlist_name) values ($1,$2)", [req.user.id, playlist_name]);
        res.status(200);
        res.send("Playlist created");
    })
    router.get("/playlist", async (req, res) => {
        const results = await client.query("select * from playlist where user_id = $1", [req.user.id]);
        res.status(200);
        res.send(JSON.stringify(results.rows));
    })
    router.delete("/playlist", async (req, res) => {
        const id = req.body.id;
        const results = await client.query("delete from playlist where id = $1 and user_id = $2", [id,req.user.id]);
        res.status(200);
        res.send("Playlist deleted");
    })
}