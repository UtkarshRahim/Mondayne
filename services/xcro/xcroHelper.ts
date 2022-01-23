import {
  COMPLETE_USER_TASK_DEV,
  DEAL_ACCOUNTS,
  DEAL_BASIC,
  DEAL_PARTY_ACCOUNT,
  DEAL_PARTY_BASIC,
  DEAL_PARTY_CONTACT,
  ODP_CREATE_ACCOUNT,
  WORKITEM,
  WORKITEM_LIST,
} from "../../helpers/constants";
import { _throw } from "../../helpers/general";
import { xcroLoginCreds } from "../../loginCreds";
import {
  getAccountsJSON,
  getDealAccountsJSON,
  getDealJSON,
  getMakeLiveJSON,
  getPartyAccountsJSON,
  getPartyContactJSON,
  getPartyJSON,
  saveCommentsJSON,
} from "./data";
import {
  devCheck,
  devGet,
  devPost,
  devPut,
  ODPCheck,
  odpPost,
} from "./xcroManager";
const entityMapper = {
  createAndAddAccount: _createAndAddAccount,
  createParty: _createParty,
  createPartyContacts: _createPartyContacts,
  createPartyAccounts: _createPartyAccounts,
};

const PartyEntitiesMapper = {
  contacts: {
    fn: getPartyContactJSON,
    api: DEAL_PARTY_CONTACT,
    msg: "contact",
  },
  accounts: {
    fn: getPartyAccountsJSON,
    api: DEAL_PARTY_ACCOUNT,
    msg: "account",
  },
};

export async function createDeal(draft = false) {
  let dealData: any;
  let dealBasicData: any;
  await devCheck();
  return devPost(DEAL_BASIC, getDealJSON())
    .then((_dealData) => (dealData = _dealData.data))
    .then((resp) => console.log("*** Deal Created ***", resp.refId))
    .then(() => createEntity("createAndAddAccount", dealData))
    .then(() => createEntity("createParty", dealData))
    .then(() => (draft ? _throw("ONDRAFT") : ""))
    .then(() => moveToChecker(dealData, true))
    .then(() => getDealDetails(dealData, true))
    .then((_dealBasicData) => (dealBasicData = _dealBasicData))
    .then(() => saveComments(dealBasicData, true))
    .then(() => makeDealLive(dealData, true))
    .catch((e) => {});
}

export function moveToChecker(dealData, skipCheck = false) {
  const input = {
    processId: dealData.dealId,
    userTask: "DEALMAKER",
    refId: dealData.refId,
    userId: xcroLoginCreds.username,
    userName: xcroLoginCreds.username,
    checklist: [],
    action: "Submit",
  };
  return devPost(COMPLETE_USER_TASK_DEV, input, skipCheck).then((_) =>
    console.log("Moved to checker")
  );
}

export function getDealDetails(dealData, skipCheck = false) {
  return devGet(
    `${WORKITEM_LIST}/${dealData.dealId}/BASIC`,
    {},
    skipCheck
  ).then((resp) => resp.data[0]);
}

export function getWorkItemInfo(dealData, skipCheck = false) {
  return devGet(
    WORKITEM,
    {
      select: "_id,old",
      filter: {
        dealId: dealData.dealId,
        uniqueId: dealData.dealId,
        status: "PDNG",
        section: "BASIC",
      },
    },
    skipCheck
  ).then((resp) => resp.data);
}

export function saveComments(basicDealData, skipCheck = false) {
  return devPut(
    WORKITEM,
    `${basicDealData._id}/BASIC/${basicDealData._id}`,
    saveCommentsJSON(basicDealData._id, basicDealData.refId, basicDealData),
    skipCheck
  ).then((_) => console.log("Added comments"));
}

export function makeDealLive(dealData, skipCheck = false) {
  return devPost(
    COMPLETE_USER_TASK_DEV,
    getMakeLiveJSON(dealData.dealId, dealData.refId, xcroLoginCreds.username),
    skipCheck
  ).then(() => {
    console.log("Deal is live", dealData.refId);
  });
}

export async function createEntity(type, reqData, n = 2) {
  if (type === "createAndAddAccount") {
    await ODPCheck();
  } else {
    await devCheck();
  }

  await Promise.all(
    Array(n)
      .fill(true)
      .map((_) => entityMapper[type](reqData))
  );
}

export async function createAccount(n = 1) {
  let skipCheck = false;

  if (n > 1) {
    ODPCheck();
    skipCheck = true;
  }
  return await Promise.all(
    Array(n)
      .fill(true)
      .map((_) => _createAccount(skipCheck))
  );
}

export function _createAccount(skipCheck = false) {
  return odpPost(ODP_CREATE_ACCOUNT, getAccountsJSON(), skipCheck).then(
    (resp) => {
      console.log("*** Account Created ***", resp.data._id);
      return resp.data;
    }
  );
}

export function _createAndAddAccount(dealData) {
  return _createAccount(true)
    .then((resp) => {
      return devPost(
        DEAL_ACCOUNTS,
        getDealAccountsJSON(dealData.refId, dealData.dealId, resp._id)
      );
    })
    .catch((e) => console.log(e));
}

export function _createParty(dealData, skipCheck = true) {
  let partyData: any = {};
  return devPost(
    DEAL_PARTY_BASIC,
    getPartyJSON(dealData.refId, dealData.dealId, dealData.new.processingUnits),
    skipCheck
  )
    .then((_partyData) => (partyData = _partyData.data))
    .then(() => createEntity("createPartyContacts", partyData))
    .then(() => createEntity("createPartyAccounts", partyData))
    .catch((e) => console.log(e));
}

export function _createPartyContacts(partyData, skipCheck = true) {
  return devPost(
    DEAL_PARTY_CONTACT,
    getPartyContactJSON(
      partyData.uniqueId,
      partyData.refId,
      partyData.dealId,
      partyData.partyId
    ),
    skipCheck
  ).catch((e) => console.log(e));
}

export function _createPartyAccounts(partyData, skipCheck = true) {
  return devPost(
    DEAL_PARTY_ACCOUNT,
    getPartyAccountsJSON(
      partyData.uniqueId,
      partyData.refId,
      partyData.dealId,
      partyData.partyId
    ),
    skipCheck
  ).catch((e) => console.log(e));
}
