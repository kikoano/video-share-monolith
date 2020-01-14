//Routes
/**
 * @swagger
 * components:
 *   schemas:
 *     Playlist:
 *       type: object
 *       properties:
 *         id:
 *            type: integer
 *         user_id:
 *            type: integer
 *         playlist_name:
 *            type: string
 *   requestBodies:
 *     PlaylistBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playlist_name:
 *                  type: string
 */