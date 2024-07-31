// src/routes/RechargeRoutes.mjs
import express from 'express';
import PaymentController from '../controllers/PaymentController.mjs';
import Middleware from '../project_setup/Middleware.mjs'

const router = express.Router();

// POST /Route to create a new payment request
router.post('/createPayment', Middleware.user, PaymentController.createPayment);

// GET /Route to get all the payments
router.get('/getAllPayments', Middleware.admin, PaymentController.getAllPayments);

// GET /Route to get a payment by paymentId
router.get('/getPaymentByPaymentId/:paymentId', Middleware.admin, PaymentController.getPaymentByPaymentId);

// PUT /Route to update a payment by paymentId
router.put('/updatePaymentByPaymentId/:paymentId', Middleware.admin, PaymentController.updatePaymentByPaymentId);

// DELET /Route to delete a payment by paymentId
router.delete('/deletePaymentByPaymentId/:paymentId', Middleware.admin, PaymentController.deletePaymentByPaymentId);

export default router;
