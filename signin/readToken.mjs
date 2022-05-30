import fs from "fs";

const fileName = "/home/bennison/myLearning/sipcot_loadtest/signin/token.txt";
const tokens = fs.readFileSync(fileName, { encoding: "utf8", flag: "a+" });
console.log("tokens are", tokens);

const arraytoken = tokens.split("\n");
arraytoken.pop();
console.log(arraytoken);
const obj = [];
arraytoken.forEach((value) => {
  obj.push({ token: value });
});

console.log(arraytoken.length);
console.log("object is", obj);

fs.writeFileSync("bearerCredential.json", JSON.stringify(obj), "UTF-8", { flags: "w+" });
