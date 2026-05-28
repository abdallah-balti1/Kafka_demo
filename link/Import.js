// @flow

import { Suspense, lazy } from 'react';
import { FormattedMessage } from 'react-intl';
import { Route, Switch } from 'react-router';

import {
  useCosmosMappingFileUpload,
  useDataDictionnaryFileUpload,
  useTDPAllFileUpload,
} from 'redux/entities/import/hooks';

import Style from './Import.style';

const ProcessImport = lazy(() => import(/* webpackChunkName: "ProcessImport" */ './ProcessImport'));
const CommunityImport = lazy(() =>
  import(/* webpackChunkName: "CommunityImport" */ './CommunityImport'),
);
const ProcessTypesImport = lazy(() =>
  import(/* webpackChunkName: "ProcessTypesImport" */ './ProcessTypesImport'),
);
const DataDictionnaryImport = lazy(() =>
  import(/* webpackChunkName: "DataDictionnaryImport" */ './DataDictionnaryImport'),
);
const TDPAllImport = lazy(() => import(/* webpackChunkName: "TDPAllImport" */ './TDPAllImport'));
const MassUpdateTemplateImport = lazy(() =>
  import(/* webpackChunkName: "MassUpdateTemplateImport" */ './MassUpdateTemplateImport'),
);
const BusinessRulesManagement = lazy(() =>
  import(/* webpackChunkName: "BusinessRulesManagement" */ './BusinessRulesManagement'),
);
const TemplateInitiative = lazy(() =>
  import(/* webpackChunkName: "TemplateInitiative" */ './TemplateInitiative'),
);
const AssessmentCategoryInitiative = lazy(() =>
  import(/* webpackChunkName: "AssessmentCategoryInitiative" */ './AssessmentCategoryInitiative'),
);
const ProductDataTemplateImport = lazy(() =>
  import(/* webpackChunkName: "ProductDataTemplateImport" */ './ProductDataTemplateImport'),
);
const ProductRestrictionImport = lazy(() =>
  import(/* webpackChunkName: "ProductRestrictionImport" */ './ProductRestrictionImport'),
);
const UserManagement = lazy(() =>
  import(/* webpackChunkName: "UserManagement" */ './UserManagement'),
);
const TeamManagement = lazy(() =>
  import(/* webpackChunkName: "TeamManagement" */ './TeamManagement'),
);
const UserAssignation = lazy(() =>
  import(/* webpackChunkName: "UserAssignation" */ './UserAssignation'),
);
const DocumentTypes = lazy(() => import(/* webpackChunkName: "DocumentTypes" */ './DocumentTypes'));

// ── NEW ──────────────────────────────────────────────────────────────────────
const GovernanceConfig = lazy(() =>
  import(/* webpackChunkName: "GovernanceConfig" */ './GovernanceConfig'),
);

