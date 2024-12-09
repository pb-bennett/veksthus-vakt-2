const argon2 = require('argon2');

const { Unit } = require('../models');
const {
  errorThrowHandler,
  errorCatchHandler,
} = require('../utils/errorHandler');
const getAllUnits = async (req, res) => {
  try {
    const units = await Unit.findAll();
    if (units.length === 0) {
      return errorThrowHandler('No units found', 404);
    }
    const resData = units.map((unit) => ({
      unit_id: unit.unit_id,
      unit_name: unit.unit_name,
      location: unit.location,
      createdAt: unit.createdAt,
      updatedAt: unit.updatedAt,
    }));
    res.status(200).json({ status: 'success', data: resData });
  } catch (error) {
    errorCatchHandler(res, error);
  }
};
const createUnit = async (req, res) => {
  try {
    const existingUnit = await Unit.findByPk(req.body.unitId);
    if (existingUnit) {
      throw new Error('Unit already exists');
    }
    const unit = req.body;
    const hashedApiKey = await argon2.hash(unit.apiKey);
    const newUnit = await Unit.create({
      unit_id: unit.unitId,
      unit_name: unit.unitName,
      location: unit.location,
      api_key_hashed: hashedApiKey,
      latitude: unit.latitude,
      longitude: unit.longitude,
    });
    res.status(201).json(newUnit);
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message, stack: error.stack });
  }
};

module.exports = {
  createUnit,
  getAllUnits,
};
