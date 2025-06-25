import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const optins = {  
  definition: {
    openapi: "3.0.4",
    info: {
      title: "NodePop API",
      version: "1.0.0",
    },
  },
  apis: ["./controllers/**/*.js"],
};

const specification = swaggerJSDoc(optins)

export default [swaggerUI.serve,swaggerUI.setup(specification)]
