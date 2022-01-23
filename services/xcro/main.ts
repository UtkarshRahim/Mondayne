import { BACK } from "../../helpers/constants";
import { easyInquirer, xcroBaseInquirer } from "../../helpers/inquirer";
import { createAccount, createDeal } from "./xcroHelper";

export async function xcro() {
  const functionMapper = {
    Dev: dev,
    FiveEight: fiveEight,
    sit6: sit6,
  };
  for (;;) {
    const ans = await xcroBaseInquirer();
    if (ans.env === BACK.value) {
      return;
    } else {
      await functionMapper[ans.env]();
    }
  }
}

export async function dev() {
  const fnMapper = {
    CA: createAccount,
    CLD: () => createDeal(),
    CD: () => createDeal(true),
  };

  for (;;) {
    const ans = await easyInquirer(
      [
        { name: "Create account", value: "CA" },
        { name: "Create live deal", value: "CLD" },
        { name: "Create draft deal", value: "CD" },
      ],
      "dev"
    );
    if (ans.dev === BACK.value) {
      return;
    } else {
      await fnMapper[ans.dev]();
    }
  }
}
export function fiveEight() {}
export function sit6() {}
