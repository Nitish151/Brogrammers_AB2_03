import express from "express";
import Patient from "../models/Patient.js";

const router = express.Router();

// Create a new patient
router.post("/", async (req, res) => {  // This should be "/" NOT "/patients"
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json({ success: true, message: "Patient created successfully", patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
      const patients = await Patient.find();
      res.status(200).json({ success: true, patients });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
});

export default router;