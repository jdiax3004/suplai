//Libraries
const express = require("express");
const router = express.Router();

//Methods
const { ensureAuthenticated } = require("../auth");

//Models
const Requisition = require("../models/requisition");
const User = require("../models/user");

//[GET] Read Requisitions
router.get("/requisitions", ensureAuthenticated, async (req, res) => {
  try {
    var requisitions;
    if (req.user.type == "admin") {
      console.log("ADMIN");
      var requisitions = await Requisition.find().populate({
        path: "owner",
        populate: {
          path: "boss"
        }
      });
    } else {
      var requisitions = await Requisition.find({
        owner: req.user._id
      }).populate({
        path: "owner",
        populate: {
          path: "boss"
        }
      });
    }
    return res.status(200).json(requisitions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//[GET] Read Requisitions
router.get("/requisitionsChecker", ensureAuthenticated, async (req, res) => {
  try {
    var requisitions = await Requisition.find({
      checker: req.user._id
    }).populate({
      path: "owner",
      populate: {
        path: "boss"
      }
    });

    return res.status(200).json(requisitions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//[GET] Read a Requisition
router.get("/requisitions/:id", ensureAuthenticated, async (req, res) => {
  try {
    var requisition;
    if (req.user.type == "admin") {
      console.log("ADMIN");
      requisition = await Requisition.findById(req.params.id).populate({
        path: "owner",
        populate: {
          path: "boss"
        }
      });
    } else {
      requisition = await Requisition.findById(req.params.id).populate({
        path: "owner",
        populate: {
          path: "boss"
        }
      });
    }
    return res.status(200).json(requisition);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//[POST] Create Requisitions
router.post("/requisition", ensureAuthenticated, (req, res) => {
  const { title, description, budget } = req.body;
  let errors = [];

  //Check required fields
  if (!title || !description || !budget) {
    errors.push({ msg: "Please fill in all fields" });
  }

  if (errors.length !== 0) {
    res.status(400).send(errors);
  } else {
    const newReq = new Requisition({
      title: title,
      description: description,
      budget: budget,
      owner: req.user._id,
      checker: req.user.boss._id
    });
    newReq
      .save()
      .then(req => {
        //TODO
        console.log(newReq);
        res.send("New Requisition Added: " + title);
      })
      .catch(err => console.log(err));
  }
});

// [PUT] Update User
router.put("/requisition/:id", async (req, res) => {
  try {
    const requesition = await Requisition.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    );
    if (!requesition) {
      res.status(404).send();
    }
    res.send(requesition);
  } catch (error) {
    res.status(404).send(e);
  }
});

// [PUT] Update User
router.put("/requisitionFinancer/:id", async (req, res) => {
  try {
    var budget = req.body.budget;
    var tierUser = "";

    if (budget <= 100000) {
      tierUser = "1";
    } else if (budget > 100000 || budget <= 1000000) {
      tierUser = "2";
    } else {
      tierUser = "3";
    }
    console.log(budget);
    console.log(tierUser);

    const financerID = await User.findOne(
      { tier: tierUser },
      function(err, docs) {}
	);
	
    console.log(financerID._id);
    const requesition = await Requisition.findByIdAndUpdate(
      req.params.id,
      { checker: financerID._id },
      {
        new: true
      }
    );
    if (!requesition) {
      res.status(404).send();
    }
    res.send(requesition);
  } catch (error) {
    res.status(404).send(error);
  }
});

// [DELETE] Delete User
router.delete("/requisition/:id", async (req, res) => {
  try {
    const requisition = await Requisition.findByIdAndDelete(req.params.id);
    if (!requisition) {
      res.status(404).send();
    }
    res.send("Requisition Deleted: " + requisition.title);
  } catch (error) {
    res.status(404).send(e);
  }
});

module.exports = router;
