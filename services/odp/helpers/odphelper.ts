import {
  DEFECT_DETAILS,
  GET_CLOUD_USERS,
  GET_SERVICE_DEF,
  MY_DEFECTS,
  MY_STORIES,
  STORY_DETAILS,
} from '../../../helpers/constants';
import {
  autoCompleteInquirer,
  basicInquirer,
  easyInquirer,
  odpStatusesInquirer,
} from '../../../helpers/inquirer';
import { checkOrEscape, _throw } from '../../../helpers/misc';
import { cloudGet, cloudPut } from './credManager';

export function changeStatus(id: string, status = '') {
  let entityDetails: any;
  const [isDefect, detailsFn, detailsApi] = loadInitialData(id);

  return detailsFn(id)
    .then((resp) => respDataFormatter(resp, isDefect))
    .then((resp) => (entityDetails = resp))
    .then(() => odpStatusesInquirer(isDefect, status))
    .then((ans) => checkOrEscape(ans, 'status'))
    .then((ans) => (entityDetails.status = ans.status))
    .then(() => cloudPut(detailsApi, id, entityDetails, true))
    .then((resp: any) => handleLogging(resp, id, entityDetails))
    .catch((e) => {});
}

export function assignToQa(id, to = '') {
  let entityDetails: any,
    nameOfQa: any = {},
    serviceDef: Array<any> = [];
  const [isDefect, detailsFn, detailsApi] = loadInitialData(id);

  return Promise.all([
    detailsFn(id)
      .then((resp) => respDataFormatter(resp, isDefect))
      .then((resp) => (entityDetails = resp)),
    getServiceDefinition(isDefect).then(
      (_serviceDef) => (serviceDef = _serviceDef)
    ),
  ])
    .then(([resp, _]) => (nameOfQa = resp.nameOfTheQa || {}))
    .then(() => getUser(nameOfQa, to).then((ans) => (nameOfQa = ans)))
    .then(() =>
      getComponents(serviceDef).then(
        (ans) => (entityDetails.componentsAffected = ans.components)
      )
    )
    .then(() => setDefaultValues(entityDetails, isDefect, nameOfQa))
    .then(() => cloudPut(detailsApi, id, entityDetails, true))
    .then((resp: any) =>
      handleLogging(resp, id, entityDetails, `And assigned to ${nameOfQa.name}`)
    )
    .catch((e) => {});
}

export function getDefaultFilter() {
  return {
    page: 1,
    count: -1,
    select:
      '_id,summary,priority,assignedTo._id,assignedTo.name,release._id,release.name,release.plannedReleaseDate,status,_metadata.workflow',
    filter: {
      $and: [
        {
          $or: [{ 'assignedTo._id': 'Neel' }, { 'assignedTo.name': 'Neel' }],
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

export function fetchEntities(type) {
  const mapper = {
    defect: {
      fetcherFn: _fetchDefect,
      inquirerName: 'defect',
    },
    story: {
      fetcherFn: _fetchStories,
      inquirerName: 'story',
    },
  };
  const mode = mapper[type];
  return mode
    .fetcherFn()
    .then((response) =>
      response && response.data && response.data.length
        ? response.data
        : _throw()
    )
    .then((response) =>
      easyInquirer(formatChoices(response), mode.inquirerName)
    );
}

export const _fetchDefect = (skipCheck = false) =>
  cloudGet(MY_DEFECTS, getDefaultFilter(), skipCheck);

export const _fetchStories = (skipCheck = false) =>
  cloudGet(MY_STORIES, getDefaultFilter(), skipCheck);

export const getDefectDetails = (id, skipCheck = false) =>
  cloudGet(`${DEFECT_DETAILS}/${id}`, { expand: true }, skipCheck);

export const getStoryDetails = (id, skipCheck = false) =>
  cloudGet(`${STORY_DETAILS}/${id}`, { expand: true }, skipCheck);

const getServiceDefinition = (isDefect) =>
  cloudGet(GET_SERVICE_DEF + '/' + (isDefect ? 'SRVC2022' : 'SRVC2020'), {
    select: 'definition',
    app: 'XCRO',
  }).then((resp) => {
    try {
      return resp.data.definition.find(
        (def) => def.key === 'componentsAffected'
      ).definition[0].properties.enum;
    } catch {
      return [];
    }
  });

const respDataFormatter = (resp, isDefect) =>
  resp && resp.data && resp.data._id
    ? resp.data
    : _throw('cannot find ' + isDefect ? 'Defect' : 'Story');

const handleLogging = (resp, id, entityDetails, extraStr = '') =>
  resp.status === 200
    ? console.log(
        `\n Changed the status of ${id} to ${entityDetails.status} ${extraStr} \n`
      )
    : console.log('\n Some error occured \n' + JSON.stringify(resp.data));

const userSource = (_existinAnsers, name, skipCall = true) =>
  cloudGet(
    GET_CLOUD_USERS,
    {
      count: 20,
      select: 'name',
      filter: { name: `/${name}/` },
    },
    skipCall
  ).then((resp) =>
    resp.data.map((users) => ({
      name: users.name,
      value: { _id: users._id, name: users.name },
    }))
  );

const getComponents = (serviceDef) =>
  basicInquirer({
    type: 'checkbox',
    name: 'components',
    message: 'selected the components affected',
    choices: [{ name: 'just web', value: 'xcro_web' }, ...serviceDef],
  });

function getUser(nameOfQa, to = '') {
  if (to) {
    return userSource({}, to, false).then((resp) => {
      if (resp && resp.length) {
        return resp[0].value;
      } else {
        console.error('No user for that name');
        _throw();
      }
    });
  } else {
    if (nameOfQa._id) {
      return easyInquirer(
        [
          {
            name: nameOfQa.name,
            value: { _id: nameOfQa._id, name: nameOfQa.name },
          },
          { name: 'Someone else', value: 'SE' },
        ],
        'qa',
        'assign to selected QA or someone else ?'
      ).then((ans) => (ans.qa === 'SE' ? userSourceWrapper() : ans.qa));
    } else {
      return userSourceWrapper();
    }
  }
}

const userSourceWrapper = () =>
  autoCompleteInquirer('qa', 'Type the name of the user', userSource).then(
    (resp) => resp.qa
  );

const setDefaultValues = (entityDetails, isDefect, nameOfQa) => {
  entityDetails.status = isDefect ? 'Ready for QA' : 'Completed';
  entityDetails.assignedTo = { _id: nameOfQa._id };
  [
    'newEnvironmentVariables',
    'newErrorMessages',
    'newMigrationScripts',
    'newSchemaChanges',
    'newSetupScripts',
  ].forEach((no) => (entityDetails[no] = 'No'));
};

const loadInitialData = (id) => {
  const isDefect = isDefectFn(id);
  return [
    isDefect,
    isDefect ? getDefectDetails : getStoryDetails,
    isDefect ? DEFECT_DETAILS : STORY_DETAILS,
  ];
};
const isDefectFn = (id) => id.includes('DEF');
