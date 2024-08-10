// Require Package
const postmanToOpenApi = require("postman-to-openapi");

// Postman Collection Path
const postmanCollection = "./postman.json";
// Output OpenAPI Path
const outputFile = "swagger.yml";

// Promise callback style
postmanToOpenApi(postmanCollection, outputFile, { defaultTag: "General" })
  .then((result) => {
    console.log(`OpenAPI specs: ${result}`);
  })
  .catch((err) => {
    console.log(err);
  });
