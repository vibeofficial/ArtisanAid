const joi = require('joi');

exports.createPlanValidator = (req, res, next) => {
  const schema = joi.object({
    planName: joi.string().required().messages({
      'string.empty': 'Plan name cannot be empty',
      'any.required': 'Plan name is required'
    }),
    amount: joi.number().positive().required().messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than 0',
      'any.required': 'Amount is required'
    }),
    description: joi.string().required().messages({
      'string.empty': 'Description cannot be empty',
      'any.required': 'Description is required'
    }),
    duration: joi.number().integer().min(1).required().messages({
      'number.base': 'Duration must be a number',
      'number.min': 'Duration must be at least 1',
      'any.required': 'Duration is required'
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: true });

  if (error) {
    return res.status(400).json({
      message: error.message
    });
  }

  next();
};


exports.updatePlanValidator = (req, res, next) => {
  const schema = joi.object({
    planName: joi.string().required().messages({
      'string.empty': 'Plan name cannot be empty',
      'any.required': 'Plan name is required'
    }),
    amount: joi.number().positive().required().messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than 0',
      'any.required': 'Amount is required'
    }),
    description: joi.string().required().messages({
      'string.empty': 'Description cannot be empty',
      'any.required': 'Description is required'
    }),
    duration: joi.number().integer().min(1).required().messages({
      'number.base': 'Duration must be a number',
      'number.min': 'Duration must be at least 1',
      'any.required': 'Duration is required'
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: true });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};