const Import = () => {
  const useCosmosMappingFileUpload_ = useCosmosMappingFileUpload();
  const useDataDictionnaryFileUpload_ = useDataDictionnaryFileUpload();
  const useTDPAllFileUpload_ = useTDPAllFileUpload();

  return (
    <Style.Container>
      <Style.PageTitle>
        <FormattedMessage id="IMPORT.TITLE" />
      </Style.PageTitle>
      <Style.NavLinkContainer>
        <Style.NavLink to="/upload/process" activeClassName="selected">
          <FormattedMessage id="PROCESS_IMPORT.TITLE" />
        </Style.NavLink>
        <Style.NavLink to="/upload/community" activeClassName="selected">
          <FormattedMessage id="COMMUNITY_IMPORT.TITLE" />
        </Style.NavLink>
        <Style.NavLink to="/upload/process-types" activeClassName="selected">
          <FormattedMessage id="PROCESS_TYPES_IMPORT.TITLE" />
        </Style.NavLink>
        <Style.NavLink to="/upload/business-rules" activeClassName="selected">
          <FormattedMessage id="DATA_DICTIONNARY.BUSINESS_RULES" />
        </Style.NavLink>
        <Style.NavLink to="/upload/template-initiative" activeClassName="selected">
          <FormattedMessage id="TEMPLATE_INITIATIVE.TEMPLATE_INITIATIVE" />
        </Style.NavLink>
        <Style.NavLink to="/upload/assessment-category-initiative" activeClassName="selected">
          <FormattedMessage id="ASSESSMENT_CATEGORY.ASSESSMENT_CATEGORY" />
        </Style.NavLink>
        {/* ── NEW ── */}
        <Style.NavLink to="/upload/governance-config" activeClassName="selected">
          Governance Config
        </Style.NavLink>
        {/* ──────── */}
        <Style.NavLink to="/upload/data-dictionnary" activeClassName="selected">
          <FormattedMessage id="DATA_DICTIONNARY_IMPORT.TITLE" />
        </Style.NavLink>
        <Style.NavLink to="/upload/tdp-all" activeClassName="selected">
          <FormattedMessage id="TDP_ALL_IMPORT.TITLE" />
        </Style.NavLink>
        <Style.NavLink to="/upload/mass-update-template" activeClassName="selected">
          <FormattedMessage id="MASS_UPDATE_TEMPLATE_IMPORT.TITLE" />
        </Style.NavLink>
        <Style.NavLink to="/upload/product-data-template" activeClassName="selected">
          <FormattedMessage id="PRODUCT_DATA_TEMPLATE_IMPORT.TITLE" />
        </Style.NavLink>
        <Style.NavLink to="/upload/cosmos-mapping" activeClassName="selected">
          <FormattedMessage id="COSMOS_MAPPING_IMPORT.TITLE" />
        </Style.NavLink>
        <Style.NavLink to="/upload/product-restriction" activeClassName="selected">
          <FormattedMessage id="PRODUCT_RESTRICTION_IMPORT.TITLE" />
        </Style.NavLink>
        <Style.NavLink to="/upload/user-management" activeClassName="selected">
          <FormattedMessage id="USER_MANAGEMENT.TITLE" />
        </Style.NavLink>
        <Style.NavLink to="/upload/team-management" activeClassName="selected">
          <FormattedMessage id="TEAM_MANAGEMENT.TITLE" />
        </Style.NavLink>
        <Style.NavLink to="/upload/user-assignation" activeClassName="selected">
          <FormattedMessage id="USER_ASSIGNATION.TITLE" />
        </Style.NavLink>
        <Style.NavLink to="/upload/document-types" activeClassName="selected">
          <FormattedMessage id="DOCUMENT_TYPE.LABEL" />
        </Style.NavLink>
      </Style.NavLinkContainer>
      <Style.Content>
        <Suspense loading={null}>
          <Switch>
            <Route
              path="/upload/process"
              render={props => <ProcessImport {...props} />}
            />
            <Route
              path="/upload/business-rules"
              render={props => <BusinessRulesManagement {...props} />}
            />
            <Route
              path="/upload/template-initiative"
              render={props => <TemplateInitiative {...props} />}
            />
            <Route
              path="/upload/assessment-category-initiative"
              render={props => <AssessmentCategoryInitiative {...props} />}
            />
            {/* ── NEW ── */}
            <Route
              path="/upload/governance-config"
              render={props => <GovernanceConfig {...props} />}
            />
            {/* ──────── */}
            <Route
              path="/upload/community"
              render={props => <CommunityImport {...props} />}
            />
            <Route
              path="/upload/process-types"
              render={props => <ProcessTypesImport {...props} />}
            />
            <Route
              path="/upload/data-dictionnary"
              render={props => {
                return (
                  <DataDictionnaryImport
                    {...props}
                    useFileUpload={useDataDictionnaryFileUpload_}
                    fileType="DATA_DICTIONARY"
                    fileLabel="DATA_DICTIONNARY_IMPORT.DATA_DICTIONNARY_FILE"
                  />
                );
              }}
            />
            <Route
              path="/upload/tdp-all"
              render={props => {
                return (
                  <TDPAllImport
                    {...props}
                    useFileUpload={useTDPAllFileUpload_}
                    fileType="TDP_ALL"
                    fileLabel="TDP_ALL_IMPORT.TDP_ALL_FILE"
                  />
                );
              }}
            />
            <Route
              path="/upload/cosmos-mapping"
              render={props => {
                return (
                  <DataDictionnaryImport
                    {...props}
                    useFileUpload={useCosmosMappingFileUpload_}
                    fileType="COSMOS_MAPPING"
                    fileLabel="DATA_DICTIONNARY_IMPORT.COSMOS_MAPPING_FILE"
                  />
                );
              }}
            />
            <Route
              path="/upload/mass-update-template"
              render={props => <MassUpdateTemplateImport {...props} />}
            />
            <Route
              path="/upload/product-data-template"
              render={props => <ProductDataTemplateImport {...props} />}
            />
            <Route
              path="/upload/product-restriction"
              render={props => <ProductRestrictionImport {...props} />}
            />
            <Route
              path="/upload/user-management"
              render={props => <UserManagement {...props} />}
            />
            <Route
              path="/upload/team-management"
              render={props => <TeamManagement {...props} />}
            />
            <Route
              path="/upload/user-assignation"
              render={props => <UserAssignation {...props} />}
            />
            <Route
              path="/upload/document-types"
              render={props => <DocumentTypes {...props} />}
            />
          </Switch>
        </Suspense>
      </Style.Content>
    </Style.Container>
  );
};

export default Import;
