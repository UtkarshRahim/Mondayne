import { executeMultiple } from "../../helpers/general";
import { changeStatus } from "../data-stack/dsHelper";

export async function genDev(defectId) {
  await gcd()
    .then(() => pg())
    .then(() =>
      defectId.includes("DEF")
        ? `defect/${defectId}_dev`
        : `story/${defectId}_dev`
    )
    .then((name) => createBranch(name))
    .catch((e) => {
      console.log(e);
    });
}

export async function pushDev(defectId, msg = "", pr = false) {
  const branchName = defectId.includes("DEF")
    ? `defect/${defectId}_dev`
    : `story/${defectId}_dev`;
  const message =
    msg ||
    `${defectId} - ${defectId.includes("DEF") ? "Fixed" : "Implemented"}`;
  await goToBranch(branchName)
    .then(() => acp(branchName, message))
    .then(() => (pr ? () => changeStatus(defectId, "PR") : ""))
    .catch((e) => {
      console.log(e);
    });
}

export function gcd() {
  return executeMultiple(["git checkout development"]).catch((e) => {
    console.log(e);
  });
}

export function gc64() {
  return executeMultiple(["git checkout release/6.4"]).catch((e) => {
    console.log(e);
  });
}

export function gc65() {
  return executeMultiple(["git checkout release/6.5"]).catch((e) => {
    console.log(e);
  });
}

export function createBranch(name) {
  return executeMultiple([`git checkout -b ${name}`]).catch((e) => {
    console.log(e);
  });
}
export function pg() {
  return executeMultiple([
    "git fetch",
    "git stash",
    "git pull",
    "git stash pop",
  ]).catch((e) => {
    console.log(e);
  });
}
export function goToBranch(branch) {
  return executeMultiple([`git checkout ${branch}`]).catch((e) => {
    console.log(e);
  });
}
export async function acp(branch, msg) {
  return await gitAdd()
    .then(() => gitCommit(msg))
    .then(() => gitPush(branch))
    .catch((e) => {
      console.log(e);
    });
}
export function gitAdd() {
  return executeMultiple([`git add .`]).catch((e) => {
    console.log(e);
  });
}
export function gitCommit(msg) {
  return executeMultiple([`git commit -m "${msg}"`]).catch((e) => {
    console.log(e);
  });
}
export function gitPush(branch) {
  return executeMultiple([`git push origin ${branch}`]).catch((e) => {
    console.log(e);
  });
}
