
/**
 * @swagger
 * tags: 
 *   name: Videos
 *   description: Video management
 * /videos:
 *   get:
 *     summary: Get all videos
 *     tags: [Videos]
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort videos
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type:
 *               items:
 *                 $ref: '#/components/schemas/Video'
 *   post:
 *     summary: Upload video
 *     tags: [Videos]
 *     requestBody:
 *       $ref: '#/components/requestBodies/VideoBody'
 *     responses:
 *       "200":
 *         description: Successful operation
 * /videos/history:
 *   get:
 *     summary: Get history watched videos
 *     tags: [Videos]
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort videos
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type:
 *               items:
 *                 $ref: '#/components/schemas/Video'
 * /videos/{id}/like:
 *   post:
 *     summary: Like/Dislike video
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         minimum: 1
 *         description: Video id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               like:
 *                  type: boolean
 *     responses:
 *       "200":
 *         description: Successful operation
 * /videos/{id}/:
 *   get:
 *     summary: Watch video
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         minimum: 1
 *         description: Video id
 *     responses:
 *       "200":
 *         description: Successful operation
 * /videos/{id}/favorite:
 *   post:
 *     summary: Favorite video
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         minimum: 1
 *         description: Video id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               favorite:
 *                  type: boolean
 *     responses:
 *       "200":
 *         description: Successful operation
 * /videos/favorite:
 *   get:
 *     summary: Get user favorite videos
 *     tags: [Videos]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type:
 *               items:
 *                 $ref: '#/components/schemas/Video'
* /videos/like:
 *   get:
 *     summary: Get user like videos
 *     tags: [Videos]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type:
 *               items:
 *                 $ref: '#/components/schemas/Video'  
*/
module.exports = (router, client) => {
    router.get("/videos", async (req, res) => {
        let results;
        if (req.query.sort == "new")
            results = await client.query("select * from video order by upload_date desc");
        else
            results = await client.query("select * from video");
        res.status(200);
        res.send(JSON.stringify(results.rows));
    });
    router.get("/videos/history", async (req, res) => {
        let results;
        if (req.query.sort == "new")
            results = await client.query("select * from video v join watch w on v.id = w.video_id where w.user_id =$1 order by upload_date desc", [req.user.id]);
        else
            results = await client.query("select * from video v join watch w on v.id = w.video_id where w.user_id =$1", [req.user.id]);
        res.status(200);
        res.send(JSON.stringify(results.rows));
    });
    router.post("/videos", async (req, res) => {
        const url = req.body.url;
        const title = req.body.title;
        const description = req.body.description;
        const category_id = req.body.category_id;
        const date = new Date();

        const results = await client.query("insert into video (url,title,description,category_id,user_id,upload_date) values($1,$2,$3,$4,$5,$6::timestamp)", [url, title, description, category_id, req.user.id, date.toISOString().split('T')[0]]);
        res.status(200);
        res.send("Video uploaded");
    });
    router.get("/videos/favorite", async (req, res) => {
        const results = await client.query("select * from (select video_id from watch where user_id = $1 and favorite = true) w inner join video v on v.id = w.video_id", [req.user.id]);
        res.status(200);
        res.send(JSON.stringify(results.rows));
    });
    router.get("/videos/like", async (req, res) => {
        const results = await client.query("select * from (select video_id from watch where user_id = $1 and like_dislike = true) w inner join video v on v.id = w.video_id", [req.user.id]);
        res.status(200);
        res.send(JSON.stringify(results.rows));
    });
    router.post("/videos/:id/like", async (req, res) => {
        const results = await client.query("update watch set like_dislike = $1 where user_id =$2 and video_id = $3", [req.body.like, req.user.id, req.params.id]);
        res.status(200);
        res.send("Video like/dislike");
    });
    router.post("/videos/:id/favorite", async (req, res) => {
        const results = await client.query("update watch set favorite=$1 where user_id =$2 and video_id = $3", [req.body.favorite, req.user.id, req.params.id]);
        res.status(200);
        res.send("Video favorite");
    });
    router.get("/videos/:id", async (req, res) => {
        const date = new Date();
        await client.query("insert into watch (user_id,video_id,watch_date) values ($1, $2 ,$3::timestamp)", [req.user.id, req.params.id, date.toISOString().split('T')[0]]);
        const results = await client.query("select * from video where id = $1", [req.params.id]);
        res.status(200);
        res.send(JSON.stringify(results.rows));
    });
}