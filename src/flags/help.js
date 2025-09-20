import flagList from "./index.js";

const printHelp = () => {
  // console.clear();
  console.log("Welcome to worm check\n\nThe flags available are:");
  flagList.forEach((flag) => {
    console.log(`${flag.name}`);
    console.group();
    console.log(`${flag.desc}\n`);
    console.groupEnd();
  });
};

/** @type {import(".").Flag} */
const flag = {
  name: ["h", "--help"],
  desc: "Get more info about this tool's options",
  type: "block",
  takesArgs: false,
  handler: printHelp,
};

export default flag;
