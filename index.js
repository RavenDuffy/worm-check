import fs, { accessSync, constants } from "fs";
import path from "path";
import affected from "./affected.json" with { type: "json" };
import { handleInput } from "./src/handleInput.js";

const __dirname = import.meta.dirname;

const flags = handleInput();

const config = {};
flags.forEach((flag) => {
  if (typeof config[flag.type] === "undefined") config[flag.type] = [];
  config[flag.type] = [...config[flag.type], flag.handler];
});

if (typeof config.block !== "undefined") {
  config.block.forEach((handler) => handler());
  process.exit();
}

const definitions = config.define?.reduce((defs, handler) => ({ ...defs, ...handler() }), {});
const useLogs = config.log?.length > 0;

const fullAffectedList = affected.flatMap((lib) => {
  const name = Object.keys(lib)[0];
  const versions = Object.values(lib)[0]
    .split(/[,\s]/)
    .filter((v) => v);
  return versions.map((v) => `${name}-${v}`);
});

const readSingleDir = (dir, report, initDir) => {
  if (typeof initDir === "undefined") initDir = dir;
  if (useLogs) console.log(`Reading ${dir}`);

  try {
    accessSync(dir, constants.R_OK);
  } catch (err) {
    return;
  }

  fs.readdirSync(dir).forEach((file) => {
    const curDir = path.join(dir, file);
    if (!definitions.excludes?.some((ex) => file === ex)) {
      if (fs.lstatSync(curDir).isDirectory()) {
        readSingleDir(curDir, report, initDir);
      } else if (fs.lstatSync(curDir).isFile() && (file === "yarn.lock" || file === "package-lock.json")) {
        try {
          const fileContents = fs.readFileSync(curDir, { encoding: "utf-8" });
          const isSafe = fullAffectedList.every((lib) => !fileContents.includes(lib));
          if (!isSafe) {
            const vulnerabilities = [];
            fullAffectedList.forEach((lib) => {
              if (fileContents.includes(lib)) vulnerabilities.push(lib);
            });
            report[initDir].affected.push({ directory: curDir, vulnerabilities });
          } else report[initDir].safe.push({ directory: curDir });
        } catch (err) {
          console.error("ERROR", err);
        }
      }
    }
  });
};

const readAllDirs = (dirs) => {
  const report = {};
  // console.log(dirs);
  dirs.forEach((dir) => {
    report[dir] = { affected: [], safe: [] };
    readSingleDir(dir, report);
  });
  fs.writeFileSync("report.json", JSON.stringify(report));
  console.log(`Report written to ${__dirname}/report.json`);
};

readAllDirs(definitions.directories);
