const joi = require ('joi')

exports.contactusmessage = async (req, resizeBy, next) =>{
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
                message:joi.string().required().messages({
                  'string.empty':'message cannot be empty'
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
            
   