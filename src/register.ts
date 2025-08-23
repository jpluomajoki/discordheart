import { AllCommands } from "./commands.js";
import { InstallGlobalCommands } from "./utils.js";

InstallGlobalCommands(process.env.APP_ID!, AllCommands)
