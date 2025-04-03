const joi = require('joi');


exports.registerValidation = async (req, res, next) => {
  const schema = joi.object({
    fullname: joi.string().min(3).trim().required().pattern(/^[A-Za-z]/),
    email: joi.string().email().trim().required(),
    confirmEmail: joi.string().email().trim().required(),
    businessName: joi.string().min(3).trim().required(),
    phoneNumber: joi.string().min(11).max(11).required().pattern(/^[0-9]+$/),
    password: joi.string().required().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/),
    confirmPassword: joi.string().required().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/),
  });

  const { error } = schema.validate(req.body, { abortEarly: true });

  if (error) {
    return res.status(400).json({
      message: error.message
    })
  };

  next();
};