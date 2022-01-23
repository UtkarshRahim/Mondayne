import { formatDate, getRandomNumber } from "../../helpers/general";
export const getAccountsJSON = () => {
  const accNo = `URTestACC${getRandomNumber()}`;
  return {
    _id: accNo,
    accountNumber: accNo,
    balances: {
      available: {
        amount: 1000000,
        currency: "INR",
        indicator: "Credit",
        lastUpdatedOn: null,
      },
      eod: {
        amount: 1000000,
        currency: "INR",
        indicator: "Credit",
        lastUpdatedOn: null,
      },
      ledger: {
        amount: 1000000,
        currency: "INR",
        indicator: "Credit",
        lastUpdatedOn: null,
      },
    },
    closedOn: null,
    currency: "INR",
    country: "IND",
    customerId: "123",
    extendedAttributes: {
      pan: null,
      numberDecimal: null,
      dropdown: null,
      date: null,
      aadharNo: "123132",
      vehicleNUmber: null,
      mothersMaidenName: "123",
    },
    name: "ACC",
    openedOn: null,
    status: "ACTIVE",
    helperNotes: {
      withdrawals: null,
      deposits: null,
      priorityShortfall: null,
      additional: null,
    },
    test1233: null,
    accountIdentifierKey: "physical",
  };
};

export const getDealAccountsJSON = (refId, dealId, accountNumber) => {
  return {
    operation: "POST",
    parentId: "",
    uniqueId: "",
    refId,
    dealId,
    section: "ACCOUNTS",
    new: {
      extendedAttributes: {
        aadharNo: {
          value: "123132",
          userEdited: false,
        },
        mothersMaidenName: {
          value: "123",
          userEdited: false,
        },
        pan: {
          value: "",
          userEdited: false,
        },
        numberDecimal: {
          value: "",
          userEdited: false,
        },
        dropdown: {
          value: "",
          userEdited: false,
        },
        date: {
          value: "",
          userEdited: false,
        },
        vehicleNUmber: {
          value: "",
          userEdited: false,
        },
      },
      currency: "INR",
      country: "IND",
      customerId: "123",
      name: "ACC",
      status: "ACTIVE",
      accountIdentifierKey: "physical",
      accountNumber,
      closedOn: "",
      openedOn: "",
      helperNotes: {},
      __v: 0,
      showBtns: true,
      accountBalanceCheckFlag: true,
      dealTemplateId: "T1007",
      dealId,
      refId,
    },
  };
};

export const getDealJSON = () => {
  const refId = "REF" + new Date().getTime();
  const today = formatDate(new Date(), "Asia/Kolkata");
  const dealName = `${getRandomNumber(10000, 1000)}-testdeal-${getRandomNumber(
    10000,
    1000
  )}`;
  return {
    operation: "POST",
    parentId: "",
    uniqueId: "",
    refId,
    dealId: "",
    section: "BASIC",
    new: {
      name: dealName,
      shortName: dealName,
      businessSegmentId: "BS1004",
      duration: {
        start: {
          tz: today,
          tzInfo: "Asia/Kolkata",
          utc: null,
        },
        end: { tz: null, tzInfo: "Asia/Kolkata", utc: null },
      },
      processingUnits: [
        "SPU1",
        "SPU3",
        "PU1002",
        "SPU4",
        "PU1000",
        "PU1001",
        "PU1004",
        "PU1005",
        "SPU2",
        "PU1012",
        "PU1011",
        "PU1013",
        "PU1014",
        "PU1009",
        "PU1010",
        "PU1015",
        "PU1003",
        "PU1006",
        "PU1008",
        "PU1007",
      ],
      purposes: [
        {
          name: "Payment",
          templatePurposeId: "6112b2e7a4e60135652e28d0",
          _id: "6112b2e7a4e60135652e28d0",
        },
        {
          name: "Retention",
          templatePurposeId: "6112b2e7a4e60147932e28d1",
          _id: "6112b2e7a4e60147932e28d1",
        },
      ],
      attributes: [
        {
          templateAttributeGroupId: "5fc0ae454c62540a054f4e67",
          attributes: [],
          groupName: "Group 1",
        },
      ],
      contacts: [],
      refId,
      txnChecklist: [],
      dealChecklist: [],
      allowBeneficiaries: false,
      timezoneId: "Asia/Kolkata",
      countryId: "IND",
      templateId: "T1007",
      userId: "superadmin",
      userName: "superadmin",
      executionPolicies: {
        grouping: false,
        dependencies: "None",
        verifyBalances: "Never",
        reattempt: "Never",
        holidayAction: "Execute",
        inactiveBehaviour: "IgnoreExecutions",
        balanceConsideration: "balances.available",
        reattemptIntervalMinutes: 60,
      },
    },
  };
};

