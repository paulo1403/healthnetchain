const express = require("express");
const app = express();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { saveUpload } = require("./services/ipfs.service");

const TOKEN_KEY = "secretK3y";
const requestStatus = {
  APPROVED: "APROBADO",
  PENDING: "PENDIENTE",
  DENIED: "DENEGADO",
};
const saltRounds = 10;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// AUTH USERS
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  const token = bearerHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access Denied");
  }

  jwt.verify(token, TOKEN_KEY, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid Token");
    }

    req.user = user;
    next();
  });
};

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
app.use(express.json({ limit: "50mb" }));

let db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
});

app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    if (row) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }

    bycrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hash],
        (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          const token = jwt.sign({ username }, TOKEN_KEY);
          res.json({
            message: "success",
            username,
            token,
          });
        }
      );
    });
  });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    `SELECT * FROM users u JOIN clinics c ON u.user_id = c.user_id WHERE u.username = ?`,
    [username],
    (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      if (!row) {
        res.status(400).json({ error: "User does not exist" });
        return;
      }

      bycrypt.compare(password, row.password, (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        if (!result) {
          res.status(400).json({ error: "Invalid password" });
          return;
        }
        const {
          clinic_id,
          clinic_name,
          clinic_address,
          clinic_phone,
          clinic_email,
          clinic_website,
          clinic_logo,
        } = row;
        const token = jwt.sign(
          {
            id: row.user_id,
            username,
            clinic: {
              id: clinic_id,
              name: clinic_name,
              address: clinic_address,
              phone: clinic_phone,
              email: clinic_email,
              website: clinic_website,
              logo: clinic_logo,
            },
          },
          TOKEN_KEY
        );
        res.json({
          message: "success",
          username,
          clinic: {
            id: clinic_id,
            name: clinic_name,
            address: clinic_address,
            phone: clinic_phone,
            email: clinic_email,
            website: clinic_website,
            logo: clinic_logo,
          },
          token,
        });
      });
    }
  );
});

app.get("/api/users", (req, res) => {
  db.all(`SELECT * FROM users`, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    const users = rows.map((row) => ({
      id: row.user_id,
      username: row.username,
    }));

    res.json({
      message: "success",
      data: users,
    });
  });
});

app.get("/api/users/clinics", (req, res) => {
  db.all(
    `SELECT * FROM users u WHERE u.user_id NOT IN (SELECT c.user_id FROM clinics c)`,
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      const users = rows.map((row) => ({
        id: row.user_id,
        username: row.username,
      }));

      res.json({
        message: "success",
        data: users,
      });
    }
  );
});

//CLINICS

app.post("/api/clinics", (req, res) => {
  const {
    clinic_name,
    clinic_address,
    clinic_phone,
    clinic_email,
    clinic_website,
    clinic_logo,
    user_id,
  } = req.body;

  db.run(
    `INSERT INTO clinics (clinic_name, clinic_address, clinic_phone, clinic_email, clinic_website, clinic_logo, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      clinic_name,
      clinic_address,
      clinic_phone,
      clinic_email,
      clinic_website,
      clinic_logo,
      user_id,
    ],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        message: "success",
        data: req.body,
      });
    }
  );
});

app.get("/api/clinics", verifyToken, (req, res) => {
  db.all(`SELECT * FROM clinics`, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const clinics = rows;
    const id = req.user.id;

    res.json({
      message: "success",
      id: id,
      data: clinics.filter((clinic) => clinic.user_id !== id),
    });
  });
});

app.get("/api/clinics/all", (req, res) => {
  db.all(`SELECT * FROM clinics`, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const clinics = rows;

    res.json({
      message: "success",
      data: clinics,
    });
  });
});

function createRequest(
  receiver_clinic_id,
  clinic_id,
  message,
  file_url,
  patient_id,
  res
) {
  db.run(
    `INSERT INTO requests (receiver_clinic_id, transmitter_clinic_id, message, status, file_url, patient_id) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      receiver_clinic_id,
      clinic_id,
      message,
      requestStatus.PENDING,
      file_url,
      patient_id,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      return res.json({
        message: `Request ${this.lastID} created`,
      });
    }
  );
}

