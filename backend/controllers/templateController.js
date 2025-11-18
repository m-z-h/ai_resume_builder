import Template from '../models/Template.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all active templates
// @route   GET /api/templates
// @access  Public
const getTemplates = asyncHandler(async (req, res) => {
  const { category, search, isFree } = req.query;
  
  // Build filter object
  let filter = { isActive: true };
  
  if (category) {
    filter.category = category;
  }
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }
  
  if (isFree !== undefined) {
    filter.isFree = isFree === 'true';
  }
  
  const templates = await Template.find(filter);
  res.json(templates);
});

// @desc    Get template by ID
// @route   GET /api/templates/:id
// @access  Public
const getTemplateById = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (template && template.isActive) {
    res.json(template);
  } else {
    res.status(404);
    throw new Error('Template not found');
  }
});

// @desc    Create template
// @route   POST /api/templates
// @access  Private/Admin
const createTemplate = asyncHandler(async (req, res) => {
  const { 
    name, 
    description, 
    category, 
    tags,
    thumbnail, 
    htmlStructure, 
    cssStyles, 
    isAtsFriendly,
    isFree,
    price,
    customizableOptions,
    allowedRoles
  } = req.body;

  const template = new Template({
    name,
    description,
    category,
    tags,
    thumbnail,
    htmlStructure,
    cssStyles,
    isAtsFriendly,
    isFree,
    price,
    customizableOptions,
    allowedRoles,
    createdBy: req.user._id
  });

  const createdTemplate = await template.save();
  res.status(201).json(createdTemplate);
});

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private/Admin
const updateTemplate = asyncHandler(async (req, res) => {
  const { 
    name, 
    description, 
    category, 
    tags,
    thumbnail, 
    htmlStructure, 
    cssStyles, 
    isAtsFriendly,
    isFree,
    price,
    isActive,
    customizableOptions,
    allowedRoles
  } = req.body;

  const template = await Template.findById(req.params.id);

  if (template) {
    template.name = name || template.name;
    template.description = description || template.description;
    template.category = category || template.category;
    template.tags = tags || template.tags;
    template.thumbnail = thumbnail || template.thumbnail;
    template.htmlStructure = htmlStructure || template.htmlStructure;
    template.cssStyles = cssStyles || template.cssStyles;
    template.isAtsFriendly = isAtsFriendly !== undefined ? isAtsFriendly : template.isAtsFriendly;
    template.isFree = isFree !== undefined ? isFree : template.isFree;
    template.price = price !== undefined ? price : template.price;
    template.isActive = isActive !== undefined ? isActive : template.isActive;
    template.customizableOptions = customizableOptions || template.customizableOptions;
    template.allowedRoles = allowedRoles || template.allowedRoles;

    const updatedTemplate = await template.save();
    res.json(updatedTemplate);
  } else {
    res.status(404);
    throw new Error('Template not found');
  }
});

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private/Admin
const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (template) {
    await template.remove();
    res.json({ message: 'Template removed' });
  } else {
    res.status(404);
    throw new Error('Template not found');
  }
});

// @desc    Get templates by category
// @route   GET /api/templates/category/:category
// @access  Public
const getTemplatesByCategory = asyncHandler(async (req, res) => {
  const templates = await Template.find({ 
    category: req.params.category, 
    isActive: true 
  });
  
  res.json(templates);
});

// @desc    Increment template usage count
// @route   POST /api/templates/:id/use
// @access  Private
const incrementTemplateUsage = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (template) {
    template.usedByCount = template.usedByCount + 1;
    const updatedTemplate = await template.save();
    res.json(updatedTemplate);
  } else {
    res.status(404);
    throw new Error('Template not found');
  }
});

export {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplatesByCategory,
  incrementTemplateUsage
};