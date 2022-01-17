import { exec } from "child_process";
import { data } from "../../helpers/constants";
import { gitBaseInquirer } from "../../helpers/inquirer";

export async function git() {
  const functionMapper = {
    CNB: gen,
    CBS: gen,
  };
  for (;;) {
    const ans = await gitBaseInquirer();
    if (ans.ODP === data.BACK.value) {
      return;
    } else {
      await functionMapper[ans.Git]();
    }
  }
}

export function gen() {
  return execute("git status").then((val) => {
    console.log("val", val);
  });
}

export const execute = async (command, silent = true) => {
  return new Promise((resolve, reject) => {
    exec(command, (er, stdout, stderr) => {
      if (er || stderr) {
        reject(er || stderr);
      }
      if (!silent) console.log("stdout", stdout);
      resolve(stdout);
    });
  });
};
