require('dotenv').config();
require('./configs/database')

const express = require('express');
const PORT = process.env.PORT
const cors = require('cors');
const cron = require('node-cron');
const app = express();


const artisanRouter = require('./routes/artisan');
const planRouter = require('./routes/plan');
const subscriptionRouter = require('./routes/subscription');
const contactUsRouter = require('./routes/contactUs');
const employerRouter = require('./routes/employer');
const adminRouter = require('./routes/admin');
const verificationRouter = require('./routes/verification');
const bookingRouter = require('./routes/booking');
const jobPostRouter = require('./routes/jobPost');
const reportRouter = require('./routes/report');

app.use(express.json());
app.use(cors());


const swaggerJsdoc = require("swagger-jsdoc");
const swagger_UI = require("swagger-ui-express");

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "ArtisanAid Documentation",
      version: '1.0.0',
      description: "Documentation for ArtisanAid, a platform that help Artisans connects to clients and grow/build their business",
      license: {
        name: 'BASE URL: https://artisanaid.onrender.com',
      },
      contact: {
        name: "Backend Repo",
        url: "https://github.com/vibeofficial/ArtisanAid.git"
      }
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ BearerAuth: [] }]

  },
  apis: ["./routes/*.js"] // Ensure this points to the correct path
};

const openapiSpecification = swaggerJsdoc(options);
app.use("/documentation", swagger_UI.serve, swagger_UI.setup(openapiSpecification));

app.use('/v1', artisanRouter);
app.use('/v1', planRouter);
app.use('/v1', subscriptionRouter);
app.use('/v1', contactUsRouter);
app.use('/v1', employerRouter);
app.use('/v1', adminRouter);
app.use('/v1', verificationRouter);
app.use('/v1', bookingRouter);
app.use('/v1', jobPostRouter);
app.use('/v1', reportRouter);


const { subscriptionChecker } = require('./app');

cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running subscriptionChecker task...');
    await subscriptionChecker();
    console.log('subscriptionChecker task completed successfully');
  } catch (error) {
    console.error('Error executing subscriptionChecker:', error.message);
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`)
});