const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const Encrypt = require("./handlers/encrypt");
const Decrypt = require("./handlers/decrypt");
const Hash = require("./handlers/hash");
const localstorage = require("localStorage");
const CreateValidator = require("./handlers/createValidation");
const { validationResult } = require("express-validator");
const mysql = require("mysql");
var flash = require("express-flash");
const cookieParser = require("cookie-parser");
const multer = require("multer");
app.use(express.static(path.join(__dirname, "static")));
var sessionStore = new session.MemoryStore();
const bcrypt = require("bcrypt");
app.use(cookieParser("secret"));
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "upload/";

    mkdirp(dir, err => cb(err, dir));
  },
  filename: function(req, file, cb) {
    var filename = file.originalname;
    var fileExtension = filename.split(".")[1];

    cb(null, Date.now() + "." + fileExtension);
  }
});
var upload = multer({
  storage: storage
});
app.use(
  session({
    cookie: {
      maxAge: 60000
    },
    store: sessionStore,
    saveUninitialized: true,
    resave: "true",
    secret: "secret"
  })
);

app.use(flash());
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "admin"
});

con.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database Connected");
  }
});

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.set("view engine", "ejs");
app.use(
  session({
    secret: "ssshhhhh",
    resave: false,
    saveUninitialized: true
  })
);

let salt = bcrypt.genSaltSync(10);
let sess;
let ownermail;

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    req.flash("info", "Please login");
    res.render("login", {
      Title: "login",
      expressFlash: req.flash("info")
    });
  } else {
    let data = true;
    let username = localstorage.getItem("email");
    res.render("index", {
      Title: "Dashboard",
      expressFlash: req.flash(""),
      data: data,
      user: username
    });
  }
  console.log(!req.session.user);
});

app.post("/dashboard", CreateValidator("dashboard"), (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
  }

  const result = validationResult(req);

  var errors = result.errors;
  console.log(errors);

  if (!result.isEmpty()) {
    let data = true;
    let username = localstorage.getItem("email");
    res.render("index", {
      errors: errors,
      del: "test()",
      Title: "Dashboard",
      expressFlash: req.flash(""),
      data: data,
      user: username
    });
  } else {
    var sid = req.body.sid;
    var api = req.body.api;
    var email = req.body.email;
    var password = req.body.password;
    let encsid = Encrypt(sid);
    let encapi = Encrypt(api);
    console.log(encsid);

    con.query(
      "SELECT email, password FROM users WHERE email=(?)",
      email,
      (err, result) => {
        if (err) {
          var error = "Something Wrong in DB";
          res.render("errorconnection", { error: error });
        } else {
          if (!result.length) {
            let data = true;
            let username = localstorage.getItem("email");
            req.flash("info", "Email Address is not availble");
            res.render("index", {
              expressFlash: req.flash("info"),
              Title: "Email Address is not availble",
              data: data,
              user: username
            });
          } else {
            let hash = result[0].password;
            let check = bcrypt.compareSync(password, hash);
            console.log(check);
            if (check) {
              const sql = "UPDATE users SET sid=(?),api=(?) WHERE email=(?)";
              con.query(sql, [encsid, encapi, email], (err, result) => {
                if (err) {
                  var error = "Something Wrong in DB";
                  res.render("errorconnection", { error: error });
                } else {
                  let data = true;
                  let username = localstorage.getItem("email");
                  req.flash("info", "Successfully updated Credential");
                  res.render("index", {
                    Title: "Dashboard",
                    expressFlash: req.flash("info"),
                    data: data,
                    user: username
                  });
                }
              });
            } else {
              let data = true;
              let username = localstorage.getItem("email");
              req.flash("info", "Email | password wrong");
              res.render("index", {
                Title: "Dashboard",
                expressFlash: req.flash("info"),
                data: data,
                user: username
              });
            }
          }
        }
      }
    );
  }
});

app.get("/register", (req, res) => {
  res.render("register", {
    expressFlash: req.flash(""),
    Title: "Register"
  });
});

