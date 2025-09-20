import flagList from "./flags/index.js";

const flagMap = flagList.slice(0);

const acceptedFlags = flagMap.flatMap((flag) => flag.name);
const mandatoryFlags = flagMap.filter((flag) => flag.mandatory).flatMap((flag) => flag.name);

const separateShortFlags = (flags) => {
  const availableFlags = acceptedFlags;
  const flagsTruncated = flags.slice(1);
  return Array.from(flagsTruncated).filter((flag) => availableFlags.includes(flag));
};

const findFlags = (input) => {
  let separatedFlags;

  if (input.startsWith("--")) separatedFlags = [input];
  else if (input.startsWith("-")) separatedFlags = separateShortFlags(input);
  else return [];

  return separatedFlags;
};

const searchUntilFlag = (args) => {
  const remainingArgs = [];
  for (let a of args) {
    if (findFlags(a).length !== 0) break;
    remainingArgs.push(a);
  }
  return remainingArgs;
};

const buildFlags = (input, remainingArgs) => {
  let separatedFlags = findFlags(input);
  if (separatedFlags.length === 0) return;

  const fullFlags = separatedFlags
    .map((flag) => {
      const full = flagMap.find((fm) => fm.name.includes(flag));
      if (full.takesArgs) {
        if (remainingArgs.length === 1) {
          throw new Error(`${full.name} expects an argument`);
        }
        full.args = searchUntilFlag(remainingArgs.slice(1));
        full.handler = full.handler.bind(searchUntilFlag(remainingArgs.slice(1)));
        full.handler();
      }
      return full;
    })
    .flat();
  return fullFlags;
};

/** @returns {import("./flags").Flag[]} */
export const handleInput = () => {
  const args = process.argv.slice(2);

  const flags = Array.from(
    new Set(
      args
        .reduce((final, flag, index, arr) => {
          const parsed = buildFlags(flag, arr.slice(index));
          if (parsed) final.push(parsed);
          return final;
        }, [])
        .flat(),
    ),
  );

  if (!flags.some((flag) => flag.name.every((f) => mandatoryFlags.includes(f))))
    throw new Error(`The flag(s): ${mandatoryFlags} are mandatory\n\nRun 'npm run check -- -h' for more info`);

  return flags;
};
