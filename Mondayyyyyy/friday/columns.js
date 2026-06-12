// @flow
import React from 'react';
import FilterInputWithPlaceholder from 'components/Table/FilterInputWithPlaceholder';
import FilterSmallInputWithPlaceholder from 'components/Table/FilterSmallInputWithPlaceholder';
import TableHeader from 'components/Table/TableHeader';
import { NumberGrid } from 'styles';
import { multiSelectFilterMethod, getFilterComponentWithValues } from 'utils/table';
import {
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
} from 'constants/initiativePipeline';
import Style from './InitiativePipeline.style';

export const getPipelineColumns = (
  pipelineProjects: ?(PipelineProjectType[]),
  selectedColumns: string[],
  setIsFilterOpen: (value: boolean) => void,
  trackingStartingDate: ?string,
): Object[] => {
  const pipelineColumns = {
    [INITIATIVE_ID_COLUMN]: {
      Header: <TableHeader label="INITIATIVE.INITIATIVE_ID" />,
      accessor: 'id',
      minWidth: NumberGrid(15),
      className: 'center',
      Filter: FilterSmallInputWithPlaceholder,
    },
    [INITIATIVE_NAME_COLUMN]: {
      Header: <TableHeader label="INITIATIVE.INITIATIVE_NAME" />,
      accessor: 'name',
      minWidth: NumberGrid(60),
      Cell: ({ original }: any) => (
        <Style.ProjectName>
          <Style.ProductName>{original.name}</Style.ProductName>
        </Style.ProjectName>
      ),
      Filter: FilterSmallInputWithPlaceholder,
    },
    [INITIATIVE_SUMMARY_COLUMN]: {
      Header: <TableHeader label="INITIATIVE.INITIATIVE_SUMMARY" />,
      accessor: 'summary',
      minWidth: NumberGrid(60),
      Cell: ({ original }: any) => (
        <Style.ProjectName>
          <Style.ProductName>{original.summary}</Style.ProductName>
        </Style.ProjectName>
      ),
      Filter: FilterSmallInputWithPlaceholder,
    },
    [INITIATIVE_TYPE_COLUMN]: {
      Header: <TableHeader label="INITIATIVE.INITIATIVE_TYPE" />,
      accessor: 'productType',
      className: 'center',
      minWidth: NumberGrid(20),
      Filter: getFilterComponentWithValues(pipelineProjects, 'productType', setIsFilterOpen),
      filterMethod: multiSelectFilterMethod,
    },
    [INITIATIVE_SPONSOR_COLUMN]: {
      Header: <TableHeader label="INITIATIVE.INITIATIVE_SPONSOR" />,
      accessor: 'sponsor',
      Cell: (row: any) => row.value || '-',
      minWidth: NumberGrid(24),
      className: 'center',
      Filter: (props: FilterComponentPropsType) => <FilterInputWithPlaceholder {...props} />,
    },
    [INITIATIVE_SPONSOR_COUNTRY_COLUMN]: {
      Header: <TableHeader label="INITIATIVE.INITIATIVE_SPONSOR_COUNTRY" />,
      accessor: 'sponsorCountry',
      Cell: (row: any) => row.value || '-',
      minWidth: NumberGrid(24),
      className: 'center',
      Filter: (props: FilterComponentPropsType) => <FilterInputWithPlaceholder {...props} />,
    },
    [INITIATIVE_ASSET_CLASS_COLUMN]: {
      Header: <TableHeader label="INITIATIVE.INITIATIVE_ASSET_CLASS" />,
      accessor: 'assetClass',
      className: 'center',
      minWidth: NumberGrid(20),
      Filter: getFilterComponentWithValues(pipelineProjects, 'assetClass', setIsFilterOpen),
      filterMethod: multiSelectFilterMethod,
    },
    [INITIATIVE_PIPELINE_GOVERNANCE_REQUIRED_COLUMN]: {
      Header: <TableHeader label="INITIATIVE_PIPELINE.GOVERNANCE_REQUIRED" />,
      accessor: 'governanceRequired',
      Cell: (row: any) => row.value || '-',
      minWidth: NumberGrid(24),
      className: 'center',
      Filter: (props: FilterComponentPropsType) => <FilterInputWithPlaceholder {...props} />,
    },
    [INITIATIVE_MANAGEMENT_COMPANY_COLUMN]: {
      Header: <TableHeader label="INITIATIVE.INITIATIVE_MANCO" />,
      accessor: 'managementCompany',
      Cell: (row: any) => row.value || '-',
      minWidth: NumberGrid(24),
      className: 'center',
      Filter: (props: FilterComponentPropsType) => <FilterInputWithPlaceholder {...props} />,
    },
    [INITIATIVE_COMMITTEE_DATE_COLUMN]: {
      Header: <TableHeader label="INITIATIVE.INITIATIVE_COMMITTEE_DATE" />,
      accessor: 'committeeDate',
      Cell: (row: any) => row.value || '-',
      minWidth: NumberGrid(24),
      className: 'center',
      Filter: (props: FilterComponentPropsType) => <FilterInputWithPlaceholder {...props} />,
    },
    // ← AJOUT ticket 265478
    [INITIATIVE_COMMITTEE_DATE_2_COLUMN]: {
      Header: <TableHeader label="INITIATIVE.INITIATIVE_COMMITTEE_DATE_2" />,
      accessor: 'committeeDates[1]',
      Cell: (row: any) => row.value || '-',
      minWidth: NumberGrid(24),
      className: 'center',
      Filter: (props: FilterComponentPropsType) => <FilterInputWithPlaceholder {...props} />,
    },
    [INITIATIVE_DISTRIBUTION_CHANNNEL_COLUMN]: {
      Header: <TableHeader label="INITIATIVE.INITIATIVE_DISTRIBUTION_CHANNEL" />,
      accessor: 'distributionChannel',
      Cell: (row: any) => row.value || '-',
      minWidth: NumberGrid(24),
      className: 'center',
      Filter: (props: FilterComponentPropsType) => <FilterInputWithPlaceholder {...props} />,
    },
    [INITIATIVE_LEGAL_FORM_COLUMN]: {
      Header: <TableHeader label="INITIATIVE.INITIATIVE_LEGAL_FORM" />,
      accessor: 'legalForm',
      className: 'center',
      minWidth: NumberGrid(20),
      Filter: getFilterComponentWithValues(pipelineProjects, 'legalForm', setIsFilterOpen),
      filterMethod: multiSelectFilterMethod,
    },
    [INITIATIVE_OWNER_COLUMN]: {
      Header: <TableHeader label="INITIATIVE.INITIATIVE_OWNER" />,
      accessor: 'initiativeOwner',
      Cell: (row: any) => row.value || '-',
      minWidth: NumberGrid(24),
      className: 'center',
      Filter: (props: FilterComponentPropsType) => <FilterInputWithPlaceholder {...props} />,
    },
  };

  const selectedPipelineColumns = [
    ...selectedColumns.map(columnKey => pipelineColumns[columnKey]).filter(Boolean),
  ];

  return selectedPipelineColumns;
};
