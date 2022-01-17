import { commandModeMapper } from "./commandMode";
import { data } from "./helpers/constants";
import { services } from "./helpers/general";
import { defaultInquirer } from "./helpers/inquirer";
import { connectToRedis } from "./helpers/redis";

const client: any = connectToRedis();

const getService = (service) => {
  return services[service];
};

client.then(async () => {
  const commandMode = process.argv.length > 2;
  if (!commandMode) {
    for (;;) {
      console.log("\n ----------------- \n");
      const ans = await defaultInquirer();
      if (ans.service !== data.EXIT.value) {
        await getService(ans.service)();
      } else {
        process.exit(0);
      }
    }
  } else {
    const adhocFunctionMapper = commandModeMapper;
    await adhocFunctionMapper[process.argv[2]]();
    process.exit(0);
  }
});
