// @flow
import { Icon } from '@component-studio/ui/build/cjs/components';
import IconButton from 'components/IconButton';
import FilterInputWithPlaceholder from 'components/Table/FilterInputWithPlaceholder';
import TableHeader from 'components/Table/TableHeader';
import { USER_ROLE_INITIATIVE_ASSESSOR } from 'constants/app';
import {
  INITIATIVE_PIPELINE_ALLOWED_READ_ROLES,
  INITIATIVE_TASK_UPDATE_ALLOWED_ROLES,
} from 'constants/initiativePipeline';
import { NumberGrid } from 'styles';
import { dateFilterMethod, getDateFilter } from 'utils/table';
import commonStyle from './common.style';

const getStatusClassName = label => {
  switch ((label || '').toUpperCase()) {
    case 'NOT_STARTED':
      return 'not-started';
    case 'ON_GOING':
      return 'on-going';
    case 'DONE':
      return 'done';
    case 'CANCELED':
      return 'canceled';
    default:
      return '';
  }
};

const formatStatusLabel = value =>
  (value || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const columns = [
  {
    Header: '',
    accessor: '_expander',
    width: 35,
    sortable: false,
    filterable: false,
    Cell: ({ original }: { original: Object }) => {
      if (!original || !original._isParent || !original._hasChildren) {
        return null;
      }
      // ... expander icon logic (unchanged)
      return null;
    },
  },

  // ... INITIATIVE ID, TYPE, TASK NAME, EXPECTED FOR, STATUS, RATING columns unchanged ...

  // ↓↓↓ AJOUT ticket 265729 — tooltip au survol de l'icône comment ↓↓↓
  {
    id: 'comment',
    Header: <TableHeader label="COMMENT" />,
    accessor: 'comment',
    Cell: ({ value }: { value: any }) =>
      value ? (
        <Icon
          name="comment"
          size={18}
          data-tip={value}
          style={{ cursor: 'pointer' }}
        />
      ) : (
        ''
      ),
    Filter: (props: FilterComponentPropsType) => <FilterInputWithPlaceholder {...props} />,
  },
  // ↑↑↑ FIN AJOUT ticket 265729 ↑↑↑

  {
    id: 'assessmentCategory',
    Header: <TableHeader label="ASSESSMENT CATEGORY" />,
    accessor: 'assessmentCategory',
    Cell: ({ value }: { value: any }) => value ?? '',
    Filter: (props: FilterComponentPropsType) => <FilterInputWithPlaceholder {...props} />,
  },
  {
    id: 'assessmentSubCategory',
    Header: <TableHeader label="ASSESSMENT SUB CATEGORY" />,
    accessor: 'assessmentSubCategory',
    Cell: ({ value }: { value: any }) => value ?? '',
    Filter: (props: FilterComponentPropsType) => <FilterInputWithPlaceholder {...props} />,
  },

  // ... ASSESSOR TEAM column and any remaining columns unchanged ...
];

export default columns;
