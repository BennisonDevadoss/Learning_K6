var imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const readLastLines = require('read-last-lines');
const _ = require('lodash');
const fs = require('fs');
const { replace } = require('lodash');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
var config = {
    imap: {
        user: 'bennisondevadoss@gmail.com',
        password: 'xxxxxxxx',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        authTimeout: 3000
    }
};

imaps.connect(config).then(function (connection) {
    return connection.openBox('INBOX').then(function () {
        var searchCriteria = ['1:50'];
        var fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
        };
        return connection.search(searchCriteria, fetchOptions).then(function (messages) {
            for (let item of messages) {
                var all = _.find(item.parts, { "which": "" })
                var id = item.attributes.uid;
                var idHeader = "Imap-Id: " + id + "\r\n";
                simpleParser(idHeader + all.body, (err, mail) => {
                    let sub = mail.subject
                    if (sub == "Reset your ChiefNET password") {
                        let text = mail.text;
                        function detectURLs(message) {
                            var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
                            return message.match(urlRegex);
                        }
                        let linkArray = detectURLs(text);
                        let resetPasswordLink = linkArray[0].replace("https://dev.chiefnet.yavar.in/resetpassword?password_token=", "");  /* Change this line and the below line */
                        resetPasswordLink = resetPasswordLink.replace("]", "");
                        console.log("reset password link is", resetPasswordLink)
                        fs.appendFileSync('./link.txt', resetPasswordLink + "\r\n", err => {
                            if (err) {
                                console.error(err)
                                return
                            }

                        })

                    }

                });

            }

        });

    });
});
var link;
setTimeout(function () {
    readLastLines.read('./link.txt', 1)  // have to make changes
        .then((lines) => link = lines);
}, 20000);

setTimeout(function () {
    fs.truncate('./link.txt', 0, function () { console.log('done') })   /* To delete the file contents */

}, 22000);

setTimeout(function () {
    let obj = [];

    tmp = {
        'link': link,
        'email': "bennisondevadoss@gmail.com",
    };

    obj.push(tmp);
    console.log("object is", obj)
    var dictstring = JSON.stringify(obj);

    var edit = dictstring.replace("\\r\\n", "");

    var fs = require('fs');
    fs.writeFile("linkCredentials.json", edit, function (err, result) {
        if (err) console.log('error', err);
    });

}, 25000);