import flagList from "./index.js";

const printHelp = () => {
  console.log("Welcome to worm check\n\nThe flags available are:");
  const acceptsArgsString = `\x1b[2m | Accepts arguments\x1b[0m`;
  flagList.forEach((flag) => {
    console.log(`\x1b[4m\x1b[1m${flag.name}\x1b[0m${flag.takesArgs ? acceptsArgsString : ""}`);
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
