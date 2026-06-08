// @flow
import {
  INITIATIVE_EDIT_ALLOWED_ROLES,
  INITIATIVE_PIPELINE_ASSET_CLASS,
  INITIATIVE_PIPELINE_CREATION,
  INITIATIVE_PIPELINE_DISTRIBUTED_CHANNEL,
  INITIATIVE_PIPELINE_GOVERNANCE_REQUIRED,
  INITIATIVE_PIPELINE_INITIATIVE_TYPE,
  INITIATIVE_PIPELINE_LEGAL_FORM,
  INITIATIVE_PIPELINE_SPONSOR,
} from 'constants/initiativePipeline';
import { Field, Form } from 'formik';
import { sortBy } from 'lodash';

import {
  getCosmosId,
  getProductTypeOptions,
} from 'pages/InitiativePipelineCreation/components/InitiativePipelineCharacteristicsSection/utils.js';
import { lazy, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useFetchInitiativeOwners,
  useFetchSponsorCountries,
} from 'redux/entities/initiativesPipeline/hooks.js';
import { useFetchManagementCompanyLabels } from 'redux/entities/massUpdateTemplates/hooks.js';
import { hasError, validateMandatory } from 'utils/formValidation';
import { default as CommonStyle } from '../../common.style';
import ToggleEditionModeButtons from '../ToggleEditionModeButtons';

export type OwnPropsType = {
  project: CardTabProjectType,
};

const ConfirmationDialog = lazy(() =>
  import(/* webpackChunkName: "ConfirmationDialog" */ 'components/ConfirmationDialog'),
);

export type MapStateToPropsType = {
  isEditing: boolean,
  projectOwners: PublicUserType[],
  products: PublicUserType[],
  token: string,
  user: UserType,
};

export type MapDispatchToPropsType = {
  setIsEditing: (isEditing: boolean) => void,
  fetchUsers: () => FetchUsersActionType,
  fetchProducts: () => FetchProductsActionType,
  updateInitiative: (
    string,
    UpdateInitiativePipelineValuesType,
  ) => UpdateInitiativePipelineActionType,
};

type FormikPropsType = {
  submitForm: () => ValidateTaskActionType,
  setFieldValue: (name: string, value: string) => void,
  values: UpdateProjectValuesType,
  errors: FormikErrorsType,
  touched: FormikTouchedType,
  setValues: (value: UpdateProjectValuesType) => void,
  dirty: boolean,
  resetForm: () => void,
};

type PropsType = OwnPropsType & MapStateToPropsType & MapDispatchToPropsType & FormikPropsType;

