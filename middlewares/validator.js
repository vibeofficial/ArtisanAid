const Joi = require('joi');

const allowedAdminEmail = "artisanaid.team@gmail.com";

exports.registerValidation = (req, res, next) => {
  const schema = Joi.object({
    fullname: Joi.string().min(3).trim().pattern(/^[A-Za-z ]+$/).required().messages({
      "any.required": "Full name is required",
      "string.empty": "Full name cannot be empty",
      "string.pattern.base": "Full name should only contain alphabets",
      "string.min": "Full name should not be less than 3 letters"
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required"
    }),
    confirmEmail: Joi.string().valid(Joi.ref("email")).required().messages({
      "any.required": "Confirm email is required",
      "any.only": "Emails do not match"
    }),
    businessName: Joi.string().min(3).max(30).trim().required().messages({
      "any.required": "Username is required",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must be at most 30 characters"
    }),
    phoneNumber: Joi.string().pattern(/^\d{10,15}$/).required().messages({
      "any.required": "Phone number is required",
      "string.pattern.base": "Phone number must be between 10 to 15 digits"
    }),
    category: Joi.string().trim().required().pattern(/^[A-Za-z ]+$/).messages({
      "any.required": "Job Category is required"
    }),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/).required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character"
    }),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.required": "Confirm password is required",
      "any.only": "Passwords do not match"
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      errors: error.message,
    });
  }

  if (req.body.role === "Admin" && req.body.email.toLowerCase() !== allowedAdminEmail) {
    return res.status(403).json({
      message: `Only ${allowedAdminEmail} is allowed for admin registration`,
    });
  }

  next();
};