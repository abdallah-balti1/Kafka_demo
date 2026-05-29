// @flow

import { connect } from 'react-redux';

import {
  fetchGovernances,
  deleteGovernance,
  deleteCommitee,
  deleteStatusInitiative,
  createCommitee,
  createStatusInitiative,
  updateGovernance,
  updateCommitee,
  updateStatusInitiative,
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
  deleteGovernance: (id) => deleteGovernance(id),
  deleteCommitee: (id) => deleteCommitee(id),
  deleteStatusInitiative: (id) => deleteStatusInitiative(id),
  createCommitee: (payload) => createCommitee(payload),
  createStatusInitiative: (payload) => createStatusInitiative(payload),
  updateGovernance: (id, payload) => updateGovernance(id, payload),
  updateCommitee: (id, payload) => updateCommitee(id, payload),
  updateStatusInitiative: (id, payload) => updateStatusInitiative(id, payload),
};

export default connect(mapStateToProps, mapDispatchToProps)(GovernanceConfig);
