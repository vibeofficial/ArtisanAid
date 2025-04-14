const joi = require ('joi')

exports.bookAnnArtisan = (req,res,next) =>{
  const schema = joi.object({
  location: joi.string().min(3).required().messages({
      'string.empty': 'Location is required',
      'string.min': 'Location should be at least 3 characters long'
    }),

  serviceDescription: joi.string().min(3).required().messages({
      'string.empty': 'Service description is required',
      'string.min': 'Service description should be at least 3 characters long'
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