export const getPartyJSON = (refId, dealId, processingUnits) => {
  const partyName = `SampleParty${getRandomNumber(10000, 1000)}`;
  return {
    operation: "POST",
    parentId: "",
    uniqueId: "",
    refId,
    dealId,
    section: "PARTIES",
    new: {
      name: partyName,
      customerId: partyName,
      responsibility: "PR1001",
      internal: false,
      isNeutral: false,
      remarks: "Sample Remark",
      eCommerceEnabled: false,
      participantId: null,
      attributes: [],
      dealId,
      refId,
      dealTemplateId: "T1007",
      linkedFromMdm: false,
      processingUnits,
    },
  };
};

export const getPartyContactJSON = (parentId, refId, dealId, partyId) => {
  return {
    operation: "POST",
    parentId,
    uniqueId: "",
    refId,
    dealId,
    section: "PARTY_CONTACTS",
    new: {
      name: `Sample Party contact ${getRandomNumber(1000, 10)}`,
      email: "abc@abc.com",
      mobileNumber: "",
      workPhone: "123456789",
      designation: "Manager",
      address: {
        street: "Street 1",
        country: "India",
        state: "Karnataka",
        town: "Bangalore",
        pincode: "560100",
      },
      notifyForSubinstruction: null,
      authorizedSignatory: true,
      partyId,
      dealId,
      refId,
      linkedFromMdm: false,
    },
    partyId,
  };
};

export const getPartyAccountsJSON = (parentId, refId, dealId, partyId) => {
  return {
    operation: "POST",
    parentId,
    uniqueId: "",
    refId,
    dealId,
    section: "PARTY_ACCOUNTS",
    new: {
      paymentInstrumentId: "UAEFTS",
      description: "",
      paymentDetails: {
        date: "",
        accountIban: "IBAN",
        to: `${getRandomNumber(100000000, 1000000)}`,
        name: `Test party - ${getRandomNumber(100000000, 1000000)}`,
        beneficiaryAddressLine1: "",
        beneficiaryAddressLine2: "",
        beneficiaryCountry: "IND",
        beneficiaryBankBic: "ICICI123456",
        priority: "",
        purposeOfPayment: "",
        charges: "",
        beneficiaryCurrency: "INR",
      },
      dealId,
      partyId,
      refId,
      linkedFromMdm: false,
    },
    partyId,
  };
};

