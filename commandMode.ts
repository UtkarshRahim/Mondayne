import { assignToQa, changeStatus } from "./services/data-stack/helper";
import { gen } from "./services/git/git";

export const commandModeMapper = {
  readyForQA: () => assignToQa(process.argv[3], process.argv[4]),
  changeStatus: () => changeStatus(process.argv[3], process.argv[4]),
  gen: () => gen(),
};
