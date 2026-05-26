// @flow

import { connect } from 'react-redux';

import { createGovernance } from 'redux/entities/governance/actions';
import {
  selectGovernancesCreating,
  selectGovernancesCreatingError,
} from 'redux/entities/governance/selectors';

import AddGovernanceForm, {
  type MapStateToPropsType,
  type MapDispatchToPropsType,
} from './AddGovernanceForm';

const mapStateToProps = (state: any): MapStateToPropsType => ({
  creating: selectGovernancesCreating(state),
  creatingError: selectGovernancesCreatingError(state),
});

const mapDispatchToProps: MapDispatchToPropsType = {
  createGovernance: payload => createGovernance(payload),
};

export default connect(mapStateToProps, mapDispatchToProps)(AddGovernanceForm);
