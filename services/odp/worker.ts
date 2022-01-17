import { data } from "../../helpers/constants";
import { workerBaseInquirer } from "../../helpers/inquirer";

export async function odp() {
  const functionMapper = {
    Dev: dev,
    FiveEight: fiveEight,
    sit6: sit6,
  };
  for (;;) {
    const ans = await workerBaseInquirer();
    if (ans.DM === data.BACK.value) {
      return;
    } else {
      await functionMapper[ans.DM]();
    }
  }
}

export function dev() {
  console.log("dev");
}
export function fiveEight() {
  console.log("58");
}
export function sit6() {
  console.log("sit6");
}
