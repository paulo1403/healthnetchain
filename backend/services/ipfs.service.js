//const IPFS = require("ipfs-http-client");
const express = require("express");
const fs = require("fs");
//const ipfs = IPFS.create({ host: "localhost", port: "5001", protocol: "http" });
const PDFParser = require("pdf2json");
const pdfParser = new PDFParser(this, 1);
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const {
  categories,
  patientToData,
  contactToData,
  alergiesToData,
  reactionToData,
  medicationToData,
} = require("../common/constants");

const saveUpload = async (file, res) => {
  const filename = file.filename;

  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData) =>
      reject(errData.parserError)
    );
    pdfParser.on("pdfParser_dataReady", async (pdfData) => {
      const val = pdfParser.getRawTextContent();
      let currentString = val.split("\r\n");
      let categoriesObjects = {};
      let currentCategory = "";
      currentString.splice(currentString.length - 2, 2);
      currentString.forEach((text) => {
        const splittedText = text.split(":");
        if (splittedText[0].includes(".")) {
          currentCategory = splittedText[0].replace(/[0-9.]/g, "").trim();
          categoriesObjects[currentCategory] = [];
          return;
        }
        categoriesObjects[currentCategory].push(splittedText);
      });
      const ipfsObject = {};
      Object.keys(categoriesObjects).forEach((category) => {
        const ipfsCategory = categories[category].trim();
        let subCategory = "";
        ipfsObject[ipfsCategory] = {};
        categoriesObjects[category].forEach((splittedText) => {
          let fieldName = splittedText[0].trim();
          let value = "";
          if (ipfsCategory === "Patient") {
            if (splittedText.length === 1) {
              subCategory = fieldName;
              return;
            }
            value = splittedText[1].trim();
            if (subCategory !== "") {
              if (!ipfsObject[ipfsCategory]["contact"]) {
                ipfsObject[ipfsCategory]["contact"] = {};
              }
              ipfsObject[ipfsCategory]["contact"][contactToData[fieldName]] =
                value;
              return;
            }
            ipfsObject[ipfsCategory][patientToData[fieldName]] = value;
            return;
          }

          if (ipfsCategory === "AllergyIntolerance") {
            if (splittedText.length === 1) {
              subCategory = fieldName;
              return;
            }
            value = splittedText[1].trim();
            if (subCategory !== "") {
              if (!ipfsObject[ipfsCategory]["reaction"]) {
                ipfsObject[ipfsCategory]["reaction"] = {};
              }
              ipfsObject[ipfsCategory]["reaction"][reactionToData[fieldName]] =
                value;
              return;
            }
            ipfsObject[ipfsCategory][alergiesToData[fieldName]] = value;
            return;
          }

          if (ipfsCategory === "Medication") {
            value = splittedText[1].trim();
            ipfsObject[ipfsCategory][medicationToData[fieldName]] = value;
            return;
          }
        });
      });
      fs.unlink(`../uploads/${filename}`, (err) => {
        console.log("File deleted: " + filename);
      });
      resolve({
        mensaje: "Success",
        response: ipfsObject,
      });
    });

    pdfParser.loadPDF(`./uploads/${filename}`);
  });
};

const uploadIpfs = async (file) => {
  const fileAdded = await ipfs.add(JSON.stringify(file));
  const fileHash = fileAdded.cid;
  const metaObj = {
    name: "",
    description: "",
    hash: `https://ipfs.io/ipfs/${fileHash}`,
  };
  const jsonObj = JSON.stringify(metaObj);
  const newFileAdded = await ipfs.add(jsonObj);

  const newfileHash = newFileAdded.cid;
  console.log(newfileHash);
  return newfileHash;
};

module.exports = {
  saveUpload,
};
