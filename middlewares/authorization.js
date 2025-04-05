const artisanModel = require('../models/artisans');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;


exports.authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(404).json({
        message: 'Token is not passed to headers'
      })
    };

    const token = auth.split(' ')[1];

    if (!token) {
      return res.status(404).json({
        message: 'Token not found'
      })
    };

    const decodedToken = jwt.verify(token, jwtSecret);
    const { id } = decodedToken;
    const artisan = await artisanModel.findById(id);

    if (!artisan) {
      return res.status(404).json({
        message: 'Authentication failed: Artisan not found'
      })
    };

    if (artisan.isLoggedIn !== decodedToken.isLoggedIn) {
      return res.status(401).json({
        message: 'Authentication failed: Account is not logged in'
      })
    };

    req.artisan = decodedToken;
    next();
  } catch (error) {
    console.log(error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, please login to continue'
      })
    };

    res.status(500).json({
      message: 'Error authenticating artisan'
    })
  }
};


exports.authorize = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(404).json({
        message: 'Token is not passed to headers'
      })
    };

    const token = auth.split(' ')[1];

    if (!token) {
      return res.status(404).json({
        message: 'Token not found'
      })
    };

    const decodedToken = jwt.verify(token, jwtSecret);
    const { id } = decodedToken;
    const user = await artisanModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'Authentication failed: Artisan not found'
      })
    };

    if (user.isLoggedIn !== decodedToken.isLoggedIn) {
      return res.status(401).json({
        message: 'Authentication failed: Account is not logged in'
      })
    };
    
    if (user.role !== 'Admin') {
      return res.status(401).json({
        message: 'Authorization failed: Contact admin'
      })
    };
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, please login to continue'
      })
    };

    res.status(500).json({
      message: 'Error authorizating User'
    })
  }
};