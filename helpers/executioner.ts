import { exec } from 'child_process';
import { _throw } from './misc';

export const execute = async (command, silent = true) => {
  console.log('command', command);
  return new Promise((resolve, reject) => {
    exec(command, (er, stdout, stderr) => {
      if (er || stderr) {
        reject(er || stderr);
      }
      if (!silent) console.log('stdout', stdout);
      resolve(stdout);
    });
  }).catch((e) => {
    if (e && e.cmd !== 'git stash pop') console.log(e);
  });
};

export const executeMultiple = async (comms: Array<any>) => {
  return comms
    .map((p) => execute(p))
    .reduce((prev, curr) => prev.then(() => curr))
    .catch((e) => console.log(e));
};
