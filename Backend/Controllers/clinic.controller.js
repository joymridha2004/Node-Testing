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

// GET all clinics
export const getAllClinics = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM clinic WHERE status = 1");
    res.json(formatResponse(1, "Clinics fetched successfully", rows));
  } catch (error) {
    res.status(500).json(formatResponse(0, "Error retrieving clinics", null, error.message));
  }
};

// GET clinic by ID
export const getClinicById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM clinic WHERE id = ? AND status = 1", [id]);
    if (rows.length === 0) {
      return res.status(404).json(formatResponse(0, "Clinic not found"));
    }
    res.json(formatResponse(1, "Clinic details fetched successfully", rows[0]));
  } catch (error) {
    res.status(500).json(formatResponse(0, "Error retrieving clinic", null, error.message));
  }
};

// POST create new clinic
export const createClinic = async (req, res) => {
  const {
    users_login_id_fk,
    invoice_prefix,
    reciept_prefix,
    name,
    type,
    operational_type,
    logo,
    phonenumber_1,
    whatsapp_no,
    emergency_contact_no,
    contact_name,
    email,
    address_line_1,
    city,
    pincode,
    district,
    state,
    gst,
    clinic_charge,
    timings,
    social_media_url,
    website_url,
    disclaimer,
    is_it_democlinic
  } = req.body;

  // Required fields validation
  if (!users_login_id_fk || !name || !phonenumber_1 || !email || !address_line_1 || !city || !pincode || !district || !state) {
    return res.status(400).json(formatResponse(0, "Required fields are missing"));
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO clinic (
        users_login_id_fk, invoice_prefix, reciept_prefix, name, type, operational_type, logo,
        phonenumber_1, whatsapp_no, emergency_contact_no, contact_name, email, address_line_1,
        city, pincode, district, state, gst, clinic_charge, timings, social_media_url,
        website_url, disclaimer, is_it_democlinic, create_datetime
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        users_login_id_fk,
        invoice_prefix || null,
        reciept_prefix || null,
        name,
        type || null,
        operational_type || null,
        logo || '',
        phonenumber_1,
        whatsapp_no || null,
        emergency_contact_no || null,
        contact_name || null,
        email,
        address_line_1,
        city,
        pincode,
        district,
        state,
        gst || 0,
        clinic_charge || 0,
        timings || '',
        social_media_url || null,
        website_url || null,
        disclaimer || null,
        is_it_democlinic || 0
      ]
    );

    const clinicData = {
      id: result.insertId,
      users_login_id_fk,
      invoice_prefix,
      reciept_prefix,
      name,
      type,
      operational_type,
      logo,
      phonenumber_1,
      whatsapp_no,
      emergency_contact_no,
      contact_name,
      email,
      address_line_1,
      city,
      pincode,
      district,
      state,
      gst,
      clinic_charge,
      timings,
      social_media_url,
      website_url,
      disclaimer,
      is_it_democlinic,
      status: 1
    };

    res.status(201).json(formatResponse(1, "Clinic created successfully", clinicData));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json(formatResponse(0, "Clinic with same details already exists"));
    }
    res.status(500).json(formatResponse(0, "Error creating clinic", null, error.message));
  }
};

// PUT update clinic
export const updateClinic = async (req, res) => {
  const { id } = req.params;
  const {
    invoice_prefix,
    reciept_prefix,
    name,
    type,
    operational_type,
    logo,
    phonenumber_1,
    whatsapp_no,
    emergency_contact_no,
    contact_name,
    email,
    address_line_1,
    city,
    pincode,
    district,
    state,
    gst,
    clinic_charge,
    timings,
    social_media_url,
    website_url,
    disclaimer,
    is_it_democlinic,
    status
  } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE clinic SET 
        invoice_prefix = ?, reciept_prefix = ?, name = ?, type = ?, operational_type = ?, logo = ?,
        phonenumber_1 = ?, whatsapp_no = ?, emergency_contact_no = ?, contact_name = ?, email = ?,
        address_line_1 = ?, city = ?, pincode = ?, district = ?, state = ?, gst = ?, clinic_charge = ?,
        timings = ?, social_media_url = ?, website_url = ?, disclaimer = ?, is_it_democlinic = ?,
        status = ?, update_datetime = NOW()
      WHERE id = ?`,
      [
        invoice_prefix,
        reciept_prefix,
        name,
        type,
        operational_type,
        logo,
        phonenumber_1,
        whatsapp_no,
        emergency_contact_no,
        contact_name,
        email,
        address_line_1,
        city,
        pincode,
        district,
        state,
        gst,
        clinic_charge,
        timings,
        social_media_url,
        website_url,
        disclaimer,
        is_it_democlinic,
        status,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json(formatResponse(0, "Clinic not found"));
    }

    // Fetch updated clinic data
    const [updatedRows] = await db.execute("SELECT * FROM clinic WHERE id = ?", [id]);
    
    res.json(formatResponse(1, "Clinic updated successfully", updatedRows[0]));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json(formatResponse(0, "Clinic with same details already exists"));
    }
    res.status(500).json(formatResponse(0, "Error updating clinic", null, error.message));
  }
};

// DELETE clinic (soft delete by setting status to 0)
export const deleteClinic = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute(
      "UPDATE clinic SET status = 0, update_datetime = NOW() WHERE id = ?",
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json(formatResponse(0, "Clinic not found"));
    }
    
    res.json(formatResponse(1, "Clinic deleted successfully"));
  } catch (error) {
    res.status(500).json(formatResponse(0, "Error deleting clinic", null, error.message));
  }
};

// GET clinics by user ID
export const getClinicsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM clinic WHERE users_login_id_fk = ? AND status = 1",
      [userId]
    );
    res.json(formatResponse(1, "Clinics fetched successfully", rows));
  } catch (error) {
    res.status(500).json(formatResponse(0, "Error retrieving clinics", null, error.message));
  }
};