// const a = require("test");
const assert = require("assert");
var func = require("object_Id");

const input1 = "bill_2021-03-31T03:41:51.449Z_0busxs";
const input2 = "counter_2021-04-02T03:41:51.675Z_0bxs";
const input3 = "bills_2021-03-31T06:41:51.785Z_0buxs";

console.log(func.decode(func.encode(input1)));
console.log(func.decode(func.encode(input2)));
assert(func.decode(func.encode(input1)), input1);
assert(func.decode(func.encode(input2)), input2);
func.encode(input3); // expect throw error
