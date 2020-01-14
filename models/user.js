//Routes
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *            type: integer
 *         username:
 *            type: string
 *         user_password:
 *            type: string
 *            format: password
 *         first_name:
 *            type: string
 *         last_name:
 *            type: string
 *         email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *         avatar_imgurl:
 *            type: string
 *   requestBodies:
 *     UserRegisterBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                  type: string
 *               user_password:
 *                  type: string
 *                  format: password
 *               first_name:
 *                  type: string
 *               last_name:
 *                  type: string
 *               email:
 *                  type: string
 *                  format: email
*     UserLoginBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                  type: string
 *               user_password:
 *                  type: string
 *                  format: password
 */