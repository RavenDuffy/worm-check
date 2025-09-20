/** @type {import(".").Flag} */
const flag = {
  name: ["v", "--verbose"],
  desc: "Turns on verbose logging",
  type: "log",
  takesArgs: false,
  handler: () => {},
};

export default flag;
