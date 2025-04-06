require('dotenv').config();
require('./configs/database')
const express = require('express');
const PORT = process.env.PORT
const cors = require('cors');
const app = express();
const userRouter = require('./routes/artisans');
const planRouter = require('./routes/plan');
const subscriptionRouter = require('./routes/subscription');
const contactRouter = require('./routes/contact');
const employersRouter = require('./routes/employers')


app.use(express.json());

app.use(cors());

const swaggerJsdoc = require("swagger-jsdoc");
const swagger_UI = require("swagger-ui-express")

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
    security: [{ BearerAuth: [] }],
    servers: [
      {
        url: 'https://artisanaid.onrender.com',
        description: "Production Server"
      },
      {
        url: "http://localhost:4867",
        description: "Development Server"
      }
    ],
    
  },
  apis: ["./routes/*.js"] // Ensure this points to the correct path
};

const openapiSpecification = swaggerJsdoc(options);
app.use("/documentation", swagger_UI.serve, swagger_UI.setup(openapiSpecification));

app.use('/v1', userRouter);
app.use('/v1', planRouter);
app.use('/v1', subscriptionRouter);
app.use('/v1', contactRouter);
app.use('/v1', employersRouter);


app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`)
});