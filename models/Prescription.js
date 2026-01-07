const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  id: Number,
  name: String,
  dose: String,
});

const patientDataSchema = new mongoose.Schema({
  name: String,
  age: String,
  gender: String,
  diagnosis: String,
  date: Date,
  place: String,
});

const prescriptionSchema = new mongoose.Schema({
  patientData: patientDataSchema,
  medicines: [medicineSchema],
  note: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);