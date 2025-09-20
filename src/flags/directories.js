function getDirectories() {
  return { directories: this };
}

/** @type {import(".").Flag} */
const flag = {
  name: ["d", "--directories"],
  desc: "Takes a list of directories to search, this is a mandatory field",
  takesArgs: true,
  type: "define",
  mandatory: true,
  handler: getDirectories,
};

export default flag;