app.post("/register", CreateValidator("register"), (req, res) => {
  const result = validationResult(req);

  let check = true;
  var errors = result.errors;
  if (!result.isEmpty()) {
    res.render("register", {
      errors: errors,
      del: "test()",
      expressFlash: req.flash(""),
      Title: "Register"
    });
  } else {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    let hashpassword = Hash(password);
    console.log(hashpassword);

    console.log("Registration");
    var sql = "SELECT email FROM users WHERE email=(?)";
    con.query(sql, [email], (err, result) => {
      if (err) {
        var error = "Something Wrong in DB";
        res.render("errorconnection", { error: error });
      } else {
        if (result.length > 0) {
          req.flash("info", "Email already exixt");
          res.render("register", {
            expressFlash: req.flash("info"),
            Title: "Register"
          });
        } else {
          console.log("create");

          var sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";
          con.query(sql, [name, email, hashpassword], (err, results) => {
            if (err) {
              res.send(err.errno);
            } else {
              res.redirect("/login");
            }
          });
        }
      }
    });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return console.log(err);
    }
    localstorage.removeItem("email");
    res.redirect("/login");
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    Title: "Login",
    expressFlash: req.flash("")
  });
});

app.post("/login", CreateValidator("login"), (req, res) => {
  const result = validationResult(req);

  var errors = result.errors;
  if (!result.isEmpty()) {
    res.render("login", {
      errors: errors,
      del: "test()",
      Title: "Login",
      expressFlash: req.flash("")
    });
  } else {
    const email = req.body.email;
    const password = req.body.password;
    const sql = "SELECT email, password FROM users WHERE email=(?)";
    con.query(sql, [email], (err, result) => {
      if (err) {
        var error = "Something Wrong in DB";
        res.render("errorconnection", { error: error });
      } else {
        if (!result.length) {
          req.flash("info", "Please register");
          res.render("login", {
            expressFlash: req.flash("info"),
            Title: "Login"
          });
        } else {
          console.log(result[0].password);
          const check = bcrypt.compareSync(password, result[0].password);
          if (check) {
            req.session.user = result[0].email;
           ownermail = localstorage.setItem("email", email);
            res.redirect("/sms");
          } else {
            req.flash("info", "Password not correct");
            res.render("login", {
              expressFlash: req.flash("info"),
              Title: "Login"
            });
          }
        }
      }
    });
  }
});

app.get("/sms", (req, res) => {
  if (!req.session.user) {
    req.flash("info", "Please login");
    res.render("login", {
      Title: "sms",
      expressFlash: req.flash("info")
    });
  } else {
    let data = true;
    let username = localstorage.getItem("email");
    res.render("sms", {
      Title: "SMS Client",
      expressFlash: req.flash(""),
      data: data,
      user: username,
      data: data,
      user: username
    });
  }
});

app.post("/sms", CreateValidator("sms"), (req, res) => {
  const result = validationResult(req);

  var errors = result.errors;
  console.log(errors);
  let from = req.body.from;
  let to = req.body.to;
  let message = req.body.bodyMessage;
  if (!result.isEmpty()) {
    let data = true;
    let username = localstorage.getItem("email");
    res.render("sms", {
      expressFlash: req.flash(""),
      errors: errors,
      del: "test()",
      Title: "Sms",
      data: data,
      user: username
    });
  } else {
    let strno = to;
    let integerCheck = parseInt(strno);
    let check = Boolean(integerCheck);
    if (!check) {
      let data = true;
      let username = localstorage.getItem("email");
      req.flash("alert", "Put a correct number");
      res.render("sms", {
        data: data,
        user: username,
        Title: "Sms",
        expressFlash: req.flash("alert")
      });
    } else {
     let ownermail = localstorage.getItem("email");
      console.log(ownermail);
      if (ownermail) {
        con.query(
          "SELECT sid, api FROM users WHERE email=(?)",
          ownermail,
          function(err, result) {
            if (err) {
              var error = "Something Wrong in DB";
              res.render("errorconnection", { error: error });
            }
            let decsid = Decrypt(result[0].sid);
            let decapi = Decrypt(result[0].api);
            console.log(decapi);
            console.log(decsid);

            try {
              const client = require("twilio")(decsid, decapi);
              client.messages
                .create({
                  body: message,
                  from: from,
                  to: to
                })
                .then(message, Error => {
                  console.log(!Error);

                  if (!Error) {
                    let data = true;

                    let username = localstorage.getItem("email");
                    req.flash(
                      "info",
                      `${Error.errorCode} | Check internet Connection`
                    );
                    res.render("sms", {
                      expressFlash: req.flash("info"),
                      Title: "Dashboard",
                      data: data,
                      user: username
                    });
                  } else {
                    req.flash("info", `Successfully sended`);
                    let data = true;
                    let username = localstorage.getItem("email");
                    res.render("sms", {
                      Title: "sms",
                      expressFlash: req.flash("info"),
                      data: data,
                      user: username
                    });
                  }
                })

                .done();
            } catch (error) {
              console.log(error);
            }
          }
        );
      }
    }
  }
});

