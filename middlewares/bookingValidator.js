const joi = require ('joi')

exports.rejectJobBooking = (req, res, next) => {
  const schema = joi.object({
    reason: joi.string().min(3).required().messages({
      'string.empty': 'Rejection reason is required',
      'string.min': 'Rejection reason must be at least 3 characters',
      'any.required': 'Rejection reason is required'
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


