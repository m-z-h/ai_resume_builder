import FeatureControl from '../models/FeatureControl.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all feature controls
// @route   GET /api/features
// @access  Private/Admin
const getFeatures = asyncHandler(async (req, res) => {
  const features = await FeatureControl.find({});
  res.json(features);
});

// @desc    Get feature control by name
// @route   GET /api/features/:name
// @access  Private/Admin
const getFeatureByName = asyncHandler(async (req, res) => {
  const feature = await FeatureControl.findOne({ featureName: req.params.name });

  if (feature) {
    res.json(feature);
  } else {
    res.status(404);
    throw new Error('Feature not found');
  }
});

// @desc    Create feature control
// @route   POST /api/features
// @access  Private/Admin
const createFeature = asyncHandler(async (req, res) => {
  const { featureName, isEnabled, allowedRoles, dailyLimit } = req.body;

  const featureExists = await FeatureControl.findOne({ featureName });

  if (featureExists) {
    res.status(400);
    throw new Error('Feature already exists');
  }

  const feature = new FeatureControl({
    featureName,
    isEnabled,
    allowedRoles,
    dailyLimit
  });

  const createdFeature = await feature.save();
  res.status(201).json(createdFeature);
});

// @desc    Update feature control
// @route   PUT /api/features/:name
// @access  Private/Admin
const updateFeature = asyncHandler(async (req, res) => {
  const { isEnabled, allowedRoles, dailyLimit } = req.body;

  const feature = await FeatureControl.findOne({ featureName: req.params.name });

  if (feature) {
    feature.isEnabled = isEnabled !== undefined ? isEnabled : feature.isEnabled;
    feature.allowedRoles = allowedRoles || feature.allowedRoles;
    feature.dailyLimit = dailyLimit !== undefined ? dailyLimit : feature.dailyLimit;

    const updatedFeature = await feature.save();
    res.json(updatedFeature);
  } else {
    res.status(404);
    throw new Error('Feature not found');
  }
});

// @desc    Delete feature control
// @route   DELETE /api/features/:name
// @access  Private/Admin
const deleteFeature = asyncHandler(async (req, res) => {
  const feature = await FeatureControl.findOne({ featureName: req.params.name });

  if (feature) {
    await feature.remove();
    res.json({ message: 'Feature removed' });
  } else {
    res.status(404);
    throw new Error('Feature not found');
  }
});

// @desc    Check if feature is enabled for user
// @route   GET /api/features/check/:name
// @access  Private
const checkFeature = asyncHandler(async (req, res) => {
  const feature = await FeatureControl.findOne({ featureName: req.params.name });

  if (feature && feature.isEnabled) {
    // Check if user role is allowed
    if (!feature.allowedRoles || feature.allowedRoles.length === 0) {
      // No role restrictions
      res.json({ isEnabled: true });
    } else if (feature.allowedRoles.includes(req.user.role)) {
      // User role is allowed
      res.json({ isEnabled: true });
    } else {
      // User role is not allowed
      res.json({ isEnabled: false, message: 'Feature not available for your role' });
    }
  } else {
    res.json({ isEnabled: false, message: 'Feature is disabled' });
  }
});

export {
  getFeatures,
  getFeatureByName,
  createFeature,
  updateFeature,
  deleteFeature,
  checkFeature
};