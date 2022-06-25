import { execute, executeMultiple } from '../../helpers/executioner';
import { changeStatus } from '../odp/helpers/odphelper';

export async function genDev(defectId) {
  await gcd()
    .then(() => pg())
    .then(() =>
      defectId.includes('DEF')
        ? `defect/${defectId}_dev`
        : `story/${defectId}_dev`
    )
    .then((name) => createBranch(name))
    .catch((e) => {
      console.log(e);
    });
}

export async function pushDev(defectId, msg = '', pr = false) {
  const branchName = defectId.includes('DEF')
    ? `defect/${defectId}_dev`
    : `story/${defectId}_dev`;
  const message =
    msg ||
    `${defectId} - ${defectId.includes('DEF') ? 'Fixed' : 'Implemented'}`;
  await goToBranch(branchName)
    .then(() => acp(branchName, message))
    .then(() => (pr ? () => changeStatus(defectId, 'PR') : ''))
    .catch((e) => {
      console.log(e);
    });
}

export async function gen10(defectId) {
  const branchName = defectId.includes('DEF')
    ? `defect/${defectId}_1_0`
    : `story/${defectId}_1_0`;
  const to = defectId.includes('DEF')
    ? `defect/${defectId}_dev`
    : `story/${defectId}_dev`;
  await genDev(defectId)
    .then(() => gc10())
    .then(() => pg())
    .then(() => createBranch(branchName))
    .then(() => goToBranch(to))
    .catch((e) => {
      console.log(e);
    });
}

export async function gen11(defectId) {
  const branchName = defectId.includes('DEF')
    ? `defect/${defectId}_1_1`
    : `story/${defectId}_1_1`;
  const to = defectId.includes('DEF')
    ? `defect/${defectId}_dev`
    : `story/${defectId}_dev`;
  await genDev(defectId)
    .then(() => gc11())
    .then(() => pg())
    .then(() => createBranch(branchName))
    .then(() => goToBranch(to))
    .catch((e) => {
      console.log(e);
    });
}

export async function push10(defectId, msg = '', pr = false) {
  const branchName = defectId.includes('DEF')
    ? `defect/${defectId}_1_0`
    : `story/${defectId}_1_0`;

  const to = defectId.includes('DEF')
    ? `defect/${defectId}_dev`
    : `story/${defectId}_dev`;

  await pushDev(defectId, msg, pr)
    .then(() => goToBranch(branchName))
    .then(() => cherryPick(to))
    .then(() => gitPush(branchName))
    .then(() => (pr ? () => changeStatus(defectId, 'PR') : ''))
    .catch((e) => {
      console.log(e);
    });
}
export async function push11(defectId, msg = '', pr = false) {
  const branchName = defectId.includes('DEF')
    ? `defect/${defectId}_1_1`
    : `story/${defectId}_1_1`;

  const to = defectId.includes('DEF')
    ? `defect/${defectId}_dev`
    : `story/${defectId}_dev`;

  await pushDev(defectId, msg, pr)
    .then(() => goToBranch(branchName))
    .then(() => cherryPick(to))
    .then(() => gitPush(branchName))
    .then(() => (pr ? () => changeStatus(defectId, 'PR') : ''))
    .catch((e) => {
      console.log(e);
    });
}

export function gcd() {
  return executeMultiple(['git checkout development']).catch((e) => {
    console.log(e);
  });
}

export function cherryPick(to) {
  return executeMultiple([`git cherry-pick ${to}`]).catch((e) => {
    console.log(e);
  });
}

export function gc64() {
  return executeMultiple(['git checkout release/6.4']).catch((e) => {
    console.log(e);
  });
}

export function gc10() {
  return executeMultiple(['git checkout release/1.0']).catch((e) => {
    console.log(e);
  });
}
export function gc11() {
  return executeMultiple(['git checkout release/1.1']).catch((e) => {
    console.log(e);
  });
}

export function createBranch(name) {
  return executeMultiple([`git checkout -b ${name}`]).catch((e) => {
    console.log(e);
  });
}
export function pg() {
  return executeMultiple(['git fetch && git pull']).catch((e) =>
    console.log(e)
  );
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
