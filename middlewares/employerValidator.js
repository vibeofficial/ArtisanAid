const Joi = require('joi');


exports.registerEmployerValidation = (req, res, next) => {
  const schema = Joi.object({
    fullname: Joi.string().min(3).trim().pattern(/^[A-Za-z ]+$/).required().messages({
      "any.required": "Full name is required",
      "string.empty": "Full name cannot be empty",
      "string.pattern.base": "Full name should only contain alphabets",
      "string.min": "Full name should not be less than 3 letters"
    }),
    email: Joi.string().trim().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required"
    }),
      phoneNumber: Joi.string().trim().pattern(/^\d{11,11}$/).required().messages({
      "any.required": "Phone number is required",
      "string.pattern.base": "Phone number must be 11 digits"
    }),
//    address,
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
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


exports.loginEmployerValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required"
    }),
      phoneNumber: Joi.string().pattern(/^\d{11,11}$/).required().messages({
          "any.required": "Phone number is required",
          "string.pattern.base": "Phone number must be 11 digits"
        }),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character"
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


exports.employerForgotPasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required"
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

exports.employerResetPasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    newPassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
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



exports.employersChangePasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character"
    }),
    newPassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character"
    }),
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
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
