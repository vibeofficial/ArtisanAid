const joi = require('joi');


exports.registerValidation = async (req, res, next) => {
  const schema = joi.object({
    fullname: joi.string().min(5).trim().required().pattern(/^[A-Za-z]/).messages({
        'string.empty': 'Fullname is required.',
        'string.min': 'Fullname must be at least 5 characters long.',
        'string.pattern.base': 'Fullname must contain only numbers'
      }),
    email: joi.string().email().trim().required().messages({
        'string.empty': 'Email is required.',
        'string.email': 'Please enter a valid email address.'
      }),
    businessName: joi.string().min(3).trim().optional().messages({
        'string.min': 'Business name must be at least 3 characters long.'
      }),
    phoneNumber: joi.string().min(11).max(11).required().pattern(/^[0-9]+$/).messages({
        'string.empty': 'Phone number is required.',
        'string.pattern.base': 'Phone number must contain only numbers.',
        'string.min': 'Phone number must be exactly 11 digits.',
        'string.max': 'Phone number must be exactly 11 digits.'
      }),
      category: joi.string().min(3).trim().required().pattern(/^[A-Za-z]/).messages({
        'string.empty': 'Category is required.',
        'string.min': 'Category must be at least 5 characters long.',
        'string.pattern.base': 'Category must contain only numbers'
      }),
    password: joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{9,}$/).messages({
        'string.empty': 'Password is required.',
        'string.pattern.base': 'Password must be at least 9 characters long, include one uppercase letter, one lowercase letter, and one special character(!@#$%).'
      }),
    confirmPassword: joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{9,}$/).messages({
        'string.empty': 'Confirmation password is required.',
        'string.pattern.base': 'Confirmation password must meet the same requirements as the password.'
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: true });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message // Returning the first validation error message
    });
  }

  next();
};