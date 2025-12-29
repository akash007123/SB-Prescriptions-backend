require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Prescription = require('./models/Prescription');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Enable CORS for all origins
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Routes

// GET /api/prescriptions - Get all prescriptions
app.get('/api/prescriptions', async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// GET /api/prescriptions/:id - Get a single prescription
app.get('/api/prescriptions/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prescription' });
  }
});

// POST /api/prescriptions - Create a new prescription
app.post('/api/prescriptions', async (req, res) => {
  try {
    const { patientData, medicines, note } = req.body;
    if (!patientData || !medicines) {
      return res.status(400).json({ error: 'Patient data and medicines are required' });
    }
    const newPrescription = new Prescription({ patientData, medicines, note: note || '' });
    await newPrescription.save();
    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create prescription' });
  }
});

// PUT /api/prescriptions/:id - Update a prescription
app.put('/api/prescriptions/:id', async (req, res) => {
  try {
    const { patientData, medicines, note } = req.body;
    if (!patientData || !medicines) {
      return res.status(400).json({ error: 'Patient data and medicines are required' });
    }
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { patientData, medicines, note: note || '' },
      { new: true }
    );
    if (!updatedPrescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.json(updatedPrescription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update prescription' });
  }
});

// DELETE /api/prescriptions/:id - Delete a prescription
app.delete('/api/prescriptions/:id', async (req, res) => {
  try {
    const deletedPrescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!deletedPrescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete prescription' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});