var Db = require("mongodb").Db,
  MongoClient = require("mongodb").MongoClient,
  Server = require("mongodb").Server,
  ReplSetServers = require("mongodb").ReplSetServers,
  ObjectID = require("mongodb").ObjectID,
  Binary = require("mongodb").Binary,
  GridStore = require("mongodb").GridStore,
  Grid = require("mongodb").Grid,
  Code = require("mongodb").Code,
  assert = require("assert");

function ascii_to_hexa(str) {
  var string = "";
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    string += hex;
  }
  return string;
}

function num_to_hexa(str) {
  var hex = parseInt(str).toString(16);
  return hex;
}

function hexa_to_num(str) {
  var hex = parseInt(str, 16);
  return hex;
}

function hexa_to_ascii(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = "";
  for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

//convert special code to hexadecimal
var hexa = ascii_to_hexa("0busxs");
var num = 12 - hexa.length;

//add zeros to fill empty space
for (let n = 0; n < num; n++) {
  hexa = hexa + "0";
}

// Generate Timestamp
let anyTimeInMillisecs = new Date("2021-03-31T03:41:51.449Z");
var thisTimeStamp = anyTimeInMillisecs.getTime();
var timeStamp_hexa = num_to_hexa(thisTimeStamp);
timeStamp_hexa = timeStamp_hexa + "0"; //11 char + 1 "0"

// Create a new ObjectID using the createFromHexString function
var newObjectId = new ObjectID.createFromHexString(timeStamp_hexa + hexa);

// DECODE
var ans = "";
var n = 0;

//Convert timestamp to IOS date
var time = newObjectId.valueOf().toString().substring(0, 11);
console.log(time);
console.log(hexa_to_num(time));
var iosDate = new Date(hexa_to_num(time)).toISOString();

//retrieve special code
//null characters is ignored
hexa = newObjectId.valueOf().toString().substring(12);
console.log(hexa);
while (n < 12) {
  if (hexa.substring(n, n + 2) != "00") {
    ans = ans + hexa.substring(n, n + 2);
  } else {
    break;
  }
  n = n + 2;
}

var code = "bill_" + iosDate + "_" + hexa_to_ascii(ans);
console.log(code);
