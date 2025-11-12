import { db } from "../db/db.js";

const formatResponse = (status, message, data = null, error = null, response_token = null) => {
  return {
    status: status ? 1 : 0,
    message,
    error,
    data,
    response_token
  };
};

// GET all clinic patients
export const getAllClinicPatients = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM clinic_patient");
    res.json(formatResponse(1, "Clinic patients fetched successfully", rows));
  } catch (error) {
    res.status(500).json(formatResponse(0, "Error retrieving clinic patients", null, error.message));
  }
};

// GET clinic patient by ID
export const getClinicPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM clinic_patient WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json(formatResponse(0, "Clinic patient not found"));
    }
    res.json(formatResponse(1, "Clinic patient details fetched successfully", rows[0]));
  } catch (error) {
    res.status(500).json(formatResponse(0, "Error retrieving clinic patient", null, error.message));
  }
};

// GET clinic patients by clinic ID
export const getClinicPatientsByClinicId = async (req, res) => {
  const { clinicId } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM clinic_patient WHERE clinic_id_fk = ?", [clinicId]);
    res.json(formatResponse(1, "Clinic patients fetched successfully", rows));
  } catch (error) {
    res.status(500).json(formatResponse(0, "Error retrieving clinic patients", null, error.message));
  }
};

// POST create new clinic patient
export const createClinicPatient = async (req, res) => {
  const {
    clinic_id_fk,
    patients_id_fk,
    cp_id,
    cp_id_seq_no,
    primary_member_id,
    title,
    name,
    gender,
    age,
    dob,
    phone_number,
    email,
    national_id_type,
    national_id,
    address_line_1,
    locality,
    abha,
    occupation,
    is_checkin_form_filledup,
    checkin_form_data
  } = req.body;

  // Required fields validation
  if (!clinic_id_fk || !name || !gender || !age || !phone_number) {
    return res.status(400).json(formatResponse(0, "Required fields are missing"));
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO clinic_patient (
        clinic_id_fk, patients_id_fk, cp_id, cp_id_seq_no, primary_member_id, title, name,
        gender, age, dob, phone_number, email, national_id_type, national_id, address_line_1,
        locality, abha, occupation, is_checkin_form_filledup, checkin_form_data, create_datetime
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        clinic_id_fk,
        patients_id_fk || null,
        cp_id || '',
        cp_id_seq_no || 0,
        primary_member_id || null,
        title || '',
        name,
        gender,
        age,
        dob || null,
        phone_number,
        email || '',
        national_id_type || '',
        national_id || '',
        address_line_1 || '',
        locality || '',
        abha || '',
        occupation || '',
        is_checkin_form_filledup || 0,
        checkin_form_data || null
      ]
    );

    const patientData = {
      id: result.insertId,
      clinic_id_fk,
      patients_id_fk,
      cp_id,
      cp_id_seq_no,
      primary_member_id,
      title,
      name,
      gender,
      age,
      dob,
      phone_number,
      email,
      national_id_type,
      national_id,
      address_line_1,
      locality,
      abha,
      occupation,
      is_checkin_form_filledup,
      checkin_form_data
    };

    res.status(201).json(formatResponse(1, "Clinic patient created successfully", patientData));
  } catch (error) {
    res.status(500).json(formatResponse(0, "Error creating clinic patient", null, error.message));
  }
};

// PUT update clinic patient
export const updateClinicPatient = async (req, res) => {
  const { id } = req.params;
  const {
    clinic_id_fk,
    patients_id_fk,
    cp_id,
    cp_id_seq_no,
    primary_member_id,
    title,
    name,
    gender,
    age,
    dob,
    phone_number,
    email,
    national_id_type,
    national_id,
    address_line_1,
    locality,
    abha,
    occupation,
    is_checkin_form_filledup,
    checkin_form_data
  } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE clinic_patient SET 
        clinic_id_fk = ?, patients_id_fk = ?, cp_id = ?, cp_id_seq_no = ?, primary_member_id = ?,
        title = ?, name = ?, gender = ?, age = ?, dob = ?, phone_number = ?, email = ?,
        national_id_type = ?, national_id = ?, address_line_1 = ?, locality = ?, abha = ?,
        occupation = ?, is_checkin_form_filledup = ?, checkin_form_data = ?, update_datetime = NOW()
      WHERE id = ?`,
      [
        clinic_id_fk,
        patients_id_fk || null,
        cp_id || '',
        cp_id_seq_no || 0,
        primary_member_id || null,
        title || '',
        name,
        gender,
        age,
        dob || null,
        phone_number,
        email || '',
        national_id_type || '',
        national_id || '',
        address_line_1 || '',
        locality || '',
        abha || '',
        occupation || '',
        is_checkin_form_filledup || 0,
        checkin_form_data || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json(formatResponse(0, "Clinic patient not found"));
    }

    // Fetch updated patient data
    const [updatedRows] = await db.execute("SELECT * FROM clinic_patient WHERE id = ?", [id]);
    
    res.json(formatResponse(1, "Clinic patient updated successfully", updatedRows[0]));
  } catch (error) {
    res.status(500).json(formatResponse(0, "Error updating clinic patient", null, error.message));
  }
};

// DELETE clinic patient
export const deleteClinicPatient = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute("DELETE FROM clinic_patient WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json(formatResponse(0, "Clinic patient not found"));
    }
    
    res.json(formatResponse(1, "Clinic patient deleted successfully"));
  } catch (error) {
    res.status(500).json(formatResponse(0, "Error deleting clinic patient", null, error.message));
  }
};