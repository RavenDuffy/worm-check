import fs from "fs";

function setOutFile() {
  const trimmedPaths = this.map((dir) => ({ trim: dir.split("/").slice(0, -1).join("/"), path: dir })).filter(
    (tp) => tp.trim.length > 0,
  );
  const failedPaths = [];
  trimmedPaths.forEach((tp) => {
    const pathCheck = fs.existsSync(tp.trim);
    if (!pathCheck) failedPaths.push(tp.path);
  });
  if (failedPaths.length > 0) {
    console.error("\x1b[31m%s\x1b[0m", `Error: The following path(s) don't exist: [ ${failedPaths.join(", ")} ]`);
    process.exit();
  }
  return { outFile: this };
}

/** @type {import(".").Flag} */
const flag = {
  name: ["o", "--out-file"],
  desc: "Where to save the report file",
  type: "define",
  takesArgs: true,
  handler: setOutFile,
};

export default flag;
