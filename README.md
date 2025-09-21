# worm-check

Simple script to check whether your local repos are affected by the shai-hulud vulnerability

## Prereqs

- Node.js must be installed
- Clone this repo

## Usage

To get a list of all options run: `npm run check -- -h`. This script expects at least `-d` or `--directories` to be
used (e.g. `npm run check -- -d`).

A typical run will look something like `npm run check -- -d /path/to/directory/`.

\*currently this repo only supports local checks.

### Options (flags)

\*any flags that accept input should be space separated

| Name                                                                                    | Accepted Flags            | Accepts Input | Description                                                            |
| --------------------------------------------------------------------------------------- | ------------------------- | ------------- | ---------------------------------------------------------------------- |
| Help                                                                                    | -h, --help                | no            | Get more info about this tool's options                                |
| <span style="color:red">Directories</span> <span style="opacity:0.8">(mandatory)</span> | -d, --directories         | yes           | Takes a list of directories to search                                  |
| Exclude directories                                                                     | -e, --exclude-directories | yes           | Add to the existing list of excluded directories (will not be checked) |
| Out                                                                                     | -o, --out-file            | yes           | Where to save the report file                                          |
| Verbose                                                                                 | -v, --verbose             | no            | Turns on verbose logging                                               |