export const saveCommentsJSON = (dealId, refId, basicDealData) => {
  return {
    operation: "PUT",
    parentId: dealId,
    uniqueId: dealId,
    refId,
    dealId,
    section: "BASIC",
    new: {
      ...basicDealData,
      reviewDraft: {
        note: "yes",
        comments: [
          {
            id: "basic",
            label: "Basic",
            comment: "",
            entitlement: ["SM_BASIC"],
            visible: true,
            isApproved: true,
          },
          {
            id: "accounts",
            label: "Accounts",
            comment: "",
            entitlement: ["SM_ACCOUNT"],
            visible: true,
            isApproved: true,
          },
          {
            id: "parties",
            label: "Parties",
            comment: "",
            entitlement: ["SM_PARTIES"],
            visible: true,
            isApproved: true,
          },
          {
            id: "scheduledFee",
            label: "Scheduled Fee",
            comment: "",
            entitlement: ["SM_FEE"],
            visible: true,
            isApproved: true,
          },
          {
            id: "authMatrix",
            label: "Entitlements",
            comment: "",
            entitlement: ["SM_ENTITLEMENTS"],
            visible: true,
            isApproved: true,
          },
          {
            id: "referenceData",
            label: "Budgets",
            comment: "",
            entitlement: ["SM_BUDGETS"],
            visible: true,
            isApproved: true,
          },
          {
            id: "scheduled",
            label: "Schedule Instructions",
            comment: "",
            entitlement: ["SM_SCHEDULED"],
            visible: true,
            isApproved: true,
          },
          {
            id: "linked",
            label: "Linked Instructions",
            comment: "",
            entitlement: ["SM_LINKED"],
            visible: true,
            isApproved: true,
          },
          {
            id: "priorityDependency",
            label: "Priority Dependency",
            comment: "",
            entitlement: ["SM_PRIORITY"],
            visible: true,
            isApproved: true,
          },
          {
            id: "documents",
            label: "Documents",
            comment: "",
            entitlement: ["SM_DOCUMENTS"],
            visible: true,
            isApproved: true,
          },
          {
            id: "notifications",
            label: "Notifications",
            comment: "",
            entitlement: ["SM_DOCUMENTS"],
            visible: true,
            isApproved: true,
          },
          {
            id: "execPolicy",
            label: "Execution Policies",
            comment: "",
            entitlement: ["SM_BASIC"],
            visible: true,
            customNavId: 14,
            isApproved: true,
          },
        ],
      },
    },
    old: {},
  };
};

export const getMakeLiveJSON = (dealId, refId, username) => {
  return {
    processId: dealId,
    userTask: "DEALCHECKER",
    refId: refId,
    action: "Approve",
    status: "new",
    liveDealId: dealId,
    userId: username,
    userName: username,
    review: {
      username: username,
      note: "yes",
      comments: [
        {
          id: "basic",
          isApproved: true,
          comment: "",
          entitlement: ["SM_BASIC"],
          visible: true,
        },
        {
          id: "accounts",
          isApproved: true,
          comment: "",
          entitlement: ["SM_ACCOUNT"],
          visible: true,
        },
        {
          id: "parties",
          isApproved: true,
          comment: "",
          entitlement: ["SM_PARTIES"],
          visible: true,
        },
        {
          id: "scheduledFee",
          isApproved: true,
          comment: "",
          entitlement: ["SM_FEE"],
          visible: true,
        },
        {
          id: "authMatrix",
          isApproved: true,
          comment: "",
          entitlement: ["SM_ENTITLEMENTS"],
          visible: true,
        },
        {
          id: "referenceData",
          isApproved: true,
          comment: "",
          entitlement: ["SM_BUDGETS"],
          visible: true,
        },
        {
          id: "scheduled",
          isApproved: true,
          comment: "",
          entitlement: ["SM_SCHEDULED"],
          visible: true,
        },
        {
          id: "linked",
          isApproved: true,
          comment: "",
          entitlement: ["SM_LINKED"],
          visible: true,
        },
        {
          id: "priorityDependency",
          isApproved: true,
          comment: "",
          entitlement: ["SM_PRIORITY"],
          visible: true,
        },
        {
          id: "documents",
          isApproved: true,
          comment: "",
          entitlement: ["SM_DOCUMENTS"],
          visible: true,
        },
        {
          id: "notifications",
          isApproved: true,
          comment: "",
          entitlement: ["SM_DOCUMENTS"],
          visible: true,
        },
        {
          id: "execPolicy",
          isApproved: true,
          comment: "",
          entitlement: ["SM_BASIC"],
          visible: true,
        },
      ],
    },
  };
};
