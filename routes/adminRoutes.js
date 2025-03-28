const express = require("express");
const { findAdmin } = require("../db/admins");
const { updateShuffle } = require("@db");
const {
  sign,
  checkJwtMiddleware,
  getNftInventory,
  scheduleShuffleOpen,
  scheduleShuffleClose,
  getWeekDayFromNumber,
  formatTime,
} = require("@util");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const admin = await findAdmin(req.db, req.body.addr);
    console.log(admin, "ADMIN RES");
    if (admin.admin) {
      const token = sign({ admin });
      return res.status(201).json({ admin, token });
    }
    return res.status(401).json({ error: "User not an admin" });
  } catch (e) {
    console.error(e);
  }
});

router.post("/update-shuffle", checkJwtMiddleware, async (req, res) => {
  try {
    const updates = await updateShuffle(req.db, req.body.addr, req.body.fields);

    console.log(updates, "JWT CHECK WORKED");
    return res.status(201).json(updates);
  } catch (e) {
    console.error(e);
    return res.status(401).json({ e });
  }
});

router.post("/update-assets", checkJwtMiddleware, async (req, res) => {
  try {
    const { addr, numAssets, price } = req.body;
    const assets = await getNftInventory(addr, numAssets);

    const fields = {
      availableAssets: assets,
      totalAssets: assets.length,
      entryPrice: price,
    };

    // console.log(assets, "ASSETS");
    const updates = await updateShuffle(req.db, addr, fields);

    return res.status(201).json({ assets, updates });
  } catch (e) {
    console.error(e);
    return res.status(401).json({ e });
  }
});

router.post("/schedule-shuffle", checkJwtMiddleware, async (req, res) => {
  try {
    const { min, closeMin, closeHour, hour, weekDay, closeWeekDay, addr } = req.body;
    scheduleShuffleOpen(req.db, addr, min, hour, weekDay);
    scheduleShuffleClose(req.db, addr, closeMin, closeHour, closeWeekDay);

    const fields = {
      schedule: {
        open: { day: getWeekDayFromNumber(weekDay), time: formatTime(hour, min) },
        close: { day: getWeekDayFromNumber(closeWeekDay), time: formatTime(closeHour, closeMin) },
      },
    };

    const updates = await updateShuffle(req.db, addr, fields);

    return res.status(201).json({ status: "okay", update: updates });
  } catch (e) {
    console.error(e);
    return res.status(401).json({ e });
  }
});

module.exports = router;
