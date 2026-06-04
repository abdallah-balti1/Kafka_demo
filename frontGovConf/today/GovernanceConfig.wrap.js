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
  clearGovernanceError,
} from 'redux/entities/governance/actions';

import {
  selectGovernances,
  selectGovernancesLoading,
  selectGovernanceDeleteLinkedError,
  selectCommiteeDeleteLinkedError,
  selectStatusDeleteLinkedError,
} from 'redux/entities/governance/selectors';

import GovernanceConfig, {
  type MapStateToPropsType,
  type MapDispatchToPropsType,
} from './GovernanceConfig';

const mapStateToProps = (state: any): MapStateToPropsType => ({
  governances: selectGovernances(state),
  loading: selectGovernancesLoading(state),
  deleteLinkedError: selectGovernanceDeleteLinkedError(state),
  deleteCommiteeLinkedError: selectCommiteeDeleteLinkedError(state),
  deleteStatusLinkedError: selectStatusDeleteLinkedError(state),
});

const mapDispatchToProps: MapDispatchToPropsType = {
  fetchGovernances: () => fetchGovernances(),
  deleteGovernance: (id: number) => deleteGovernance(id),
  deleteCommitee: (id: number) => deleteCommitee(id),
  deleteStatusInitiative: (id: number) => deleteStatusInitiative(id),
  createCommitee: (payload: any) => createCommitee(payload),
  createStatusInitiative: (payload: any) => createStatusInitiative(payload),
  updateGovernance: (id: number, payload: any) => updateGovernance(id, payload),
  updateCommitee: (id: number, payload: any) => updateCommitee(id, payload),
  updateStatusInitiative: (id: number, payload: any) => updateStatusInitiative(id, payload),
  clearGovernanceError: () => clearGovernanceError(),
};

export default connect(mapStateToProps, mapDispatchToProps)(GovernanceConfig);
