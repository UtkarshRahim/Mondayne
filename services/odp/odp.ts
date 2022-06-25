import { EXIT, GO_BACK } from '../../helpers/constants';
import { odpBaseInquirer, odpDefectInquirer } from '../../helpers/inquirer';
import { checkOrEscape, _throw } from '../../helpers/misc';
import {
  assignToQa,
  changeStatus,
  fetchEntities,
  getDefectDetails,
  getStoryDetails,
} from './helpers/odphelper';

export async function odp() {
  const functionMapper = {
    FD: fetchMyDefects,
    FS: fetchMyStories,
  };
  for (;;) {
    const ans = await odpBaseInquirer();
    if (ans.ODP === GO_BACK.value) {
      return;
    } else {
      await functionMapper[ans.ODP]();
    }
  }
}

async function fetchMyDefects() {
  let id: any;
  let task: any;
  await fetchEntities('defect')
    .then((ans) => checkOrEscape(ans, 'defect'))
    .then((ans) => (id = ans.defect))
    .then(() => odpDefectInquirer().then((tasks) => (task = tasks.task)))
    .then(() => {
      const fnMapper = {
        P: async (id) => getDefectDetails(id).then((resp) => console.log(resp)),
        CS: changeStatus,
        ATQ: assignToQa,
      };
      return fnMapper[task](id);
    })
    .catch((e) => {});
}

async function fetchMyStories() {
  let id: any;
  let task: any;
  await fetchEntities('story')
    .then((ans) => checkOrEscape(ans, 'story'))
    .then((ans) => (id = ans.story))
    .then(() => odpDefectInquirer().then((tasks) => (task = tasks.task)))
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