app.get("/bulksms", (req, res) => {
  if (!req.session.user) {
    req.flash("info", "Please login");
    res.render("login", {
      Title: "Bulk sms",
      expressFlash: req.flash("info")
    });
  } else {
    let data = true;
    let username = localstorage.getItem("email");
    res.render("bulksms", {
      Title: "Bulk sms",
      expressFlash: req.flash(""),
      data: data,
      user: username
    });
  }
});

app.post(
  "/bulksms",
  upload.single("to"),

  (req, res) => {
    console.log(req.file);

    const file = req.file.path;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      let data = true;
      let username = localstorage.getItem("email");
      req.flash("alert", "Please upload a file");
      res.render("bulksms", {
        expressFlash: req.flash("alert"),
        Title: "Bulk sms",
        data: data,
        user: username
      });
    } else {
      fs.readFile(file, (err, data) => {
        if (err) throw err;
        var dataStr = data.toString();
        var arr = dataStr.split(",");

        let integerCheck = parseInt(dataStr);
        let check = Boolean(integerCheck);
        console.log(check);

        if (!check) {
          let data = true;
          let username = localstorage.getItem("email");
          req.flash("alert", "Please upload correct file");
          res.render("bulksms", {
            expressFlash: req.flash("alert"),
            Title: "Bulk sms",
            data: data,
            user: username
          });
        } else {
          console.log(arr);
          let from = req.body.from;
          let message = req.body.bodyMessage;

         let ownermail = localstorage.getItem("email");
          console.log(ownermail);
          if (ownermail) {
            con.query(
              "SELECT sid, api FROM users WHERE email=(?)",
              ownermail,
              (err, result) => {
                let decsid = Decrypt(result[0].sid);
                let decapi = Decrypt(result[0].api);
                console.log(decapi);
                console.log(decsid);

                const twilio = require("twilio")(decsid, decapi);
                Promise.all(
                  arr.map(number => {
                    return twilio.messages.create({
                      to: number,
                      from: from,
                      body: message
                    });
                  })
                ).then(message, Error => {
                  if (!Error) {
                    let data = true;
                    let username = localstorage.getItem("email");
                    req.flash(
                      "info",
                      `${Error.errorCode} | Check internet Connection`
                    );
                    res.render("bulksms", {
                      Title: "Bulk sms",
                      expressFlash: req.flash("info"),
                      data: data,
                      user: username
                    });
                  } else {
                    let data = true;
                    let username = localstorage.getItem("email");
                    req.flash("info", `Successfully sended your msg`);
                    res.render("bulksms", {
                      Title: "Bulk sms",
                      expressFlash: req.flash("info"),
                      data: data,
                      user: username
                    });
                  }
                });
              }
            );
          }
        }
      });
    }
  }
);
var uploadsDir = __dirname + "/upload";

fs.readdir(uploadsDir, function(err, files) {
  files.forEach(function(file, index) {
    fs.stat(path.join(uploadsDir, file), function(err, stat) {
      var endTime, now;
      if (err) {
        return console.error(err);
      }
      now = new Date().getTime();
      endTime = new Date(stat.ctime).getTime() + 3600;
      if (now > endTime) {
        return rimraf(path.join(uploadsDir, file), function(err) {
          if (err) {
            return console.error(err);
          }
          console.log("successfully deleted");
        });
      }
    });
  });
});
app.use((req, res, next) => {
  res.status(404);

  if (req.accepts("html")) {
    res.render("404");
    return;
  }

  if (req.accepts("json")) {
    res.send({ error: "Not found" });
    return;
  }

  res.type("txt").send("Not found");
});
console.log(__dirname + "/upload");
app.listen(8080);
console.log("8080 port");
