import inquirer from "inquirer";
import { services } from "../helpers/general";
import { BACK, EXIT } from "./constants";

inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

export const basicInquirer = (options: {
  type: any;
  name: any;
  message: any;
  choices: any;
}) => {
  return inquirer.prompt([options]);
};

export const defaultInquirer = () => {
  return basicInquirer({
    type: "list",
    name: "service",
    message: "Select type",
    choices: [...Object.keys(services), ...[EXIT]],
  });
};

export const easyInquirer = (
  choices,
  name,
  message = "Make a selection",
  type = "list"
) => {
  choices.push(BACK);
  return basicInquirer({
    type,
    name,
    message,
    choices,
  });
};

export function autoCompleteInquirer(name, message, source) {
  return inquirer.prompt([
    {
      type: "autocomplete",
      name,
      message,
      source,
    },
  ]);
}

export const dsBaseInquirer = () => {
  return basicInquirer({
    type: "list",
    name: "ds",
    message: "Select type",
    choices: [
      { name: "Fetch my defects", value: "FD" },
      { name: "Fetch my stories", value: "FS" },
      BACK,
    ],
  });
};

export const gitBaseInquirer = () => {
  return basicInquirer({
    type: "list",
    name: "Git",
    message: "Select type",
    choices: [
      { name: "Create branch for story/defect", value: "CBS" },
      { name: "Create Named branch", value: "CNB" },
      BACK,
    ],
  });
};

export const xcroBaseInquirer = () => {
  return basicInquirer({
    type: "list",
    name: "env",
    message: "Select type",
    choices: [
      { name: "Dev", value: "Dev" },
      { name: "58", value: "FiveEight" },
      { name: "sit6", value: "sit6" },
      BACK,
      EXIT,
    ],
  });
};

export const dsDefectInquirer = () => {
  return basicInquirer({
    type: "list",
    name: "task",
    message: "Select Task",
    choices: [
      { name: "Assign to QA", value: "ATQ" },
      { name: "Change status", value: "CS" },
      { name: "Peek", value: "P" },
      BACK,
    ],
  });
};

export const dsStatusesInquirer = (isDefect, status = "") => {
  const statusMapper = {
    IP: isDefect ? "Dev In Progress" : "In Progress",
    O: isDefect ? "Open" : "Identified",
    PR: "Awaiting PR Approval",
  };

  const statuses = isDefect
    ? ["Awaiting PR Approval", "Dev In Progress", "Open", "Cannot Reproduce"]
    : ["In Progress", "Awaiting PR Approval"];
  return status
    ? { status: statusMapper[status] }
    : easyInquirer(statuses, "status");
};
