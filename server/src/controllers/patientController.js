import PatientProfile from '../models/PatientProfile.js';
import User from '../models/User.js';

// @desc    Get all patients
// @route   GET /api/v1/patients
// @access  Private/Admin/Doctor
export const getPatients = async (req, res, next) => {
  try {
    const query = {};
    
    // If doctor, only return assigned patients or patients they have seen. 
    // For simplicity in this endpoint, we might let doctors search all patients to assign them, 
    // or restrict it. Let's restrict to all for search, but viewing details is restricted by ABAC.
    
    const patients = await PatientProfile.find(query).populate('user', 'name email phone gender dateOfBirth profileImage');
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient profile by ID (user ID)
// @route   GET /api/v1/patients/:patientId
// @access  Private
export const getPatientProfile = async (req, res, next) => {
  try {
    const profile = await PatientProfile.findOne({ user: req.params.patientId })
      .populate('user', 'name email phone gender dateOfBirth profileImage isActive')
      .populate('assignedDoctors');
      
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update patient profile
// @route   POST /api/v1/patients/:patientId
// @access  Private (Patient themselves or Admin)
export const updatePatientProfile = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.patientId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { bloodGroup, emergencyContact, insuranceProvider, insuranceNumber } = req.body;

    let profile = await PatientProfile.findOne({ user: req.params.patientId });

    if (profile) {
      // Update
      profile.bloodGroup = bloodGroup || profile.bloodGroup;
      profile.emergencyContact = emergencyContact || profile.emergencyContact;
      profile.insuranceProvider = insuranceProvider || profile.insuranceProvider;
      profile.insuranceNumber = insuranceNumber || profile.insuranceNumber;
      await profile.save();
    } else {
      // Create
      profile = await PatientProfile.create({
        user: req.params.patientId,
        patientId: `PAT-${Date.now()}`,
        bloodGroup,
        emergencyContact,
        insuranceProvider,
        insuranceNumber,
      });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Get allergies for a patient
// @route   GET /api/v1/patients/:patientId/allergies
// @access  Private (Patient themselves, assigned Doctor, or Admin)
export const getPatientAllergies = async (req, res, next) => {
  try {
    const Allergy = (await import('../models/Allergy.js')).default;
    const allergies = await Allergy.find({ patient: req.params.patientId })
      .populate('recordedBy', 'name');
    res.status(200).json({ success: true, data: allergies });
  } catch (error) {
    next(error);
  }
};

// @desc    Add allergy for a patient
// @route   POST /api/v1/patients/:patientId/allergies
// @access  Private (Doctor only)
export const addPatientAllergy = async (req, res, next) => {
  try {
    const Allergy = (await import('../models/Allergy.js')).default;
    const { allergen, type, severity, reaction, notes } = req.body;

    if (!allergen) {
      return res.status(400).json({ success: false, message: 'Allergen is required' });
    }

    const allergy = await Allergy.create({
      patient: req.params.patientId,
      allergen,
      type,
      severity,
      reaction,
      notes,
      recordedBy: req.user._id
    });

    res.status(201).json({ success: true, data: allergy });
  } catch (error) {
    next(error);
  }
};

// @desc    Get medical conditions for a patient
// @route   GET /api/v1/patients/:patientId/conditions
// @access  Private (Patient themselves, assigned Doctor, or Admin)
export const getPatientConditions = async (req, res, next) => {
  try {
    const MedicalCondition = (await import('../models/MedicalCondition.js')).default;
    const conditions = await MedicalCondition.find({ patient: req.params.patientId })
      .populate('diagnosedBy', 'name');
    res.status(200).json({ success: true, data: conditions });
  } catch (error) {
    next(error);
  }
};

// @desc    Add medical condition for a patient
// @route   POST /api/v1/patients/:patientId/conditions
// @access  Private (Doctor only)
export const addPatientCondition = async (req, res, next) => {
  try {
    const MedicalCondition = (await import('../models/MedicalCondition.js')).default;
    const { conditionName, diagnosisDate, status, severity, notes } = req.body;

    if (!conditionName) {
      return res.status(400).json({ success: false, message: 'Condition name is required' });
    }

    const condition = await MedicalCondition.create({
      patient: req.params.patientId,
      conditionName,
      diagnosisDate: diagnosisDate || new Date(),
      status,
      severity,
      notes,
      diagnosedBy: req.user._id
    });

    res.status(201).json({ success: true, data: condition });
  } catch (error) {
    next(error);
  }
};
