import fs from 'fs';
import path from 'path';
import affected from './affected.json' with {type: 'json'};

if (typeof process.argv[2] === 'undefined') {
  throw 'Please enter at least one directory';
}
const dirs = process.argv[2].split(',');
const excludeList = ['node_modules', '.git', 'venv', 'other-files', '__pycache__'];
if (typeof process.argv[3] !== 'undefined') excludeList.concat(process.argv[3]?.split(','));

const fullAffectedList = affected.flatMap((lib) => {
  const name = Object.keys(lib)[0];
  const versions = Object.values(lib)[0]
    .split(/[,\s]/)
    .filter((v) => v);
  return versions.map((v) => `${name}-${v}`);
});

const readSingleDir = async (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const curDir = path.join(dir, file);
    if (!excludeList.some((ex) => file === ex)) {
      if (fs.lstatSync(curDir).isDirectory()) {
        readSingleDir(curDir);
      } else if (fs.lstatSync(curDir).isFile() && (file === 'yarn.lock' || file === 'package-lock.json')) {
        try {
          const fileContents = fs.readFileSync(curDir, {encoding: 'utf-8'});
          const isSafe = fullAffectedList.every((lib) => {
            return !fileContents.includes(lib);
          });
          if (!isSafe) console.log(`${curDir} is using affected library: ${lib}`);
          console.log(fileContents);
        } catch (err) {
          console.error('ERROR', err);
        }
      }
    }
  });
};

await readSingleDir(dirs[0]);
