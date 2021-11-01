/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Computer Vision example
 *
 * Prerequisites:
 *  - Node.js 8.0+
 *  - Install the Computer Vision SDK: @azure/cognitiveservices-computervision (See https://www.npmjs.com/package/@azure/cognitiveservices-computervision) by running
 *    the following command in this directory:
 *       npm install
 *  - The DESCRIBE IMAGE example uses a local image celebrities.jpg, which will be downloaded on demand.
 *  - The READ (the API for performing Optical Character Recognition or doing text retrieval from PDF) example uses local images and a PDF files, which will be downloaded on demand.
 *
 * How to run:
 *  - Replace the values of `key` and `endpoint` with your Computer Vision subscription key and endpoint.
 *  - This quickstart can be run all at once (node ComputerVisionQuickstart.js from the command line) or used to copy/paste sections as needed.
 *    If sections are extracted, make sure to copy/paste the authenticate section too, as each example relies on it.
 *
 * Resources:
 *  - Node SDK: https://docs.microsoft.com/en-us/javascript/api/azure-cognitiveservices-computervision/?view=azure-node-latest
 *  - Documentation: https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/
 *  - API v3.2: https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005
 *
 * Examples included in this quickstart:
 * Authenticate, Describe Image, Detect Faces, Detect Objects, Detect Tags, Detect Type,
 * Detect Category, Detect Brand, Detect Color Scheme, Detect Domain-specific Content, Detect Adult Content
 * Generate Thumbnail
 */

// <snippet_imports_and_vars>
// <snippet_imports>
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
  return res.json({ status: "OK" });
});

app.listen(3030, () => console.log(`App is listening...`));

// <snippet_vars>
/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */
// const key = "PASTE_YOUR_COMPUTER_VISION_SUBSCRIPTION_KEY_HERE";
// const endpoint = "PASTE_YOUR_COMPUTER_VISION_ENDPOINT_HERE";
const key = "e04e11ae254d43b4becde7ae521ebf0d";
const endpoint = "https://viehicles.cognitiveservices.azure.com/";

// </snippet_vars>
// </snippet_imports_and_vars>

// <snippet_client>
const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);
// </snippet_client>
/**
 * END - Authenticate
 */

// <snippet_functiondef_begin>
function computerVision() {
  async.series(
    [
      async function () {
        // </snippet_functiondef_begin>

        /**
         * DESCRIBE IMAGE
         * Describes what the main objects or themes are in an image.
         * Describes both a URL and a local image.
         */
        console.log("-------------------------------------------------");
        console.log("DESCRIBE IMAGE");
        console.log();

        // <snippet_describe_image>
        // const describeURL =
        //   "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/celebrities.jpg";
        // </snippet_describe_image>

        const describeImagePath = __dirname + "\\uploads\\celebrities.jpg";
        console.log(describeImagePath);
        console.log(__filename);
        console.log(__dirname);
        // <snippet_describe>

        // Analyze local image--------------------------------------------------------------
        console.log(
          "\nAnalyzing local image to describe...",
          path.basename(describeImagePath)
        );
        // DescribeImageInStream takes a function that returns a ReadableStream, NOT just a ReadableStream instance.
        const captionLocal = (
          await computerVisionClient.describeImageInStream(() =>
            createReadStream(describeImagePath)
          )
        ).captions[0];

        console.log(
          `This may be ${captionLocal.text} (${captionLocal.confidence.toFixed(
            2
          )} confidence)`
        );

        // const json = await computerVisionClient.describeImageInStream(() =>
        //   createReadStream(describeImagePath)
        // );

        // console.log(json);
        /**
         * END - Describe Image
         */
        console.log();
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

computerVision();
// </snippet_functiondef_end>