app.post("/api/requests", verifyToken, upload.single("file"), (req, res) => {
  const clinic_id = req.user.clinic.id;
  const { receiver_clinic_id, message, patient } = req.body;
  if (clinic_id === receiver_clinic_id) {
    return res.status(409).json({
      message: `Transmitter clinic is the same as Receiver clinic`,
    });
  }
  db.get(
    `SELECT * FROM patients WHERE document_number = ?`,
    [patient.document_number],
    (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      console.log(req.file);
      if (row === undefined) {
        db.run(
          "INSERT INTO patients (name, surname, document_number) VALUES (?, ?, ?)",
          [patient.name, patient.surname, patient.document_number],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }

            const patientId = this.lastID;

            createRequest(
              receiver_clinic_id,
              clinic_id,
              message,
              req.file.path,
              patientId,
              res
            );
            return;
          }
        );
      } else {
        createRequest(
          receiver_clinic_id,
          clinic_id,
          message,
          req.file.path,
          row.patient_id,
          res
        );
      }
    }
  );
});

app.get("/api/requests/:id", verifyToken, (req, res) => {
  const clinic_id = req.user.clinic.id;
  const { id } = req.params;
  db.get(`SELECT * FROM requests WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (row === undefined) {
      return res.status(404).json({
        message: `Request with id ${id} not found`,
      });
    }
    if (
      row.transmitter_clinic_id !== clinic_id &&
      row.receiver_clinic_id !== clinic_id
    ) {
      return res.status(403).json({
        message: `Request with id ${id} is not for clinic with id ${clinic_id}`,
      });
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

app.get("/api/requests", verifyToken, (req, res) => {
  const transmitted = req.query.transmitted;

  const query = "SELECT * FROM requests";
  const clinic_id = req.user.clinic.id;
  db.all(query, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const requests = rows;
    const transmittedRequests = requests.filter(
      (request) => request.transmitter_clinic_id === clinic_id
    );
    const receivedRequests = requests.filter(
      (request) => request.receiver_clinic_id === clinic_id
    );
    res.json({
      message: "success",
      transmittedRequests,
      receivedRequests,
    });
  });
});

/*
  status
  - APPROVED
  - DENIED
  - PENDING
  http://localhost:5000/api/requests/1?status=APPROVED
*/
app.put("/api/requests/:id", verifyToken, (req, res) => {
  const request_id = req.params.id;
  const status = req.query.status;
  db.run(
    `UPDATE requests SET status = ? WHERE id = ?`,
    [requestStatus[status], request_id],
    console.log(requestStatus[status]),
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      res.json({
        message: `Request ${request_id} status updated to: ${requestStatus[status]}`,
      });
    }
  );
});

app.get("/api/patients/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM patients WHERE patient_id = ?`, [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (row === undefined) {
      return res.status(404).json({
        message: `Patient with id ${id} not found`,
      });
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

app.post("/api/file/upload", verifyToken, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }
  res.json({
    message: "success",
    data: req.file,
  });
});

app.get("/api/file/list", verifyToken, (req, res) => {
  fs.readdir("./uploads", (err, files) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: files,
    });
  });
});

app.delete("/api/file/delete/:filename", verifyToken, (req, res) => {
  const { filename } = req.params;
  const file = `./uploads/${filename}`;
  fs.unlink(file, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
    });
  });
});

app.get("/api/file/download/:filename", verifyToken, (req, res) => {
  const { filename } = req.params;
  const file = `./uploads/${filename}`;
  res.download(file);
});

app.post("/api/test", upload.single("file"), async (req, res) => {
  try {

    const file = req.file;
    const parsedData = await saveUpload(file, res)
    return res.status(200).json({
      parsedData
    });
  } catch(error) {
    res.status(500).json({error: "error"})
  }
});

/* Server. Don't Touch it */
app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
