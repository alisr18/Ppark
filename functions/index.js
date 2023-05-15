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

exports.createPaymentIntent = functions.https.onRequest(async (request, response) => {
    const { amount } = request.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
    });

    response.send({
        clientSecret: paymentIntent.client_secret,
    });
});
