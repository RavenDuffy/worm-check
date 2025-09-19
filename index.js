import fs from 'fs';
import path from 'path';
import affected from './affected.json' with {type: 'json'};

const __dirname = import.meta.dirname;

if (typeof process.argv[2] === 'undefined') {
  throw 'Please enter at least one directory';
}
const directories = process.argv[2].split(',');
const excludeList = ['node_modules', '.git', 'venv', 'other-files', '__pycache__'];
if (typeof process.argv[3] !== 'undefined') excludeList.concat(process.argv[3]?.split(','));

const fullAffectedList = affected.flatMap((lib) => {
  const name = Object.keys(lib)[0];
  const versions = Object.values(lib)[0]
    .split(/[,\s]/)
    .filter((v) => v);
  return versions.map((v) => `${name}-${v}`);
});

const readSingleDir = (dir, report, initDir) => {
  if (typeof initDir === 'undefined') initDir = dir;
  fs.readdirSync(dir).forEach((file) => {
    const curDir = path.join(dir, file);
    if (!excludeList.some((ex) => file === ex)) {
      if (fs.lstatSync(curDir).isDirectory()) {
        readSingleDir(curDir, report, initDir);
      } else if (fs.lstatSync(curDir).isFile() && (file === 'yarn.lock' || file === 'package-lock.json')) {
        try {
          const fileContents = fs.readFileSync(curDir, {encoding: 'utf-8'});
          const isSafe = fullAffectedList.every((lib) => !fileContents.includes(lib));
          if (!isSafe) {
            const vulnerabilities = [];
            fullAffectedList.forEach((lib) => {
              if (fileContents.includes(lib)) vulnerabilities.push(lib);
            });
            report[initDir].affected.push({directory: curDir, vulnerabilities});
          } else report[initDir].safe.push({directory: curDir});
        } catch (err) {
          console.error('ERROR', err);
        }
      }
    }
  });
};

const readDirs = (dirs) => {
  const report = {};
  dirs.forEach((dir) => {
    report[dir] = {affected: [], safe: []};
    readSingleDir(dir, report);
  });
  fs.writeFileSync('report.json', JSON.stringify(report));
  console.log(`Report written to ${__dirname}/report.json`);
};

readDirs(directories);
