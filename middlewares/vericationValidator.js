const joi = require('joi');

exports.verificationValidator = (req, res, next) => {
  const schema = joi.object({
    guarantorName: joi.string().min(3).required().messages({
      'string.empty': 'Guarantor name is required',
      'string.min': 'Guarantor name must be at least 3 characters long',
      'any.required': 'Guarantor name is required'
    }),
    guarantorPhoneNumber: joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        'string.pattern.base': 'Phone number must be between 10 and 15 digits',
        'string.empty': 'Guarantor phone number is required',
        'any.required': 'Guarantor phone number is required'
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
