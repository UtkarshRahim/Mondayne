import {
  BACK,
  DEFECT_DETAILS,
  GET_CLOUD_USERS,
  GET_SERVICE_DEF,
  MY_DEFECTS,
  MY_STORIES,
  STORY_DETAILS,
} from "../../helpers/constants";
import {
  autoCompleteInquirer,
  basicInquirer,
  dsStatusesInquirer,
  easyInquirer,
} from "../../helpers/inquirer";
import { getDs, putDs } from "./dsManager";

export function changeStatus(id: string, status = "") {
  let entityDetails: any;
  const [isDefect, details, detailsApi] = initState(id);

  return details(id)
    .then((resp) => formatResponse(resp, isDefect))
    .then((resp) => (entityDetails = resp))
    .then(() => dsStatusesInquirer(isDefect, status))
    .then((choice) => checkOrEscape(choice, "status"))
    .then((choice) => (entityDetails.status = choice.status))
    .then(() => putDs(detailsApi, id, entityDetails, true))
    .then((resp: any) => manageLog(resp, id, entityDetails))
    .catch((e) => {});
}

export function assignToQa(id, to = "") {
  let entityDetails: any,
    whoQa: any = {},
    serviceDef: Array<any> = [];
  const [isDefect, details, detailsApi] = initState(id);

  return Promise.all([
    details(id)
      .then((resp) => formatResponse(resp, isDefect))
      .then((resp) => (entityDetails = resp)),
    getServiceDefinition(isDefect).then(
      (_serviceDef) => (serviceDef = _serviceDef)
    ),
  ])
    .then(([resp, _]) => (whoQa = resp.nameOfTheQa || {}))
    .then(() => getUser(whoQa, to).then((choice) => (whoQa = choice)))
    .then(() =>
      getComponents(serviceDef).then(
        (choice) => (entityDetails.componentsAffected = choice.components)
      )
    )
    .then(() => setDefaultValues(entityDetails, isDefect, whoQa))
    .then(() => putDs(detailsApi, id, entityDetails, true))
    .then((resp: any) => manageLog(resp, id, entityDetails))
    .catch((e) => {});
}

export function getDefaultFilter() {
  return {
    page: 1,
    count: -1,
    select:
      "_id,summary,priority,assignedTo.name,release.name,release.plannedReleaseDate,status",
    filter: {
      $and: [
        {
          $or: [
            { "assignedTo._id": "Utkarsh" },
            { "assignedTo.name": "Utkarsh" },
          ],
        },
      ],
    },
    expand: true,
  };
}

export const formatChoices = (response) =>
  response.map((defect) => ({
    name: `${defect._id} - ${defect.summary} - ${defect.status} - ${
      defect.release.name || defect.release._id
    }`,
    value: defect._id,
  }));

export function getEntitites(type) {
  const mapper = {
    defect: {
      fetcherFn: getDefects,
      inquirerName: "defect",
    },
    story: {
      fetcherFn: getStories,
      inquirerName: "story",
    },
  };
  const mode = mapper[type];
  return mode
    .fetcherFn()
    .then((response) =>
      response && response.data && response.length ? response.data : _throw()
    )
    .then((response) =>
      easyInquirer(formatChoices(response), mode.inquirerName)
    );
}

export const getDefects = (skipCheck = false) =>
  getDs(MY_DEFECTS, getDefaultFilter(), skipCheck);

export const getStories = (skipCheck = false) =>
  getDs(MY_STORIES, getDefaultFilter(), skipCheck);

export const getDefectDetails = (id, skipCheck = false) =>
  getDs(`${DEFECT_DETAILS}/${id}`, { expand: true }, skipCheck);

export const getStoryDetails = (id, skipCheck = false) =>
  getDs(`${STORY_DETAILS}/${id}`, { expand: true }, skipCheck);

const getServiceDefinition = (isDefect) =>
  getDs(GET_SERVICE_DEF + "/" + (isDefect ? "SRVC2022" : "SRVC2020"), {
    select: "definition",
    app: "XCRO",
  }).then((resp) => {
    try {
      return resp.definition.find((def) => def.key === "componentsAffected")
        .definition[0].properties.enum;
    } catch {
      return [];
    }
  });

const manageLog = (resp, id, entityDetails) =>
  resp.status === 200
    ? console.log(
        `\n Changed the status of ${id} to ${entityDetails.status} \n`
      )
    : console.log("\n Some error occured \n" + JSON.stringify(resp.data));

const getComponents = (serviceDef) =>
  basicInquirer({
    type: "checkbox",
    name: "components",
    message: "selected the components affected",
    choices: [{ name: "just web", value: "xcro_web" }, ...serviceDef],
  });

const getAllUsers = (_existinchoiceers, name, skipCall = true) =>
  getDs(
    GET_CLOUD_USERS,
    {
      count: 20,
      select: "name",
      filter: { name: `/${name}/` },
    },
    skipCall
  ).then((resp) =>
    resp.map((users) => ({
      name: users.name,
      value: { _id: users._id, name: users.name },
    }))
  );
function getUser(whoQa, to = "") {
  if (to) {
    return getAllUsers({}, to, false).then((resp) => {
      if (resp && resp.length) {
        return resp[0].value;
      } else {
        console.error("No user for that name");
        _throw();
      }
    });
  } else {
    if (whoQa._id) {
      return easyInquirer(
        [
          {
            name: whoQa.name,
            value: { _id: whoQa._id, name: whoQa.name },
          },
          { name: "Someone else", value: "SE" },
        ],
        "qa",
        "assign to selected QA or someone else ?"
      ).then((choice) =>
        choice.qa === "SE" ? getAllUsersWrapper() : choice.qa
      );
    } else {
      return getAllUsersWrapper();
    }
  }
}

const getAllUsersWrapper = () =>
  autoCompleteInquirer("qa", "Type the name of the user", getAllUsers).then(
    (resp) => resp.qa
  );

const setDefaultValues = (entityDetails, isDefect, whoQa) => {
  entityDetails.status = isDefect ? "Ready for QA" : "Completed";
  entityDetails.assignedTo = { _id: whoQa._id };
  [
    "newEnvironmentVariables",
    "newErrorMessages",
    "newMigrationScripts",
    "newSchemaChanges",
    "newSetupScripts",
  ].forEach((no) => (entityDetails[no] = "No"));
};

const initState = (id) => {
  const isDefect = isDefectCall(id);
  return [
    isDefect,
    isDefect ? getDefectDetails : getStoryDetails,
    isDefect ? DEFECT_DETAILS : STORY_DETAILS,
  ];
};

export function checkOrEscape(choice, prop) {
  return choice[prop] === BACK.value ? _throw() : choice;
}
const isDefectCall = (id) => id.includes("DEF");

const formatResponse = (resp, isDefect) =>
  resp && resp.data && resp._id
    ? resp.data
    : _throw("cannot find " + isDefect ? "Defect" : "Story");

const _throw = (m = "Generic error") => {
  throw new Error(m);
};
