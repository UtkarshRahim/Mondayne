import { data } from '../../../creds';
import {
  COMPLETE_USER_TASK_DEV,
  DEAL_ACCOUNTS,
  DEAL_BASIC,
  DEAL_PARTY_ACCOUNT,
  DEAL_PARTY_BASIC,
  DEAL_PARTY_CONTACT,
  GET_DEAL_ACCOUNTS,
  ODP_CREATE_ACCOUNT,
  WORKITEM,
  WORKITEM_LIST,
} from '../../../helpers/constants';
import { _throw } from '../../../helpers/misc';
import {
  devCheck,
  devGet,
  devPost,
  devPut,
  ODPCheck,
  odpPost,
} from './credManager';
import {
  getAccountsJSON,
  getDealAccountsJSON,
  getDealJSON,
  getEcommPartyJson,
  getMakeLiveJSON,
  getPartyAccountsJSON,
  getPartyContactJSON,
  getPartyJSON,
  saveCommentsJSON,
} from './staticData';

const entityMapper = {
  createAndAddAccount: _createAndAddAccount,
  createParty: _createParty,
  createEcommParty: _createEcommParty,
  createPartyContacts: _createPartyContacts,
  createPartyAccounts: _createPartyAccounts,
};

const PartyEntitiesMapper = {
  contacts: {
    fn: getPartyContactJSON,
    api: DEAL_PARTY_CONTACT,
    msg: 'contact',
  },
  accounts: {
    fn: getPartyAccountsJSON,
    api: DEAL_PARTY_ACCOUNT,
    msg: 'account',
  },
};

export async function createDeal(draft = false, env) {
  let dealData: any;
  let dealBasicData: any;
  await devCheck(env);
  return devPost(env, DEAL_BASIC, getDealJSON())
    .then((_dealData) => (dealData = _dealData.data))
    .then((resp) => console.log('*** created deal ***', resp.refId))
    .then(() => createEntity(env, 'createAndAddAccount', dealData, 4))
    .then((accData) =>
      createEntity(env, 'createEcommParty', { accData, dealData }, 1)
    )
    .then(() => createEntity(env, 'createParty', dealData, 2))
    .then(() => (draft ? _throw('ONDRAFT') : ''))
    .then(() => moveToChecker(env, dealData, true))
    .then(() => getDealDetails(env, dealData, true))
    .then((_dealBasicData) => (dealBasicData = _dealBasicData))
    .then(() => saveComments(env, dealBasicData, true))
    .then(() => makeDealLive(env, dealData, true))
    .catch((e) => {});
}

export function moveToChecker(env, dealData, skipCheck = false) {
  const input = {
    processId: dealData.dealId,
    userTask: 'DEALMAKER',
    refId: dealData.refId,
    userId: data.devUsername,
    userName: data.devUsername,
    checklist: [],
    action: 'Submit',
  };
  return devPost(env, COMPLETE_USER_TASK_DEV, input, skipCheck).then((_) =>
    console.log('Moved to checker ')
  );
}

export function getDealDetails(env, dealData, skipCheck = false) {
  return devGet(
    env,
    `${WORKITEM_LIST}/${dealData.dealId}/BASIC`,
    {},
    skipCheck
  ).then((resp) => resp.data[0]);
}

export function getWorkItemInfo(env, dealData, skipCheck = false) {
  return devGet(
    env,
    WORKITEM,
    {
      select: '_id,old',
      filter: {
        dealId: dealData.dealId,
        uniqueId: dealData.dealId,
        status: 'PDNG',
        section: 'BASIC',
      },
    },
    skipCheck
  ).then((resp) => resp.data);
}

export function saveComments(env, basicDealData, skipCheck = false) {
  return devPut(
    env,
    WORKITEM,
    `${basicDealData._id}/BASIC/${basicDealData._id}`,
    saveCommentsJSON(basicDealData._id, basicDealData.refId, basicDealData),
    skipCheck
  ).then((_) => console.log('Saved the comments'));
}

export function makeDealLive(env, dealData, skipCheck = false) {
  return devPost(
    env,
    COMPLETE_USER_TASK_DEV,
    getMakeLiveJSON(dealData.dealId, dealData.refId, data.devUsername),
    skipCheck
  ).then(() => {
    console.log('Deal is live ', dealData.refId);
  });
}

export async function createEntity(env, type, reqData, n = 4) {
  if (type === 'createAndAddAccount') {
    await ODPCheck();
  } else {
    await devCheck(env);
  }

  return await Promise.all(
    Array(n)
      .fill(true)
      .map((_) => entityMapper[type](env, reqData))
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
      console.log('*** created account ***', resp.data._id);
      return resp.data;
    }
  );
}

export function _createAndAddAccount(env, dealData) {
  return _createAccount(true)
    .then((resp) => {
      return devPost(
        env,
        DEAL_ACCOUNTS,
        getDealAccountsJSON(dealData.refId, dealData.dealId, resp._id)
      );
    })
    .catch((e) => console.log('e', e));
}

export function _createParty(env, dealData, skipCheck = true) {
  let partyData: any = {};
  return devPost(
    env,
    DEAL_PARTY_BASIC,
    getPartyJSON(dealData.refId, dealData.dealId, dealData.new.processingUnits),
    skipCheck
  )
    .then((_partyData) => (partyData = _partyData.data))
    .then(() => createEntity(env, 'createPartyContacts', partyData))
    .then(() => createEntity(env, 'createPartyAccounts', partyData))
    .catch((e) => console.log('e', e));
}

export function _createEcommParty(env, { dealData }, skipCheck = true) {
  let partyData: any = {};
  return devGet(env, GET_DEAL_ACCOUNTS.replace('{dealID}', dealData.dealId))
    .then((accountsResp) => accountsResp.data)
    .then((accounts: Array<any>) => {
      return Promise.all(
        accounts
          .filter((_, index) => index < accounts.length / 2)
          .map((account) => {
            return new Promise((resolve, reject) => {
              let debitAccounts = [
                {
                  accountNumber: account.accountNumber,
                  name: account.name,
                  country: account.country,
                  currency: account.currency,
                  status: 'ACTIVE',
                  isUsed: false,
                },
              ];
              return devPost(
                env,
                DEAL_PARTY_BASIC,
                getEcommPartyJson(
                  dealData.refId,
                  dealData.dealId,
                  dealData.new.processingUnits,
                  debitAccounts
                ),
                skipCheck
              )
                .then((_partyData) => (partyData = _partyData.data))
                .then(() => createEntity(env, 'createPartyContacts', partyData))
                .then(() => createEntity(env, 'createPartyAccounts', partyData))
                .then(resolve)
                .catch(reject);
            });
          })
      ).catch((e) => console.log('e', e));
    });
}

export function _createPartyContacts(env, partyData, skipCheck = true) {
  return devPost(
    env,
    DEAL_PARTY_CONTACT,
    getPartyContactJSON(
      partyData.uniqueId,
      partyData.refId,
      partyData.dealId,
      partyData.partyId
    ),
    skipCheck
  ).catch((e) => console.log('e', e));
}

export function _createPartyAccounts(env, partyData, skipCheck = true) {
  return devPost(
    env,
    DEAL_PARTY_ACCOUNT,
    getPartyAccountsJSON(
      partyData.uniqueId,
      partyData.refId,
      partyData.dealId,
      partyData.partyId
    ),
    skipCheck
  ).catch((e) => console.log('e', e));
}
