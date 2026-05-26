// @flow

import { connect } from 'react-redux';

import {
  fetchGovernances,
  deleteGovernance,
  deleteCommitee,
  deleteStatusInitiative,
} from 'redux/entities/governance/actions';

import {
  selectGovernances,
  selectGovernancesLoading,
} from 'redux/entities/governance/selectors';

import GovernanceConfig, {
  type MapStateToPropsType,
  type MapDispatchToPropsType,
} from './GovernanceConfig';

const mapStateToProps = (state: any): MapStateToPropsType => ({
  governances: selectGovernances(state),
  loading: selectGovernancesLoading(state),
});

const mapDispatchToProps: MapDispatchToPropsType = {
  fetchGovernances: () => fetchGovernances(),
  deleteGovernance: (id: number) => deleteGovernance(id),
  deleteCommitee: (id: number) => deleteCommitee(id),
  deleteStatusInitiative: (id: number) => deleteStatusInitiative(id),
};

export default connect(mapStateToProps, mapDispatchToProps)(GovernanceConfig);
