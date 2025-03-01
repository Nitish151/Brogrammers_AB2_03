import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female"] },
    bloodType: { type: String, required: true },
    medicalCondition: { type: String, required: true },
    dateOfAdmission: { type: Date, required: true },
    doctorName: { type: String, required: true },
    hospitalName: { type: String, required: true },
    insuranceProvider: { type: String, required: true },
    billingAmount: { type: Number, required: true },
});

export default mongoose.model("Patient", PatientSchema);