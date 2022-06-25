import { DEV, EXIT, GO_BACK, SIT6 } from '../../helpers/constants';
import { dmBaseInquirer, easyInquirer } from '../../helpers/inquirer';
import { createAccount, createDeal } from './helpers/dmHelper';

export async function dm() {
  const functionMapper = {
    Dev: dev,
    FiveEight: fiveEight,
    sit6: sit6,
  };
  for (;;) {
    const ans = await dmBaseInquirer();
    if (ans.DM === GO_BACK.value) {
      return;
    } else if (ans.DM === EXIT.value) {
      process.exit();
    } else {
      await functionMapper[ans.DM]();
    }
  }
}

export async function dev() {
  const fnMapper = {
    CA: createAccount,
    CLD: () => createDeal(false, DEV),
    CD: () => createDeal(true, DEV),
  };

  for (;;) {
    const ans = await easyInquirer(
      [
        { name: 'Create account', value: 'CA' },
        { name: 'Create live deal', value: 'CLD' },
        { name: 'Create draft deal', value: 'CD' },
      ],
      'dev'
    );
    if (ans.dev === GO_BACK.value) {
      return;
    } else if (ans.dev === EXIT.value) {
      process.exit();
    } else {
      await fnMapper[ans.dev]();
    }
  }
}
export function fiveEight() {
  console.log('i ams works ');
}
export async function sit6() {
  const fnMapper = {
    SCA: createAccount,
    SCLD: () => createDeal(false, SIT6),
    SCD: () => createDeal(true, SIT6),
  };

  for (;;) {
    const ans = await easyInquirer(
      [
        { name: 'Create account', value: 'SCA' },
        { name: 'Create live deal', value: 'SCLD' },
        { name: 'Create draft deal', value: 'SCD' },
      ],
      'dev'
    );
    if (ans.dev === GO_BACK.value) {
      return;
    } else if (ans.dev === EXIT.value) {
      process.exit();
    } else {
      await fnMapper[ans.dev]();
    }
  }
}
