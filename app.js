"use strict";

const async = require("async");
const fs = require("fs");
const https = require("https");
const path = require("path");
const createReadStream = require("fs").createReadStream;
const sleep = require("util").promisify(setTimeout);
const ComputerVisionClient =
  require("@azure/cognitiveservices-computervision").ComputerVisionClient;
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;
// </snippet_imports>
//-----------------------------------------------------------------------------
//fs upload to img file:

const express = require("express");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, originalname);
  },
});

console.log(storage);
const upload = multer({ storage });

const app = express();
app.use(express.static(`public`));

app.post("/upload", upload.single("avatar"), (req, res) => {
  computerVision();
  return res.json({ status: "OK" });
});

app.listen(3030, () => console.log(`App is listening...`));

const key = "e04e11ae254d43b4becde7ae521ebf0d";
const endpoint =
  "https://viehicles.cognitiveservices.azure.com/vision/v3.2/analyze?visualFeatures=Tags,Color,Brands&language=en";

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);
function computerVision() {
  async.series(
    [
      async function () {
        console.log("-------------------------------------------------");

        const describeImagePath = __dirname + "\\uploads\\2021-toyota.jpg";

        // Analyze URL image.
        console.log("Analyzing faces in image...");
        // console.log(`Dear Customer, Do you want to find a ${}`);

        // Get the visual feature for 'Faces' only.
        const jsonResult = await computerVisionClient.analyzeImageInStream(() =>
          createReadStream(describeImagePath)
        );

        console.log(jsonResult);

        console.log(`---------------------------------------------------`);
      },
      function () {
        return new Promise((resolve) => {
          resolve();
        });
      },
    ],
    (err) => {
      throw err;
    }
  );
}
