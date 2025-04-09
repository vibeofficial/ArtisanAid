const Joi = require('joi');

exports.registerAdminValidation = (req, res, next) => {
  const schema = Joi.object({
    fullname: Joi.string().min(3).required().messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 3 characters long',
    }),
    phoneNumber: Joi.string().pattern(/^[0-9]{11}$/).required().messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be 11 digits',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/)
      .required()
      .messages({
        'string.empty': 'Password is required',
        'string.pattern.base':
          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, a number, and a special character',
      }),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Confirm password is required',
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.message
    });
  }

  next();
};


exports.adminRestrictAccount = (req, res, next) => {
    const schema = Joi.object({
      id: Joi.string().length(24).hex().required().messages({
          'string.length': 'Invalid user ID format',
          'string.hex': 'User ID must be a valid hexadecimal',
          'any.required': 'User ID is required'
        })
    });
  
    const { error } = schema.validate(req.params, { abortEarly: false });
  
    if (error) {
      return res.status(400).json({
        message: 'Validation Error',
        errors: error.message
      });
    }
  
    next();
  };

  exports.adminUnrestrictAccount = (req, res, next) => {
    const schema = Joi.object({
      id: Joi.string().length(24).hex().required().messages({
          'string.length': 'Invalid user ID format',
          'string.hex': 'User ID must be a valid hexadecimal',
          'any.required': 'User ID is required'
        })
    });
  
    const { error } = schema.validate(req.params, { abortEarly: false });
  
    if (error) {
      return res.status(400).json({
        message: 'Validation Error',
        errors: error.message
      });
    }
  
    next();
  };
