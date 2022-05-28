import fs from 'fs';

const fileName = '/home/bennison/myLearning/sipcot_loadtest/signin/token.txt'
const tokens = fs.readFileSync(fileName,
    { encoding: 'utf8', flag: 'a+' });
console.log("tokens are", tokens)

const obj = [{
    token: tokens
}]



const dictstring = JSON.stringify(obj);
var edit = dictstring.replace("\\r\\n", "");
console.log("edit is ", edit)

const fileName1 = "/home/bennison/myLearning/sipcot_loadtest/signin/bearerCredential.json"

fs.writeFileSync(fileName1, edit, "UTF-8", { 'flags': 'w+' });