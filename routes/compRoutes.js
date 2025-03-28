const express = require("express");
const {
  createCompSet,
  getCompSets,
  updateCompSet,
  getCompSet,
  deleteCompSet
} = require("../db/compSets");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const compSet = await createCompSet(req.db, req.body);

    console.log("CREATED COMP SET:  ", compSet);

    return res.json(compSet);
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
});

router.post("/edit", async (req, res) => {
  try {
    const compSet = await updateCompSet(req.db, req.body.id, req.body);

    console.log("Updated COMP SET:  ", compSet);

    return res.json(compSet);
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
});

router.get("/", async (req, res) => {
  try {
    const compSet = await getCompSets(req.db);

    console.log("GET COMP SET:  ", compSet);

    return res.json(compSet);
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log("RE PARAMS: ", req.params);
    const compSet = await getCompSet(req.db, req.params.id);

    console.log("GET COMP SET:  ", compSet);

    return res.json(compSet);
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
});

router.post("/:id", async (req, res) => {
  try {
    console.log("RE PARAMS: ", req.params);
    const compSet = await updateCompSet(req.db, req.params.id, req.body);

    console.log("UPDATE COMP SET:  ", compSet);

    return res.json(compSet);
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
});

router.delete("/:id", async (req, res) => {
  try {
    console.log("RE PARAMS: ", req.params);
    const compSet = await deleteCompSet(req.db, req.params.id);

    console.log("GET COMP SET:  ", compSet);

    return res.json(compSet);
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
});

module.exports = router;
