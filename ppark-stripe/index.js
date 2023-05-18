/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require("firebase-functions");
const stripe = require("stripe")("sk_test_51N6fSEKQs9J7J5wlYNWINitEm62EWudMnxQ9qLO1tCGoTKUKQe47dqmZ3UTwLzLZDMwdvNvU2Wa6rFsqenLGUIQW00Es8Cx6VH");
const cors = require('cors')({origin: true});

exports.createPaymentIntent = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        if(request.method !== 'POST') {
            response.status(400).send('Invalid request method!');
            return;
        }

        const { amount } = request.body;

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'nok',
            });

            response.status(200).send({clientSecret: paymentIntent.client_secret});
        } catch(error) {
            response.status(500).send({error: error.message});
        }
    });
});