const InitiativeDescription = (props: PropsType) => {
  const {
    intl,
    user,
    initiative,
    statusData,
    projectOwners,
    token,
    isEditing,
    setIsEditing,
    products,
    fetchUsers,
    fetchProducts,
    submitForm,
    setFieldValue,
    values,
    errors,
    touched,
    resetForm,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const shouldDisplayModal = !!values.name;
  const [sponsorCountries, setSponsorCountries] = useState([]);
  const { value: sponsor_countries } = useFetchSponsorCountries(token, true, null) || {};
  const [managementCompanies, setManagementCompanies] = useState([]);
  const { value: mgmtCompLabels } = useFetchManagementCompanyLabels(token, true, null) || {};
  const { value: initiativeOwners } = useFetchInitiativeOwners(token, false, null) || {};

  useEffect(
    () => {
      fetchProducts();
    },
    [fetchProducts],
  );

  const isUserAllowedEditInitiatives = INITIATIVE_EDIT_ALLOWED_ROLES.some(role =>
    user.roles.includes(role),
  );

  const cosmosIdOptions = useMemo(() => getCosmosId(products), [products]);

  useEffect(
    () => {
      if (mgmtCompLabels) {
        const uniqueMgmtComps = [...new Set(mgmtCompLabels)].sort();
        setManagementCompanies(uniqueMgmtComps.map(comp => ({ value: comp, label: comp })));
      }
    },
    [mgmtCompLabels],
  );

  useEffect(
    () => {
      if (sponsor_countries) {
        const uniqueCountries = [...new Set(sponsor_countries)].sort();
        setSponsorCountries(uniqueCountries.map(country => ({ value: country, label: country })));
      }
    },
    [sponsor_countries],
  );

  useEffect(
    () => {
      fetchUsers();
    },
    [fetchUsers],
  );

  // ✅ Helper : label du committee date principal (dernier dans la liste)
  const commiteeNames = values.commiteeNames || [];
  const mainCommiteeName = commiteeNames.length > 0
    ? commiteeNames[commiteeNames.length - 1]
    : '';
  const mainCommiteeDateLabel = mainCommiteeName
    ? `${mainCommiteeName} Committee Date`
    : 'Committee Date';

  return (
    <CommonStyle.Container>
      <Form>
        <CommonStyle.HeaderContainer>
          <FormattedMessage id="INITIATIVE_PIPELINE.DESCRIPTION.TITLE" />
          {isUserAllowedEditInitiatives && (
            <ToggleEditionModeButtons
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              resetForm={resetForm}
            />
          )}
        </CommonStyle.HeaderContainer>
        <CommonStyle.MainInfoContainer>
          <div>
            <CommonStyle.ContentContainer>

              {/* ========== COLONNE 1 ========== */}
              <CommonStyle.ColumnContainer>

                <CommonStyle.RowContainer>
                  <CommonStyle.Label>
                    <FormattedMessage id="INITIATIVE_PIPELINE.INITIATIVE_NAME" />
                  </CommonStyle.Label>
                  {isEditing ? (
                    <Field name="name" component={CommonStyle.Input} />
                  ) : (
                    <CommonStyle.Value title={initiative.name}>
                      {values.name || '-'}
                    </CommonStyle.Value>
                  )}
                </CommonStyle.RowContainer>

                <CommonStyle.RowContainer>
                  <CommonStyle.Label>
                    <FormattedMessage id="INITIATIVE_PIPELINE.INITIATIVE_TYPE" />
                  </CommonStyle.Label>
                  {isEditing ? (
                    <Field
                      name="initiativeType"
                      component={CommonStyle.Dropdown}
                      label={intl.formatMessage({ id: 'INITIATIVE_PIPELINE.INITIATIVE_TYPE' })}
                      options={Object.keys(INITIATIVE_PIPELINE_INITIATIVE_TYPE).map(type => ({
                        value: type,
                        label: INITIATIVE_PIPELINE_INITIATIVE_TYPE[type].label,
                      }))}
                      isClearable={false}
                      validate={validateMandatory}
                      hasError={hasError(errors, touched, 'initiativeType')}
                    />
                  ) : (
                    <CommonStyle.Value title={initiative.initiativeType}>
                      {values.initiativeType.label || '-'}
                    </CommonStyle.Value>
                  )}
                </CommonStyle.RowContainer>

                <CommonStyle.RowContainer>
                  <CommonStyle.Label>
                    <FormattedMessage id="INITIATIVE_PIPELINE.INITIATIVE_OWNER" />
                  </CommonStyle.Label>
                  {isEditing ? (
                    <Field
                      name="initiativeOwner"
                      component={CommonStyle.Dropdown}
                      label={intl.formatMessage({ id: 'INITIATIVE_PIPELINE.INITIATIVE_OWNER' })}
                      options={sortBy(
                        initiativeOwners &&
                          initiativeOwners.map(user => ({
                            value: user?.id,
                            label: user && user.firstname + ' ' + user.lastname,
                          })),
                        'label',
                      )}
                      isClearable={false}
                      validate={validateMandatory}
                      hasError={hasError(errors, touched, 'initiativeOwner')}
                    />
                  ) : (
                    <CommonStyle.Value title={initiative.initiativeOwner}>
                      {values.initiativeOwner.label || '-'}
                    </CommonStyle.Value>
                  )}
                </CommonStyle.RowContainer>

                <CommonStyle.RowContainer>
                  <CommonStyle.Label>
                    <FormattedMessage id="INITIATIVE_PIPELINE.ASSET_CLASS" />
                  </CommonStyle.Label>
                  {isEditing ? (
                    <Field
                      name="assetClass"
                      component={CommonStyle.Dropdown}
                      label={intl.formatMessage({ id: 'INITIATIVE_PIPELINE.ASSET_CLASS' })}
                      options={Object.keys(INITIATIVE_PIPELINE_ASSET_CLASS).map(type => ({
                        value: type,
                        label: INITIATIVE_PIPELINE_ASSET_CLASS[type].label,
                      }))}
                      isClearable={false}
                      validate={validateMandatory}
                      hasError={hasError(errors, touched, 'assetClass')}
                    />
                  ) : (
                    <CommonStyle.Value title={initiative.assetClass}>
                      {values.assetClass.label || '-'}
                    </CommonStyle.Value>
                  )}
                </CommonStyle.RowContainer>

                {/* ✅ Template */}
                <CommonStyle.RowContainer>
                  <CommonStyle.Label>Template</CommonStyle.Label>
                  <CommonStyle.Value>{initiative.template_name || '-'}</CommonStyle.Value>
                </CommonStyle.RowContainer>

                {/* ✅ Committee Date principal — label sécurisé */}
                <CommonStyle.RowContainer>
                  <CommonStyle.Label>{mainCommiteeDateLabel}</CommonStyle.Label>
                  {isEditing ? (
                    <Field
                      name="committeeDate"
                      component={CommonStyle.DatePicker}
                      label={intl.formatMessage({ id: 'INITIATIVE_PIPELINE.COMMITTEE_DATE' })}
                      isReadOnly={
                        initiative.initiativeGovernance.commitees?.length ===
                        statusData.currentCommiteeOrder
                      }
                      hasError={hasError(errors, touched, 'committeeDate')}
                    />
                  ) : (
                    <CommonStyle.Value title={initiative.commiteeDate}>
                      {values.committeeDate || '-'}
                    </CommonStyle.Value>
                  )}
                </CommonStyle.RowContainer>

              </CommonStyle.ColumnContainer>

              {/* ========== COLONNE 2 ========== */}
              <CommonStyle.ColumnContainer>

                <CommonStyle.RowContainer>
                  <CommonStyle.Label>
                    <FormattedMessage id="INITIATIVE_PIPELINE.SPONSOR" />
                  </CommonStyle.Label>
                  {isEditing ? (
                    <Field
                      name="sponsor"
                      component={CommonStyle.Dropdown}
                      label={intl.formatMessage({ id: 'INITIATIVE_PIPELINE.SPONSOR' })}
                      options={Object.keys(INITIATIVE_PIPELINE_SPONSOR).map(type => ({
                        value: type,
                        label: INITIATIVE_PIPELINE_SPONSOR[type].label,
                      }))}
                      isClearable={false}
                      validate={validateMandatory}
                      hasError={hasError(errors, touched, 'sponsor')}
                    />
                  ) : (
                    <CommonStyle.Value title={initiative.sponsor}>
                      {values.sponsor.label || '-'}
                    </CommonStyle.Value>
                  )}
                </CommonStyle.RowContainer>

                <CommonStyle.RowContainer>
                  <CommonStyle.Label>
                    <FormattedMessage id="INITIATIVE_PIPELINE.SPONSOR_COUNTRY" />
                  </CommonStyle.Label>
                  {isEditing ? (
                    <Field
                      name="sponsorCountry"
                      component={CommonStyle.Dropdown}
                      label={intl.formatMessage({ id: 'INITIATIVE_PIPELINE.SPONSOR_COUNTRY' })}
                      options={sponsorCountries}
                      isClearable={false}
                      validate={validateMandatory}
                      hasError={hasError(errors, touched, 'sponsorCountry')}
                    />
                  ) : (
                    <CommonStyle.Value title={initiative.sponsorCountry}>
                      {values.sponsorCountry.label || '-'}
                    </CommonStyle.Value>
                  )}
                </CommonStyle.RowContainer>

                <CommonStyle.RowContainer>
                  <CommonStyle.Label>
                    <FormattedMessage id="INITIATIVE_PIPELINE.LEGAL_FORM" />
                  </CommonStyle.Label>
                  {isEditing ? (
                    <Field
                      name="legalForm"
                      component={CommonStyle.Dropdown}
                      label={intl.formatMessage({ id: 'INITIATIVE_PIPELINE.LEGAL_FORM' })}
                      options={Object.keys(INITIATIVE_PIPELINE_LEGAL_FORM).map(type => ({
                        value: type,
                        label: INITIATIVE_PIPELINE_LEGAL_FORM[type].label,
                      }))}
                      hasError={hasError(errors, touched, 'legalForm')}
                    />
                  ) : (
                    <CommonStyle.Value title={initiative.legalForm}>
                      {values.legalForm.label || '-'}
                    </CommonStyle.Value>
                  )}
                </CommonStyle.RowContainer>

                <CommonStyle.RowContainer>
                  <CommonStyle.Label>
                    <FormattedMessage id="INITIATIVE_PIPELINE.DISTRIBUTION_CHANNEL" />
                  </CommonStyle.Label>
                  {isEditing ? (
                    <Field
                      name="distributionChannel"
                      component={CommonStyle.Dropdown}
                      label={intl.formatMessage({ id: 'INITIATIVE_PIPELINE.DISTRIBUTION_CHANNEL' })}
                      options={Object.keys(INITIATIVE_PIPELINE_DISTRIBUTED_CHANNEL).map(type => ({
                        value: type,
                        label: INITIATIVE_PIPELINE_DISTRIBUTED_CHANNEL[type].label,
                      }))}
                      isClearable={false}
                      validate={validateMandatory}
                      hasError={hasError(errors, touched, 'distributionChannel')}
                    />
                  ) : (
                    <CommonStyle.Value title={initiative.distributionChannel}>
                      {values.distributionChannel.label || '-'}
                    </CommonStyle.Value>
                  )}
                </CommonStyle.RowContainer>

              </CommonStyle.ColumnContainer>

              {/* ========== COLONNE 3 ========== */}
              <CommonStyle.ColumnContainer>

                <CommonStyle.RowContainer>
                  <CommonStyle.Label>
                    <FormattedMessage id="INITIATIVE_PIPELINE.PRODUCT_TYPE" />
                  </CommonStyle.Label>
                  {isEditing ? (
                    <Field
                      name="productType"
                      component={CommonStyle.Dropdown}
                      label={intl.formatMessage({ id: 'INITIATIVE_PIPELINE.PRODUCT_TYPE' })}
                      options={getProductTypeOptions(intl)}
                      hasError={hasError(errors, touched, 'initiativePipeline.productType')}
                    />
                  ) : (
                    <CommonStyle.Value title={initiative.productType}>
                      {values.productType.label || '-'}
                    </CommonStyle.Value>
                  )}
                </CommonStyle.RowContainer>

                <CommonStyle.RowContainer>
                  <CommonStyle.Label>
                    <FormattedMessage id="INITIATIVE_PIPELINE.GOVERNANCE_REQUIRED" />
                  </CommonStyle.Label>
                  {isEditing ? (
                    <Field
                      name="governanceRequired"
                      component={CommonStyle.Dropdown}
                      label={intl.formatMessage({ id: 'INITIATIVE_PIPELINE.GOVERNANCE_REQUIRED' })}
                      options={Object.keys(INITIATIVE_PIPELINE_GOVERNANCE_REQUIRED).map(type => ({
                        value: type,
                        label: INITIATIVE_PIPELINE_GOVERNANCE_REQUIRED[type].label,
                      }))}
                      isClearable={false}
                      isReadOnly={true}
                      validate={validateMandatory}
                      hasError={hasError(errors, touched, 'governanceRequired')}
                    />
                  ) : (
                    <CommonStyle.Value title={initiative.governanceRequired}>
                      {values.governanceRequired.label || '-'}
                    </CommonStyle.Value>
                  )}
                </CommonStyle.RowContainer>

                <CommonStyle.RowContainer>
                  <CommonStyle.Label>
                    <FormattedMessage id="INITIATIVE_PIPELINE.COSMOS_ID" />
                  </CommonStyle.Label>
                  {isEditing ? (
                    <Field
                      name="cosmosId"
                      component={CommonStyle.Dropdown}
                      label={intl.formatMessage({ id: 'INITIATIVE_PIPELINE.COSMOS_ID' })}
                      options={cosmosIdOptions}
                      hasError={hasError(errors, touched, 'cosmosId')}
                      isReadOnly={values.initiativeType?.value === INITIATIVE_PIPELINE_CREATION}
                    />
                  ) : (
                    <CommonStyle.Value title={initiative.cosmosId}>
                      {values.cosmosId.value || '-'}
                    </CommonStyle.Value>
                  )}
                </CommonStyle.RowContainer>

                <CommonStyle.RowContainer>
                  <CommonStyle.Label>
                    <FormattedMessage id="INITIATIVE_PIPELINE.MANAGEMENT_COMPANY" />
                  </CommonStyle.Label>
                  {isEditing ? (
                    <Field
                      name="managementCompany"
                      component={CommonStyle.Dropdown}
                      label={intl.formatMessage({ id: 'INITIATIVE_PIPELINE.MANAGEMENT_COMPANY' })}
                      options={managementCompanies}
                      isClearable={false}
                      validate={validateMandatory}
                      hasError={hasError(errors, touched, 'managementCompany')}
                    />
                  ) : (
                    <CommonStyle.Value title={initiative.managementCompany}>
                      {values.managementCompany.label || '-'}
                    </CommonStyle.Value>
                  )}
                </CommonStyle.RowContainer>

                {/* ✅ Pre Committee Date 1 — toujours en colonne 3 */}
                {commiteeNames.length > 1 && (
                  <CommonStyle.RowContainer>
                    <CommonStyle.Label>
                      {commiteeNames[0] + ' Committee Date'}
                    </CommonStyle.Label>
                    {isEditing ? (
                      <Field
                        name="commiteeDates[0]"
                        component={CommonStyle.DatePicker}
                        validate={value => {
                          if (!value) return intl.formatMessage({ id: 'ERROR_FIELD_REQUIRED' });
                          const selectedDate = new Date(value);
                          if (selectedDate >= new Date(values.committeeDates[1])) {
                            if (values.committeeDates.length === 3) {
                              return 'This date has to be before the second pre committee date';
                            } else {
                              return 'This date has to be before the committee date';
                            }
                          }
                          return undefined;
                        }}
                        label={intl.formatMessage({ id: 'Pre Committee Date 1' })}
                        isReadOnly={statusData.currentCommiteeOrder >= 1}
                        hasError={hasError(errors, touched, 'commiteeDates[0]')}
                      />
                    ) : (
                      <CommonStyle.Value title={initiative.commiteeDates[0]}>
                        {values.commiteeDates[0] || '-'}
                      </CommonStyle.Value>
                    )}
                  </CommonStyle.RowContainer>
                )}

                {/* ✅ Pre Committee Date 2 — toujours en colonne 3 */}
                {commiteeNames.length > 2 && (
                  <CommonStyle.RowContainer>
                    <CommonStyle.Label>
                      {commiteeNames[1] + ' Committee Date'}
                    </CommonStyle.Label>
                    {isEditing ? (
                      <Field
                        name="commiteeDates[1]"
                        component={CommonStyle.DatePicker}
                        validate={value => {
                          if (!value) return intl.formatMessage({ id: 'ERROR_FIELD_REQUIRED' });
                          const selectedDate = new Date(value);
                          if (selectedDate >= new Date(values.committeeDate)) {
                            return 'This date has to be before the committee date';
                          }
                          return undefined;
                        }}
                        label={intl.formatMessage({ id: 'Pre Committee Date 2' })}
                        isReadOnly={statusData.currentCommiteeOrder >= 2}
                        hasError={hasError(errors, touched, 'commiteeDates[1]')}
                      />
                    ) : (
                      <CommonStyle.Value title={initiative.commiteeDates[1]}>
                        {values.commiteeDates[1] || '-'}
                      </CommonStyle.Value>
                    )}
                  </CommonStyle.RowContainer>
                )}

              </CommonStyle.ColumnContainer>

            </CommonStyle.ContentContainer>

            <CommonStyle.ContentContainer>
              <CommonStyle.ColumnContainer />
            </CommonStyle.ContentContainer>

          </div>
        </CommonStyle.MainInfoContainer>
      </Form>
    </CommonStyle.Container>
  );
};

export default InitiativeDescription;
