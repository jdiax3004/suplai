//Libraries
const express = require("express");
const router = express.Router();

//Methods
const { ensureAuthenticated } = require("../auth");

//Models
const Requisition = require("../models/requisition");

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

//[POST] Create Requisitions
router.post("/addRequisition", ensureAuthenticated, (req, res) => {
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
      owner: req.user._id
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
