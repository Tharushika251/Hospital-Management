const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');
const pdfKit = require('pdfkit');
const fs = require('fs');

// Admin: Add a new medical record
exports.addRecord = async (req, res) => {
    try {
        // Destructure the necessary fields from the request body
        const { patientId, dateOfVisit, reasonForVisit, hospital, attendingDoctor, diagnosis } = req.body;

        // Check if the user exists and is a patient
        const patient = await User.findById(patientId);
        if (!patient || patient.role !== 'patient') {
            return res.status(400).json({ msg: 'Invalid patient' });
        }

        // Create a new medical record
        const newRecord = new MedicalRecord({
            patientId,
            dateOfVisit,
            reasonForVisit,
            hospital,
            attendingDoctor,
            diagnosis
        });

        await newRecord.save();
        res.json(newRecord);
    } catch (error) {
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
};

// Admin: View all medical records
exports.getAllRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.find().populate('patientId', 'username');
        res.json(records);
    } catch (error) {
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
};

// Admin: Generate PDF Report
exports.generatePDF = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id).populate('patientId', 'username');
        if (!record) {
            return res.status(404).json({ msg: 'Record not found' });
        }

        const doc = new pdfKit();
        const filePath = `./pdfs/${record.patientId.username}_Report.pdf`;

        // Create PDF content
        doc.pipe(fs.createWriteStream(filePath));
        doc.text(`Medical Report for ${record.patientId.username}`);
        doc.text(`Date of Visit: ${new Date(record.dateOfVisit).toLocaleDateString()}`);
        doc.text(`Reason for Visit: ${record.reasonForVisit}`);
        doc.text(`Hospital: ${record.hospital}`);
        doc.text(`Attending Doctor: ${record.attendingDoctor}`);
        doc.text(`Diagnosis: ${record.diagnosis}`);
        doc.end();

        // After the PDF is generated, send it as a response
        res.download(filePath, (err) => {
            if (err) {
                console.error("Error downloading the PDF:", err);
                res.status(500).send("Error downloading the PDF.");
            }
        });
    } catch (error) {
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
};

exports.getPatients = async (req, res) => {
    try {
        const patients = await User.find({ role: 'patient' });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
};