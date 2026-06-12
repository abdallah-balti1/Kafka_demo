// @flow
import {
  USER_ROLE_ADMIN,
  USER_ROLE_INITIATIVE_ASSESSOR,
  USER_ROLE_INITIATIVE_COORDINATOR,
  USER_ROLE_INITIATIVE_OBSERVER,
  USER_ROLE_INITIATIVE_OWNER,
} from 'constants/app';
import { BNPColors } from 'styles';

export const INITIATIVE_ID_COLUMN = 'ID';
export const INITIATIVE_NAME_COLUMN = 'NAME';
export const INITIATIVE_SUMMARY_COLUMN = 'SUMMARY';
export const INITIATIVE_TYPE_COLUMN = 'PRODUCT_TYPE';
export const INITIATIVE_SPONSOR_COLUMN = 'PROJECT_SPONSOR';
export const INITIATIVE_SPONSOR_COUNTRY_COLUMN = 'PROJECT_SPONSOR_COUNTRY';
export const INITIATIVE_ASSET_CLASS_COLUMN = 'ASSET_CLASS';
export const INITIATIVE_MANAGEMENT_COMPANY_COLUMN = 'MANCO';
export const INITIATIVE_PIPELINE_GOVERNANCE_REQUIRED_COLUMN = 'GOVERNANCE_REQUIRED';
export const INITIATIVE_COMMITTEE_DATE_COLUMN = 'COMMITTEE_DATE';
export const INITIATIVE_COMMITTEE_DATE_2_COLUMN = 'COMMITTEE_DATE_2'; // ← AJOUT ticket 265478
export const INITIATIVE_DISTRIBUTION_CHANNNEL_COLUMN = 'DISTRIBUTION_CHANNEL';
export const INITIATIVE_LEGAL_FORM_COLUMN = 'LEGAL_FORM';
export const INITIATIVE_OWNER_COLUMN = 'INITIATIVE_OWNER';

export const DEFAULT_COLUMNS = [
  INITIATIVE_ID_COLUMN,
  INITIATIVE_NAME_COLUMN,
  INITIATIVE_SUMMARY_COLUMN,
  INITIATIVE_TYPE_COLUMN,
  INITIATIVE_SPONSOR_COLUMN,
  INITIATIVE_SPONSOR_COUNTRY_COLUMN,
  INITIATIVE_ASSET_CLASS_COLUMN,
  INITIATIVE_MANAGEMENT_COMPANY_COLUMN,
  INITIATIVE_PIPELINE_GOVERNANCE_REQUIRED_COLUMN,
  INITIATIVE_COMMITTEE_DATE_COLUMN,
  INITIATIVE_COMMITTEE_DATE_2_COLUMN, // ← AJOUT ticket 265478
  INITIATIVE_DISTRIBUTION_CHANNNEL_COLUMN,
  INITIATIVE_LEGAL_FORM_COLUMN,
  INITIATIVE_OWNER_COLUMN,
];

export const INITIATIVE_PIPELINE_AVAILABLE_COLUMNS = {
  [INITIATIVE_ID_COLUMN]: { label: 'INITIATIVE.INITIATIVE_ID' },
  [INITIATIVE_NAME_COLUMN]: {
    label: 'INITIATIVE.INITIATIVE_NAME',
  },
  [INITIATIVE_SUMMARY_COLUMN]: {
    label: 'INITIATIVE.INITIATIVE_SUMMARY',
  },
  [INITIATIVE_TYPE_COLUMN]: {
    label: 'INITIATIVE.INITIATIVE_TYPE',
  },
  [INITIATIVE_SPONSOR_COLUMN]: {
    label: 'INITIATIVE.INITIATIVE_SPONSOR',
  },
  [INITIATIVE_SPONSOR_COUNTRY_COLUMN]: {
    label: 'INITIATIVE.INITIATIVE_SPONSOR_COUNTRY',
  },
  [INITIATIVE_ASSET_CLASS_COLUMN]: { label: 'INITIATIVE.INITIATIVE_ASSET_CLASS' },
  [INITIATIVE_MANAGEMENT_COMPANY_COLUMN]: {
    label: 'INITIATIVE.INITIATIVE_MANCO',
  },
  [INITIATIVE_PIPELINE_GOVERNANCE_REQUIRED_COLUMN]: {
    label: 'INITIATIVE_PIPELINE.GOVERNANCE_REQUIRED',
  },
  [INITIATIVE_COMMITTEE_DATE_COLUMN]: {
    label: 'INITIATIVE.INITIATIVE_COMMITTEE_DATE',
  },
  [INITIATIVE_COMMITTEE_DATE_2_COLUMN]: {
    label: 'INITIATIVE.INITIATIVE_COMMITTEE_DATE_2', // ← AJOUT ticket 265478
  },
  [INITIATIVE_DISTRIBUTION_CHANNNEL_COLUMN]: {
    label: 'INITIATIVE.INITIATIVE_DISTRIBUTION_CHANNEL',
  },
  [INITIATIVE_LEGAL_FORM_COLUMN]: {
    label: 'INITIATIVE.INITIATIVE_LEGAL_FORM',
  },
  [INITIATIVE_OWNER_COLUMN]: {
    label: 'INITIATIVE.INITIATIVE_OWNER',
  },
};

