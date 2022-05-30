var imaps = require("imap-simple");
const simpleParser = require("mailparser").simpleParser;
const readLastLines = require("read-last-lines");
const _ = require("lodash");
const fs = require("fs");
const { forEach } = require("lodash");

// const users = JSON.parse(fs.readFileSync('userEmailCredentials.json'));
// let otpJson = JSON.parse(fs.readFileSync('otpCredentials.json'));
otpJson = [];

// function readOtp() {
// forEach(users, function (value) {
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
let config = {
  imap: {
    user: "bennisondevadoss@gmail.com", // If the our email account's less secure app permission is not enabled, the Imap-sample will give an error Invalid Credentials.
    password: "YourEmailId",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    authTimeout: 3000,
  },
};
imaps.connect(config).then(function (connection) {
  return connection.openBox("INBOX").then(function () {
    let searchCriteria = ["1:50"];
    let fetchOptions = {
      bodies: ["HEADER", "TEXT", ""],
    };
    return connection.search(searchCriteria, fetchOptions).then(function (messages) {
      for (let item of messages) {
        let all = _.find(item.parts, { which: "" });
        let id = item.attributes.uid;
        let idHeader = "Imap-Id: " + id + "\r\n";
        simpleParser(idHeader + all.body, (err, mail) => {
          let sub = mail.subject;
          if (sub == "Your OTP for login to ChiefNET Application") {
            let text = mail.text;
            text = text.replace(/[^0-9]/g, "");
            console.log("replace text is ", text);
            let content = text;
            console.log("content is", content);
            fs.appendFileSync("./otp.txt", content + "\r\n", (err) => {
              if (err) {
                console.error(err);
                return;
              }
            });
          }
        });
      }
    });
  });
});

let otp;
setTimeout(function () {
  readLastLines
    .read(
      "./otp.txt",
      1
    ) /* Here the one (1) is used to mention, how many line we want from the last */
    .then((lines) => {
      otp = lines;
      console.log("otp is", otp);
    });
}, 20000);
setTimeout(function () {
  fs.truncate("./otp.txt", 0, function () {
    console.log("otp.txt file is cleared successfully");
  }); /* Here the fs.truncate function reduce the file size to zero, Which means the tile will be set to empty file */
}, 22000);

setTimeout(function () {
  tmp = {
    otp: otp,
    email: "bennisondevadoss@gmail.com",
  };

  otpJson.push(tmp);
  var dictstring = JSON.stringify(otpJson);

  var edit = dictstring.replace("\\r\\n", "");
  console.log("edit object is", edit);

  fs.writeFile("otpCredentials.json", edit, function (err, result) {
    console.log("Your OTP is stored in your otpCredentials.json file");
    if (err) {
      console.log("error", err);
      process.exit(0);
    }
    process.exit(1);
  });
}, 25000);
// })
