const express = require('express');

const { sendSms, generateOTP, verifyOTP, sign, verify } = require('@util');
const { findOrCreateWorker, getWorkerCustom } = require('@db');

const router = express.Router();

// YOUR FRONT END REQUESTS MUST BEGIN WITH /authentication IN ORDER TO ACCESS THESE ROUTES
// example: /authentication/route-on-this-page

router.post('/mobile-verification', async (req, res) => {
  try {
    const phone = req.body.phone;

    if (!phone) {
      throw new Error('Bad params');
    }

    const otp = await generateOTP();
    console.log(otp, 'otp.token is the 6-digit auth code');

    const message = `Hello! Your authentication code for Roger's Snow Removal is: ${otp.token} It will expire in 1 minute.`;

    const sms = await sendSms(message, phone);

    if (sms.status === 'queued') {
      return res.status(200).json({ key: otp.secretKey, phone: phone });
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.post('/authenticate-user', async (req, res) => {
  try {
    let { authCode, key, phone, location } = req.body;

    if (!authCode || !location) {
      throw new Error('Your request is missing an authorization code and/or location');
    }

    const verified = await verifyOTP(authCode, key);

    if (verified) {
      // If phone number already has a country code prefix: '1', do nothing
      // otherwise- prepend a '1' (US country code) to the phone number
      phone = phone.charAt(0) === '1' && phone.length === 11 ? phone : '1' + phone;

      switch (location) {
        case 'worker_app':
          const token = sign({ phone, location });
          const worker = await findOrCreateWorker(req.db, phone);
          return res.status(201).json({ worker: worker.value, token });
        case 'admin_dashboard':
          // create function for finding or creating an admin
          // const admin = await yourFunc(req.db, phone);
          // const token = sign({ phone, location });
          // res.send({ admin: admin.value, token });
          return res.status(201).json('Admin object goes here');
        default:
          throw new Error('You do not have a valid location.');
      }
    } else {
      const error = { message: 'Incorrect verification code. Please try again.' };
      return res.status(401).json(error);
    }
  } catch (err) {
    console.log(err);
  }
});

// Verifies that the user is sending from a valid location (worker app or admin dashboard)
// Verifies the given token's validity before retrieving and sending the worker/admin object
// This essentially 'signs a user in' or validates that they are currently in a session.
router.get('/verify-user/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    const { phone, location } = await verify(token);

    switch (location) {
      case 'worker_app':
        const worker = await getWorkerCustom(req.db, { phone: phone }); // retrieve a worker with a matching phone #
        return res.status(201).json(worker[0]);
      case 'admin_dashboard':
        // create a findAdminByPhoneNo func
        // user = await yourFunc(req.db, { phone: decoded.phone });
        return res.status(201).json('Admin object goes here');
      default:
        return new Error('Request not valid');
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