export const LEGAL_FORM_FUND = 'Fund';
export const LEGAL_FORM_MANDATE = 'Mandate';
export const LEGAL_FORM_SEGREGATED = 'Segregated';
export const LEGAL_FORM_ADVISORY = 'Advisory';
export const LEGAL_FORM_EXECUTION = 'Execution';
export const LEGAL_FORM_OTHER = 'Other';

export const SPONSOR_NETWORK = 'NETWORK';
export const SPONSOR_SALES = 'SALES';
export const SPONSOR_STRATEGY = 'STRATEGY';

export const GOVERNANCE_GPC = 'GPC';
export const GOVERNANCE_GNPC = 'GNPC';
export const GOVERNANCE_FAST_TRACK = 'FAST-TRACK';

export const DISTRIBUTED_CHANNEL_MULTI = 'MULTI-DISTRIBUTED';
export const DISTRIBUTED_CHANNEL_AXA = 'AXA';
export const DISTRIBUTED_CHANNEL_BNP = 'BNP';

export const ASSET_CLASS_ADVISORY = 'ADVISORY';
export const ASSET_CLASS_AIF = 'AIF';
export const ASSET_CLASS_ALTERNATIVE_CREDIT = 'ALTERNATIVE_CREDIT';
export const ASSET_CLASS_NATURAL_CAPITAL = 'NATURAL_CAPITAL';
export const ASSET_CLASS_REAL_ASSET = 'REAL_ASSET';
export const ASSET_CLASS_EQUITY_QI = 'EQUITY_QI';
export const ASSET_CLASS_EQUITY = 'EQUITY';
export const ASSET_CLASS_FIXED_INCOME = 'FIXED_INCOME';
export const ASSET_CLASS_MULTI_ASSET = 'MULTI_ASSET';
export const ASSET_CLASS_TSFD = 'TSFD';
export const ASSET_CLASS_EXECUTION = 'EXECUTION';
export const ASSET_CLASS_FCP = 'FCP';
export const ASSET_CLASS_FUND = 'FUND';
export const ASSET_CLASS_JV_AXA_SPDB = 'JV_AXA_SPDB';
export const ASSET_CLASS_JV_KYOBO_AXA = 'JV_KYOBO_AXA';
export const ASSET_CLASS_MANDATE_SEGREGATED_ACCOUNT = 'MANDATE_SEGREGATED_ACCOUNT';
export const ASSET_CLASS_OEIC = 'OEIC';
export const ASSET_CLASS_OTHER = 'OTHER';
export const ASSET_CLASS_PRIME = 'PRIME';
export const ASSET_CLASS_SELECT = 'SELECT';
export const ASSET_CLASS_SICAV = 'SICAV';
export const ASSET_CLASS_SPEZIALFOND = 'SPEZIALFOND';
export const ASSET_CLASS_UCITS = 'UCITS';

export const PRODUCT_TYPE_SINGLE = 'SINGLE';
export const PRODUCT_TYPE_SUBFUND = 'SUB_FUND';
export const PRODUCT_TYPE_UMBRELLA = 'UMBRELLA';
export const PRODUCT_TYPE_MANDATE = 'MANDATE';

