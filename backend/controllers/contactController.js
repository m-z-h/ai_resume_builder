import Contact from '../models/Contact.js';
import asyncHandler from 'express-async-handler';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  const contact = new Contact({
    name,
    email,
    message
  });

  const createdContact = await contact.save();
  
  res.status(201).json({
    success: true,
    data: createdContact,
    message: 'Message sent successfully'
  });
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, resolved } = req.query;
  
  // Build filter
  let filter = {};
  if (resolved !== undefined) {
    filter.isResolved = resolved === 'true';
  }
  
  const contacts = await Contact.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
  const total = await Contact.countDocuments(filter);
  
  res.json({
    success: true,
    data: contacts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get contact message by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContactMessageById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  
  if (contact) {
    res.json({
      success: true,
      data: contact
    });
  } else {
    res.status(404);
    throw new Error('Contact message not found');
  }
});

// @desc    Update contact message (mark as resolved)
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContactMessage = asyncHandler(async (req, res) => {
  const { isResolved } = req.body;
  
  const contact = await Contact.findById(req.params.id);
  
  if (contact) {
    contact.isResolved = isResolved !== undefined ? isResolved : contact.isResolved;
    
    if (isResolved && !contact.resolvedAt) {
      contact.resolvedAt = Date.now();
    } else if (!isResolved) {
      contact.resolvedAt = null;
    }
    
    const updatedContact = await contact.save();
    
    res.json({
      success: true,
      data: updatedContact,
      message: 'Contact message updated successfully'
    });
  } else {
    res.status(404);
    throw new Error('Contact message not found');
  }
});

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  
  if (contact) {
    await contact.remove();
    res.json({
      success: true,
      message: 'Contact message removed'
    });
  } else {
    res.status(404);
    throw new Error('Contact message not found');
  }
});

export {
  submitContactForm,
  getContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage
};