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
    businessName: Joi.string().min(3).max(30).trim().optional().messages({
      "any.required": "Username is required",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must be at most 30 characters"
    }),
    phoneNumber: Joi.string().pattern(/^\d{11,11}$/).required().messages({
      "any.required": "Phone number is required",
      "string.pattern.base": "Phone number must be 11 digits"
    }),
    category: Joi.string().trim().required().pattern(/^[A-Za-z ]+$/).messages({
      "any.required": "Job Category is required"
    }),
    password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
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


exports.forgotPasswordValidation = (req, res, next) => {
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


exports.resetPasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    newPassword: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
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


exports.loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required"
    }),
    phoneNumber: Joi.string().pattern(/^\d{11,11}$/).required().messages({
      "any.required": "Phone number is required",
      "string.pattern.base": "Phone number must be 11 digits"
    }),
    password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
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


exports.getByCategoryValidation = (req, res, next) => {
  const schema = Joi.object({
    category: Joi.string().trim().required().pattern(/^[A-Za-z ]+$/).messages({
      "any.required": "Job Category is required"
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


exports.getByLgaValidation = (req, res, next) => {
  const schema = Joi.object({
    lga: Joi.string().trim().required().pattern(/^[A-Za-z ]+$/).messages({
      "any.required": "Location is required"
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


exports.changePasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character"
    }),
    newPassword: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
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


exports.updateLocationValidation = (req, res, next) => {
  const schema = Joi.object({
    number: Joi.number().required().messages({
      "any.required": "number is required",
      "string.empty": "number cannot be empty",
    }),
    street: Joi.string().trim().pattern(/^[A-Za-z]+$/).required().messages({
      "any.required": "LGA is required",
      "string.empty": "LGA cannot be empty",
    }),
    lga: Joi.string().trim().pattern(/^[A-Za-z]+$/).required().messages({
      "any.required": "LGA is required",
      "string.empty": "LGA cannot be empty",
    }),
    state: Joi.string().trim().pattern(/^[A-Za-z]+$/).required().messages({
      "any.required": "state is required",
      "string.empty": "State cannot be empty",
    }),

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