export const MANAGEMENT_COMPANY_BNP_AM_EU = 'BNP_AM_EU';
export const MANAGEMENT_COMPANY_BNP_AM_EU_FQA = 'BNP_AM_EU_FQA';
export const MANAGEMENT_COMPANY_BNP_AM_EU_FUND = 'BNP_AM_EU_FUND';
export const MANAGEMENT_COMPANY_BNP_AM_EU_SAS = 'BNP_AM_EU_SAS';

export const INITIATIVE_PIPELINE_CREATION = 'CREATION';
export const INITIATIVE_PIPELINE_MODIFICATION = 'MODIFICATION';
export const INITIATIVE_PIPELINE_LIQUIDATION = 'LIQUIDATION';
export const INITIATIVE_PIPELINE_MERGE = 'MERGER';

export const INITIATIVE_PIPELINE_INITIATIVE_TYPE = {
  [INITIATIVE_PIPELINE_CREATION]: {
    label: 'Creation',
    color: BNPColors.jade,
  },
  [INITIATIVE_PIPELINE_MODIFICATION]: {
    label: 'Modification',
    color: BNPColors.brightTurquoise,
  },
  [INITIATIVE_PIPELINE_MERGE]: {
    label: 'Merger',
    color: BNPColors.brightTurquoise,
  },
  [INITIATIVE_PIPELINE_LIQUIDATION]: {
    label: 'Liquidation',
    color: BNPColors.brightTurquoise,
  },
};

export const INITIATIVE_PIPELINE_PRODUCT_TYPE = {
  [PRODUCT_TYPE_SINGLE]: {
    label: 'Single',
    color: BNPColors.jade,
    sortOrder: 1,
  },
  [PRODUCT_TYPE_SUBFUND]: {
    label: 'Sub-Fund',
    color: BNPColors.brightTurquoise,
    sortOrder: 2,
  },
  [PRODUCT_TYPE_UMBRELLA]: {
    label: 'Umbrella',
    color: BNPColors.pizzazOrange,
    sortOrder: 3,
  },
  [PRODUCT_TYPE_MANDATE]: {
    label: 'Mandate',
    color: BNPColors.carnationRed,
    sortOrder: 4,
  },
};

export const INITIATIVE_PIPELINE_ASSET_CLASS = {
  [ASSET_CLASS_ADVISORY]: {
    label: 'Advisory',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_AIF]: {
    label: 'AIF',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_NATURAL_CAPITAL]: {
    label: 'Natural Capital',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_REAL_ASSET]: {
    label: 'Real Asset',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_EQUITY_QI]: {
    label: 'Equity QI',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_EQUITY]: {
    label: 'Equity',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_FIXED_INCOME]: {
    label: 'Fixed Income',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_MULTI_ASSET]: {
    label: 'Multi Asset',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_TSFD]: {
    label: 'TSFD',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_EXECUTION]: {
    label: 'Execution',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_FCP]: {
    label: 'FCP',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_FUND]: {
    label: 'Fund',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_JV_AXA_SPDB]: {
    label: 'JV – AXA SPDB',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_JV_KYOBO_AXA]: {
    label: 'JV – Kyobo AXA',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_MANDATE_SEGREGATED_ACCOUNT]: {
    label: 'Mandate/Segregated account',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_OEIC]: {
    label: 'OEIC',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_OTHER]: {
    label: 'Other',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_PRIME]: {
    label: 'Prime',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_SELECT]: {
    label: 'Select',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_SICAV]: {
    label: 'SICAV',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_SPEZIALFOND]: {
    label: 'SpezialFond',
    color: BNPColors.jade,
  },
  [ASSET_CLASS_UCITS]: {
    label: 'UCITS',
    color: BNPColors.jade,
  },
};

export const INITIATIVE_PIPELINE_LEGAL_FORM = {
  [LEGAL_FORM_FUND]: {
    label: 'FUND',
    color: BNPColors.jade,
  },
  [LEGAL_FORM_MANDATE]: {
    label: 'MANDATE',
    color: BNPColors.brightTurquoise,
  },
  [LEGAL_FORM_SEGREGATED]: {
    label: 'SEGREGATED',
    color: BNPColors.jade,
  },
  [LEGAL_FORM_ADVISORY]: {
    label: 'ADVISORY',
    color: BNPColors.brightTurquoise,
  },
  [LEGAL_FORM_EXECUTION]: {
    label: 'EXECUTION',
    color: BNPColors.jade,
  },
  [LEGAL_FORM_OTHER]: {
    label: 'OTHER',
    color: BNPColors.brightTurquoise,
  },
};

