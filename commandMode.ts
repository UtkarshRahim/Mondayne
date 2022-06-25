import { DEV, SIT6 } from './helpers/constants';
import {
  createAccount,
  createDeal,
} from './services/data-maker/helpers/dmHelper';
import {
  acp,
  gcd,
  gen10,
  gen11,
  genDev,
  push10,
  push11,
  pushDev,
} from './services/git/git';
import { assignToQa, changeStatus } from './services/odp/helpers/odphelper';

export const commandModeMapper = {
  readyForQA: () => assignToQa(process.argv[3], process.argv[4]),
  changeStatus: () => changeStatus(process.argv[3], process.argv[4]),
  createDeal: () =>
    createDeal(!!process.argv[3], process.argv[4] === 'SIT6' ? SIT6 : DEV),
  createAccount: () => createAccount(process.argv[3] && +process.argv[3]),
  genDev: () => genDev(process.argv[3]),
  gen10: () => gen10(process.argv[3]),
  gen11: () => gen11(process.argv[3]),
  pushDev: () => pushDev(process.argv[3], process.argv[4], !!process.argv[5]),
  push10: () => push10(process.argv[3], process.argv[4], !!process.argv[5]),
  push11: () => push11(process.argv[3], process.argv[4], !!process.argv[5]),
  gcd: () => gcd(),
  acp: () => acp(process.argv[3], process.argv[4]),
};
