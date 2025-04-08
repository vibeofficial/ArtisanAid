const { createMessage } = require('../controllers/contactUs');

const router = require('express').Router();


/**
 * @swagger
 * /contact/us:
 *   post:
 *     summary: Send a contact/feedback message
 *     description: Allows users to send a message via the contact form. The message is saved and emailed to the designated recipient.
 *     tags:
 *       - Contact Us
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - message
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "Jane Doe"
 *                 description: Full name of the sender.
 *               email:
 *                 type: string
 *                 example: "janedoe@sample.com"
 *                 description: Email address of the sender.
 *               message:
 *                 type: string
 *                 example: "I would like to inquire about your services."
 *                 description: Message or feedback content.
 *     responses:
 *       '201':
 *         description: Message sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message sent successfully"
 *       '500':
 *         description: Server error while sending message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating Contact Us message"
 */
router.post('/contact/us', createMessage);


module.exports = router;