export const INITIATIVE_PIPELINE_GOVERNANCE_REQUIRED = {
  [GOVERNANCE_GPC]: {
    label: 'GPC',
    color: BNPColors.jade,
  },
  [GOVERNANCE_GNPC]: {
    label: 'GNBC',
    color: BNPColors.brightTurquoise,
  },
  [GOVERNANCE_FAST_TRACK]: {
    label: 'fast-track',
    color: BNPColors.brightTurquoise,
  },
};

export const INITIATIVE_PIPELINE_DISTRIBUTED_CHANNEL = {
  [DISTRIBUTED_CHANNEL_MULTI]: {
    label: 'Multi-distributed',
    color: BNPColors.jade,
  },
  [DISTRIBUTED_CHANNEL_AXA]: {
    label: 'AXA',
    color: BNPColors.brightTurquoise,
  },
  [DISTRIBUTED_CHANNEL_BNP]: {
    label: 'BNP',
    color: BNPColors.brightTurquoise,
  },
};

export const INITIATIVE_PIPELINE_SPONSOR = {
  [SPONSOR_NETWORK]: {
    label: 'Group Network',
    color: BNPColors.jade,
  },
  [SPONSOR_SALES]: {
    label: 'Sales',
    color: BNPColors.brightTurquoise,
  },
  [SPONSOR_STRATEGY]: {
    label: 'Strategy',
    color: BNPColors.brightTurquoise,
  },
};

export const INITIATIVE_USER_ROLES = [
  USER_ROLE_ADMIN,
  USER_ROLE_INITIATIVE_OWNER,
  USER_ROLE_INITIATIVE_ASSESSOR,
  USER_ROLE_INITIATIVE_OBSERVER,
  USER_ROLE_INITIATIVE_COORDINATOR,
];

export const INITIATIVE_PIPELINE_ALLOWED_READ_ROLES = [
  USER_ROLE_ADMIN,
  USER_ROLE_INITIATIVE_OWNER,
  USER_ROLE_INITIATIVE_ASSESSOR,
  USER_ROLE_INITIATIVE_OBSERVER,
  USER_ROLE_INITIATIVE_COORDINATOR,
];

export const INITIATIVE_CREATION_ALLOWED_ROLES = [
  USER_ROLE_ADMIN,
  USER_ROLE_INITIATIVE_OWNER,
  USER_ROLE_INITIATIVE_COORDINATOR,
];

export const INITIATIVE_TASK_CREATION_ALLOWED_ROLES = [
  USER_ROLE_ADMIN,
  USER_ROLE_INITIATIVE_OWNER,
  USER_ROLE_INITIATIVE_COORDINATOR,
  USER_ROLE_INITIATIVE_ASSESSOR,
];

export const INITIATIVE_TASK_UPDATE_ALLOWED_ROLES = [
  USER_ROLE_ADMIN,
  USER_ROLE_INITIATIVE_OWNER,
  USER_ROLE_INITIATIVE_COORDINATOR,
  USER_ROLE_INITIATIVE_ASSESSOR,
];

export const INITIATIVE_EDIT_EXPECTED_FOR_ALLOWED_ROLES = [
  USER_ROLE_ADMIN,
  USER_ROLE_INITIATIVE_COORDINATOR,
];

export const INITIATIVE_EDIT_ALLOWED_ROLES = [
  USER_ROLE_ADMIN,
  USER_ROLE_INITIATIVE_OWNER,
  USER_ROLE_INITIATIVE_COORDINATOR,
];

export const INITIATIVE_DESCRIPTION_EDIT_ALLOWED_ROLES = [
  USER_ROLE_ADMIN,
  USER_ROLE_INITIATIVE_OWNER,
  USER_ROLE_INITIATIVE_COORDINATOR,
];

export const INITIATIVE_RISK_ALLOWED_ROLES = [
  USER_ROLE_ADMIN,
  USER_ROLE_INITIATIVE_COORDINATOR,
  USER_ROLE_INITIATIVE_ASSESSOR,
];

export const INITIATIVE_STATUS_UPDATE_ALLOWED_ROLES = [
  USER_ROLE_ADMIN,
  USER_ROLE_INITIATIVE_OWNER,
  USER_ROLE_INITIATIVE_COORDINATOR,
];
