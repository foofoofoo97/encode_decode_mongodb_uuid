var ObjectID = require("mongodb").ObjectID;

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

function hexa_to_bin(str) {
  var hex = parseInt(str, 16).toString(2);
  return hex;
}

function num_to_bin(str) {
  var hex = parseInt(str).toString(2);
  return hex;
}

function bin_to_num(str) {
  var hex = parseInt(str, 2);
  return hex;
}

function bin_to_hexa(str) {
  var hex = parseInt(str, 2).toString(16);
  return hex;
}

function hexa_to_ascii(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = "";
  for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

const code_to_char = {
  bill: 0,
  counter: 1,
};

const char_to_code = {
  0: "bill",
  1: "counter",
};

function encode(input) {
  try {
    var inputs = input.split("_");
    var type = code_to_char[inputs[0]];
    if (type == null) {
      console.log("Invalid type");
      return;
    }
    var timestamp = new Date(inputs[1]).getTime();
    var code = ascii_to_hexa(inputs[2]);
    var num = 12 - code.length;

    //add zeros to fill empty space
    for (let n = 0; n < num; n++) {
      code = code + "0";
    }
    var hexInSecond = num_to_hexa(timestamp / 1000);

    var binMillisecond = num_to_bin(timestamp % 1000).toString();

    //add zeros to fill empty space
    var n = 10 - binMillisecond.length;
    for (let x = 0; x < n; x++) {
      binMillisecond = "0" + binMillisecond;
    }

    var binType = num_to_bin(type);
    var n = 6 - binType.length;
    for (let x = 0; x < n; x++) {
      binType = "0" + binType;
    }

    var whole_bin_code = binType + binMillisecond;

    var whole_hexa_code = bin_to_hexa(whole_bin_code);
    var n = 4 - whole_hexa_code.length;

    //add zeros to fill empty space
    for (let x = 0; x < n; x++) {
      whole_hexa_code = "0" + whole_hexa_code;
    }

    var objectIdHexa = hexInSecond + whole_hexa_code + code;
    var obj = new ObjectID.createFromHexString(objectIdHexa);

    return obj;
  } catch (e) {
    console.log("Invalid Values !");
  }
}
function decode(input) {
  var string = input.valueOf().toString();
  var n = 0;
  var ans = "";
  var hexa_code = string.toString().substring(12, 24);
  while (n < 12) {
    if (hexa_code.substring(n, n + 2) != "00") {
      ans = ans + hexa_code.substring(n, n + 2);
    } else {
      break;
    }
    n = n + 2;
  }

  var hexa_timestamp = string.toString().substring(0, 8);
  var type_milliseconds = string.toString().substr(8, 4);
  var type_milliseconds_bin = hexa_to_bin(type_milliseconds);
  var type;
  var milli;
  if (type_milliseconds_bin.length <= 10) {
    milli = bin_to_num(type_milliseconds_bin);
    type = 0;
  } else {
    milli = bin_to_num(
      type_milliseconds_bin.substr(type_milliseconds_bin.length - 10)
    );
    type = bin_to_num(
      type_milliseconds_bin.substr(0, type_milliseconds_bin.length - 10)
    );
  }
  var iosDate = new Date(
    hexa_to_num(hexa_timestamp) * 1000 + milli
  ).toISOString();

  return char_to_code[type] + "_" + iosDate + "_" + hexa_to_ascii(ans);
}

exports.encode = encode;
exports.decode = decode;
