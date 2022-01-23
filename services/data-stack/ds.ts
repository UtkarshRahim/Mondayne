import { BACK } from "../../helpers/constants";
import { dsBaseInquirer, dsDefectInquirer } from "../../helpers/inquirer";
import {
  assignToQa,
  changeStatus,
  checkOrEscape,
  getDefectDetails,
  getEntitites,
  getStoryDetails,
} from "./dsHelper";

export async function ds() {
  const functionMapper = {
    FD: fetchDefects,
    FS: fetchStories,
  };
  for (;;) {
    const choice = await dsBaseInquirer();
    if (choice.ds === BACK.value) {
      return;
    } else {
      await functionMapper[choice.ds]();
    }
  }
}

async function fetchDefects() {
  let id: any;
  let task: any;
  await getEntitites("defect")
    .then((choice) => checkOrEscape(choice, "defect"))
    .then((choice) => (id = choice.defect))
    .then(() => dsDefectInquirer().then((tasks) => (task = tasks.task)))
    .then(() => {
      const call = {
        P: async (id) => getDefectDetails(id).then((resp) => console.log(resp)),
        CS: changeStatus,
        ATQ: assignToQa,
      };
      return call[task](id);
    })
    .catch((e) => {});
}

async function fetchStories() {
  let id: any;
  let task: any;
  await getEntitites("story")
    .then((choice) => checkOrEscape(choice, "story"))
    .then((choice) => (id = choice.story))
    .then(() => dsDefectInquirer().then((tasks) => (task = tasks.task)))
    .then(() => {
      const fnMapper = {
        P: async (id) => getStoryDetails(id).then((resp) => console.log(resp)),
        CS: changeStatus,
        ATQ: assignToQa,
      };
      return fnMapper[task](id);
    })
    .catch((e) => {});
}
