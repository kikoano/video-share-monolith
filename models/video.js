//Routes
/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         id:
 *            type: integer
 *         url:
 *            type: string
 *         title:
 *            type: string
 *         description:
 *            type: string
 *         category_id:
 *            type: integer
 *         user_id:
 *            type: integer
 *         upload_date:
 *            type: date-time
 *   requestBodies:
 *     VideoBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                  type: string
 *               title:
 *                  type: string
 *               description:
 *                  type: string
 *               category_id:
 *                  type: integer
 */