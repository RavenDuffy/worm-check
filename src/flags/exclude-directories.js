const defaultList = ["node_modules", ".git", "venv", "__pycache__"];
function buildExcludedList() {
  return { excludes: Array.from(new Set([...defaultList, ...this])) };
}

/** @type {import(".").Flag} */
const flag = {
  name: ["e", "--exclude-directories"],
  desc: `Add to the existing list of excluded directories. The current list is: [${defaultList.join(", ")}]`,
  takesArgs: true,
  type: "define",
  handler: buildExcludedList,
};

export default flag;
