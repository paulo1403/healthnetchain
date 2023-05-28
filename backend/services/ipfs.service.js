//const IPFS = require("ipfs-http-client");
const express = require("express");
const fs = require("fs");
//const ipfs = IPFS.create({ host: "localhost", port: "5001", protocol: "http" });
const PDFParser = require("pdf2json");
const pdfParser = new PDFParser(this, 1);
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

let resourceTemplate = [
  {
    resourceType: "Patient",
    name: "",
    dni: "",
    gender: "",
    birthDate: "",
    address: "",
    maritalStatus: "",
    contact: {
      relationship: "",
      name: "",
      phoneNumber: "",
      email: "",
    },
  },
  {
    resourceType: "AllergyIntolerance",
    type: "",
    category: "",
    criticality: "",
    verificationStatus: "",
    lastOccurrence: "",
    participant: "",
    reaction: {
      sustance: "",
      description: "",
      severity: "",
    },
  },
  {
    resourceType: "Medication",
    name: "",
    code: "",
    totalVolume: "",
    doseForm: "",
  },
];

const saveUpload = async (file, res) => {
  const filename = file.filename;
  let newSource = {};

  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData) =>
      reject(errData.parserError)
    );
    pdfParser.on("pdfParser_dataReady", async (pdfData) => {
      const val = pdfParser.getRawTextContent();
      let newStr = val.split("\r\n");
      "Nombre: Piero Cossio ",
        "DNI: 45238965 ",
        "Género: Masculino ",
        "Fecha de Nacimiento: 12/08/1999 ",
        "Dirección: Avenida Las Américas 234, Comas ",
        "Estado Civil: Soltero ",
        "Datos del contacto ",
        "Nombre: Maria Jara ",
        console.log(newStr);
      /*newStr.splice(newStr.length - 2, 2);
        let obj = {};
        for (let i = 0; i < newStr.length; i++) {
          let value = newStr[i].split(":");
          console.log("[value]", value);
          const key = removeAccents(value[0].trim());
          const data = value[1].trim();
          obj[key] = data;
        }
        for (const key in obj) {
          if (key == "Nombre") {
            resource.name = [{ family: obj[key] }];
          }
          if (key == "Direccion") {
            resource.address = [{ address: obj[key] }];
          }
          if (key == "dni") {
            resource.dni = [{ dni: obj[key] }];
          }
          if (key == "Fecha de Nacimiento") {
            resource.birthDate = [{ birthDate: obj[key] }];
          }
          if (key == "Estado Civil") {
            resource.maritalStatus = [{ maritalStatus: obj[key] }];
          }
          if (key == "Alergias") {
            resource.alergies = [{ alergies: obj[key] }];
          }
          if (key == "Fecha de atencion") {
            resource.attentionDate = [{ attentionDate: obj[key] }];
          }
          if (key == "Sintomas") {
            resource.symptoms = [{ symptoms: obj[key] }];
          }
          if (key == "Genero") {
            resource.gender = [{ gender: obj[key] }];
          }
          if (key == "Telefono") {
            resource.phoneNumber = [{ phoneNumber: obj[key] }];
          }
          if (key == "Parentesco Familiar") {
            resource.contactRelationship = [{ contactRelationship: obj[key] }];
          }
          if (key == "Nombre Familiar") {
            resource.contactName = [{ contactName: obj[key] }];
          }
          if (key == "Telefono Familiar") {
            resource.contactPhoneNumber = [{ contactPhoneNumber: obj[key] }];
          }
          if (key == "Direccion Familiar") {
            resource.contactAddress = [{ contactAddress: obj[key] }];
          }
          if (key == "Diagnostico") {
            resource.diagnosis = [{ diagnosis: obj[key] }];
          }
          if (key == "Fecha diagnostico") {
            resource.diagnosisDate = [{ diagnosisDate: obj[key] }];
          }
          if (key == "Seguro") {
            resource.hasInsurance = [{ hasInsurance: obj[key] }];
          }
          if (key == "Nombre del Medico") {
            resource.doctorName = [{ doctorName: obj[key] }];
          }
          if (key == "Medicamentos") {
            resource.medications = [{ medications: obj[key] }];
          }
          if (key == "Observaciones") {
            resource.observations = [{ observations: obj[key] }];
          }
        }
        console.log("[resource]", resource);
        newSource = resource;
        const hash = await uploadIpfs(newSource);*/
      fs.unlink(`../uploads/${filename}`, (err) => {
        if (err) throw err;
        console.log("File deleted: " + filename);
      });
      console.log("EJECUTANDO");
      resolve({ mensaje: "Success", /*hash: `${hash}`*/ response: newStr });
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
