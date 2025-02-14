import axios from "axios";
import crypto from "crypto";
import querystring from "querystring";
import paypal from "@paypal/checkout-server-sdk";

import { stripe } from "../libs/stripe.js";
import { paypalClient } from "../libs/paypal.js";
import { sendEmail } from "../utils/sendMail.js";

const handleStripePayment = async (req, res) => {
  const { amount, currency, paymentMethodId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
    });

    res.status(200).json({
      meta: { message: "Stripe payment successful" },
      data: { paymentIntent },
    });
  } catch (error) {
    console.error("Stripe payment error:", error);
    res.status(500).json({
      meta: { message: "Stripe payment failed", errors: error.message },
    });
  }
};

const handlePayPalPayment = async (req, res) => {
  const { amount, currency } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toString(),
        },
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    res.status(200).json({
      meta: { message: "PayPal payment initiated" },
      data: { result: order.result },
    });
  } catch (error) {
    console.error("PayPal payment error:", error);
    res.status(500).json({
      meta: { message: "PayPal payment failed", errors: error.message },
    });
  }
};

const handleVNPayPayment = async (req, res) => {
  const { amount, orderId, returnUrl } = req.body;
  const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const vnp_HashSecret = `${process.env.VNPAY_HASH_SECRET}`;

  const params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: `${process.env.TMN_CODE}`,
    vnp_Amount: amount * 100,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: "Payment for order #" + orderId,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: req.ip,
    vnp_CreateDate: new Date().toISOString().slice(0, 19).replace(/T|-|:/g, ""),
  };

  const sortedParams = Object.keys(params)
    .sort()
    .reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {});

  const queryString = querystring.stringify(sortedParams);
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const secureHash = hmac
    .update(Buffer.from(queryString, "utf-8"))
    .digest("hex");

  const paymentUrl = `${vnp_Url}?${queryString}&vnp_SecureHash=${secureHash}`;
  res.status(200).json({
    meta: { message: "VNPay payment URL generated" },
    data: { paymentUrl },
  });
};

const handleMomoPayment = async (req, res) => {
  const { amount, orderId, returnUrl } = req.body;
  const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
  const partnerCode = `${process.env.MOMO_PARTNER_CODE}`;
  const accessKey = `${process.env.MOMO_ACCESS_KEY}`;
  const secretKey = `${process.env.MOMO_SECRET_KEY}`;

  const requestBody = {
    partnerCode,
    accessKey,
    requestId: orderId,
    amount: amount.toString(),
    orderId,
    orderInfo: "Payment for order #" + orderId,
    returnUrl,
    notifyUrl: `${process.env.MOMO_NOTIFY_URL}`,
    requestType: "captureWallet",
    signature: "",
  };

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&orderId=${orderId}&orderInfo=${requestBody.orderInfo}&partnerCode=${partnerCode}&requestId=${orderId}&returnUrl=${returnUrl}`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");
  requestBody.signature = signature;

  try {
    const response = await axios.post(endpoint, requestBody);
    res.status(200).json({
      meta: { message: "Momo payment URL generated" },
      data: { result: response.data },
    });
  } catch (error) {
    console.error("Momo payment error:", error);
    res.status(500).json({
      meta: { message: "Momo payment failed", errors: error.message },
    });
  }
};

export const checkout = async (req, res) => {
  const { paymentMethod, orderId, userEmail, amount, currency } = req.body;

  try {
    let paymentResult;

    switch (paymentMethod) {
      case "stripe":
        paymentResult = await handleStripePayment(req, res);
        break;
      case "paypal":
        paymentResult = await handlePayPalPayment(req, res);
        break;
      case "vnpay":
        paymentResult = await handleVNPayPayment(req, res);
        break;
      case "momo":
        paymentResult = await handleMomoPayment(req, res);
        break;
      default:
        return res.status(400).json({
          meta: { message: "Invalid payment method", errors: true },
        });
    }

    if (paymentResult.success) {
      const subject = "Payment Successful";
      const text = `Your payment of ${amount} ${currency} for Order ${orderId} was successful.`;
      const html = `<p>Your payment of <strong>${amount} ${currency}</strong> for Order <strong>${orderId}</strong> was successful.</p>`;

      await sendEmail(userEmail, subject, text, html);

      return res.status(200).json({
        meta: {
          message: "Payment processed successfully, email sent to user",
        },
        data: {
          transactionId: paymentResult.transactionId,
        },
      });
    } else {
      return res.status(400).json({
        meta: {
          message: "Payment failed, please try again",
          errors: true,
        },
      });
    }
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({
      meta: {
        message: "Payment processing failed",
        errors: error.message || error,
      },
    });
  }
};
