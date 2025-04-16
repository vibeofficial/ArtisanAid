const joi = require('joi');


exports.registerAdminValidation = (req, res, next) => {
  const schema = joi.object({
    fullname: joi.string().min(3).required().messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 3 characters long',
    }),
    phoneNumber: joi.string().pattern(/^[0-9]{11}$/).required().messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be 11 digits',
    }),
    email: joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),
    password: joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/)
      .required()
      .messages({
        'string.empty': 'Password is required',
        'string.pattern.base':
          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, a number, and a special character',
      }),
    confirmPassword: joi.string().required().valid(joi.ref('password')).messages({
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


exports.registerArtisanValidation = async (req, res, next) => {
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
    businessName: joi.string().min(3).trim().required().messages({
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
      'string.pattern.base': 'Category must contain only letters'
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
      message: error.message // Returning the first validation error message
    });
  }

  next();
};


exports.registerEmployerValidation = (req, res, next) => {
  const schema = joi.object({
    fullname: joi.string().min(3).trim().pattern(/^[A-Za-z ]+$/).required().messages({
      "any.required": "Full name is required",
      "string.empty": "Full name cannot be empty",
      "string.pattern.base": "Full name should only contain alphabets",
      "string.min": "Full name should not be less than 3 letters"
    }),
    email: joi.string().trim().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required"
    }),
    phoneNumber: joi.string().trim().pattern(/^\d{11,11}$/).required().messages({
      "any.required": "Phone number is required",
      "string.pattern.base": "Phone number must be 11 digits"
    }),
    //    address,
    password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character"
    }),
    confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
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

  next();
};


exports.resendVerifyLinkValidation = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().trim().required().messages({
      'string.empty': 'Email is required.',
      'string.email': 'Please enter a valid email address.'
    })
  })
  const { error } = schema.validate(req.body, { abortEarly: true });

  if (error) {
    return res.status(400).json({
      message: error.message // Returning the first validation error message
    });
  }
  next();
}

exports.updateLocationValidation = async (req, res, next) => {
  const schema = joi.object({
    number: joi.string().required().messages({
      'string.empty': 'Number is required'
    }),
    street: joi.string().required().messages({
      'string.empty': 'Street is required'
    }),
    lga: joi.string().required().messages({
      'string.empty': 'LGA is required'
    }),
    state: joi.string().required().messages({
      'string.empty': 'State is required'
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: true });

  if (error) {
    return res.status(400).json({
      message: error.message // Returning the first validation error message
    });
  }
  next();
};


exports.updateBioValidation = (req, res, next) => {
  const schema = joi.object({
    bio: joi.string().required().messages({
      'string.empty': 'Bio is required',
      'any.required': 'Bio field is required'
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

exports.bookArtisanValidation = (req, res, next) => {
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


exports.rejectJobBookingValidation = (req, res, next) => {
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


exports.contactUsMessageValidation = async (req, resizeBy, next) => {
  const schema = joi.object({
    fullname: joi.string().min(3).trim().pattern(/^[A-Za-z ]+$/).required().messages({
      "any.required": "Full name is required",
      "string.empty": "Full name cannot be empty",
      "string.pattern.base": "Full name should only contain alphabets",
      "string.min": "Full name should not be less than 3 letters"
    }),
    email: joi.string().trim().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required"
    }),
    message: joi.string().required().messages({
      'string.empty': 'message cannot be empty'
    })
  })

  const { error } = schema.validate(req.body, { abortEarly: true });

  if (error) {
    return res.status(400).json({
      message: error.message // Returning the first validation error message
    });
  }
  next();
};


exports.loginValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().optional().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required"
    }),
    phoneNumber: joi.string().pattern(/^\d{11,11}$/).optional().messages({
      "any.required": "Phone number is required",
      "string.pattern.base": "Phone number must be 11 digits"
    }),
    password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
      "any.required": "Password is required",
      "string.empty": "Input your password"
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      errors: error.message,
    });
  }

  next();
};


exports.forgotPasswordValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required().messages({
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
  };

  next();
};

exports.resetPasswordValidation = (req, res, next) => {
  const schema = joi.object({
    newPassword: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character"
    }),
    confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
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

  next();
};



exports.changePasswordValidation = (req, res, next) => {
  const schema = joi.object({
    password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character"
    }),
    newPassword: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/).required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character"
    }),
    confirmPassword: joi.string().valid(joi.ref("newPassword")).required().messages({
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

  next();
};


exports.categoryValidation = (req, res, next) => {
  const schema = joi.object({
    category: joi.string().min(3).required().messages({
      "any.required": "Category is required",
      "string.empty": "Category cannot be empty",
      "string.min": "Category must be at least 3 characters long"
    })
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      errors: error.message
    });
  }

  next();
};

exports.lgaValidation = (req, res, next) => {
  const schema = joi.object({
    lga: joi.string().min(2).required().messages({
      "any.required": "LGA is required",
      "string.empty": "LGA cannot be empty",
      "string.min": "LGA must be at least 2 characters"
    }),
    state: joi.string().min(2).required().messages({
      "any.required": "State is required",
      "string.empty": "State cannot be empty",
      "string.min": "State must be at least 2 characters"
    })
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      errors: error.message
    });
  }

  next();
};

exports.updateSocialLinkValidation = (req, res, next) => {
  const schema = joi.object({
    socialLink: joi.string().uri().required().messages({
      "any.required": "Social link is required",
      "string.empty": "Social link cannot be empty",
      "string.uri": "Social link must be a valid URL"
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      errors: error.message
    });
  }

  next();
};


exports.verificationValidation = (req, res, next) => {
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
      }),
    workCertificate: joi.string().optional()
  });

  const { error } = schema.validate(req.body, { abortEarly: true });

  if (error) {
    return res.status(400).json({
      message: error.message
    });
  }

  next();
};


exports.createPlanValidation = (req, res, next) => {
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


exports.updatePlanValidation = (req, res, next) => {
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