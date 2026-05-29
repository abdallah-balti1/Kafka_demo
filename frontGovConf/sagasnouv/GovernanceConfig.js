// @flow

import React, { useCallback, useEffect, useState } from 'react';
import AddGovernanceForm from './components/AddGovernanceForm';
import Style from './GovernanceConfig.style';

export type MapStateToPropsType = {
  governances: any[],
  loading: boolean,
};

export type MapDispatchToPropsType = {
  fetchGovernances: () => void,
  deleteGovernance: (id: number) => void,
  deleteCommitee: (id: number) => void,
  deleteStatusInitiative: (id: number) => void,
  createCommitee: (payload: any) => void,
  createStatusInitiative: (payload: any) => void,
};

type PropsType = MapStateToPropsType & MapDispatchToPropsType;

export default function GovernanceConfig({
  governances,
  loading,
  fetchGovernances,
  deleteGovernance,
  deleteCommitee,
  deleteStatusInitiative,
  createCommitee,
  createStatusInitiative,
}: PropsType) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openedGovernances, setOpenedGovernances] = useState({});
  const [openedCommitees, setOpenedCommitees] = useState({});
  const [addingCommiteeFor, setAddingCommiteeFor] = useState(null);
  const [newCommiteeName, setNewCommiteeName] = useState('');
  const [addingStatusFor, setAddingStatusFor] = useState(null);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusFinal, setNewStatusFinal] = useState(false);

  useEffect(() => {
    fetchGovernances();
  }, [fetchGovernances]);

  useEffect(() => {
    if (governances.length > 0) {
      const allOpen = {};
      governances.forEach(g => { allOpen[g.id] = true; });
      setOpenedGovernances(allOpen);
    }
  }, [governances]);

  const toggleGovernance = useCallback((id) => {
    setOpenedGovernances(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleCommitee = useCallback((id) => {
    setOpenedCommitees(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const openAddCommitee = useCallback((governanceId) => {
    setAddingCommiteeFor(governanceId);
    setNewCommiteeName('');
  }, []);

  const cancelAddCommitee = useCallback(() => {
    setAddingCommiteeFor(null);
    setNewCommiteeName('');
  }, []);

  const confirmAddCommitee = useCallback(() => {
    if (!newCommiteeName.trim()) return;
    createCommitee({ governance_id: addingCommiteeFor, name: newCommiteeName.trim(), order: 1 });
    setAddingCommiteeFor(null);
    setNewCommiteeName('');
  }, [newCommiteeName, addingCommiteeFor, createCommitee]);

  const openAddStatus = useCallback((commiteeId) => {
    setAddingStatusFor(commiteeId);
    setNewStatusName('');
    setNewStatusFinal(false);
  }, []);

  const cancelAddStatus = useCallback(() => {
    setAddingStatusFor(null);
    setNewStatusName('');
    setNewStatusFinal(false);
  }, []);

  const confirmAddStatus = useCallback(() => {
    if (!newStatusName.trim()) return;
    createStatusInitiative({
      commitee_id: addingStatusFor,
      name: newStatusName.trim(),
      is_final_status: newStatusFinal,
    });
    setAddingStatusFor(null);
    setNewStatusName('');
    setNewStatusFinal(false);
  }, [newStatusName, newStatusFinal, addingStatusFor, createStatusInitiative]);

  if (loading) return <Style.Loading>Loading...</Style.Loading>;

  return (
    <Style.Container>
      <Style.PageHeader>
        <Style.PageTitle>GOVERNANCE CONFIG</Style.PageTitle>
        <Style.AddButton type="button" onClick={() => setIsModalOpen(true)}>
          + ADD GOVERNANCE
        </Style.AddButton>
      </Style.PageHeader>

      <Style.Table>
        <Style.TableHeader>
          <Style.ColGov>Governance</Style.ColGov>
          <Style.ColCom>Committee</Style.ColCom>
          <Style.ColStatus>Status initiative</Style.ColStatus>
          <Style.ColFinal>Final status?</Style.ColFinal>
          <Style.ColActions>Actions</Style.ColActions>
        </Style.TableHeader>

        {governances.length === 0 && (
          <Style.EmptyState>No governance configured yet.</Style.EmptyState>
        )}

        {governances.map(governance => (
          <Style.GovernanceSection key={governance.id}>
            <Style.GovernanceRow>
              <Style.ColGov>
                <Style.ToggleBtn
                  type="button"
                  onClick={() => toggleGovernance(governance.id)}
                  isOpen={openedGovernances[governance.id]}
                >
                  ▶
                </Style.ToggleBtn>
                <Style.GovName>{governance.name}</Style.GovName>
              </Style.ColGov>
              <Style.ColCom />
              <Style.ColStatus />
              <Style.ColFinal />
              <Style.ColActions>
                <Style.IconBtn
                  type="button"
                  title="Add committee"
                  variant="add"
                  onClick={() => {
                    setOpenedGovernances(prev => ({ ...prev, [governance.id]: true }));
                    openAddCommitee(governance.id);
                  }}
                >
                  ＋
                </Style.IconBtn>
                <Style.IconBtn
                  type="button"
                  title="Delete governance"
                  variant="danger"
                  onClick={() => deleteGovernance(governance.id)}
                >
                  ✕
                </Style.IconBtn>
              </Style.ColActions>
            </Style.GovernanceRow>

            {openedGovernances[governance.id] && (
              <Style.CommiteesWrapper>
                {(governance.commitees || []).map(commitee => (
                  <Style.CommiteeSection key={commitee.id}>
                    <Style.CommiteeRow>
                      <Style.ColGov />
                      <Style.ColCom>
                        <Style.ToggleBtn
                          type="button"
                          onClick={() => toggleCommitee(commitee.id)}
                          isOpen={openedCommitees[commitee.id]}
                        >
                          ▶
                        </Style.ToggleBtn>
                        <Style.ComName>{commitee.name}</Style.ComName>
                      </Style.ColCom>
                      <Style.ColStatus />
                      <Style.ColFinal />
                      <Style.ColActions>
                        <Style.IconBtn
                          type="button"
                          title="Add status"
                          variant="add"
                          onClick={() => {
                            setOpenedCommitees(prev => ({ ...prev, [commitee.id]: true }));
                            openAddStatus(commitee.id);
                          }}
                        >
                          ＋
                        </Style.IconBtn>
                        <Style.IconBtn
                          type="button"
                          title="Delete committee"
                          variant="danger"
                          onClick={() => deleteCommitee(commitee.id)}
                        >
                          ✕
                        </Style.IconBtn>
                      </Style.ColActions>
                    </Style.CommiteeRow>

                    {openedCommitees[commitee.id] && (
                      <Style.StatusesWrapper>
                        {(commitee.status_initiatives || []).map(status => (
                          <Style.StatusRow key={status.id}>
                            <Style.ColGov />
                            <Style.ColCom />
                            <Style.ColStatus>
                              <Style.StatusDot isFinal={status.is_final_status} />
                              {status.name}
                            </Style.ColStatus>
                            <Style.ColFinal>
                              <Style.Badge isFinal={status.is_final_status}>
                                {status.is_final_status ? 'Yes' : 'No'}
                              </Style.Badge>
                            </Style.ColFinal>
                            <Style.ColActions>
                              <Style.IconBtn
                                type="button"
                                title="Delete status"
                                variant="danger"
                                onClick={() => deleteStatusInitiative(status.id)}
                              >
                                ✕
                              </Style.IconBtn>
                            </Style.ColActions>
                          </Style.StatusRow>
                        ))}

                        {addingStatusFor === commitee.id ? (
                          <Style.InlineAddRow>
                            <Style.ColGov />
                            <Style.ColCom />
                            <Style.ColStatus>
                              <Style.InlineInput
                                autoFocus
                                type="text"
                                placeholder="Status name"
                                value={newStatusName}
                                onChange={e => setNewStatusName(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') confirmAddStatus();
                                  if (e.key === 'Escape') cancelAddStatus();
                                }}
                              />
                            </Style.ColStatus>
                            <Style.ColFinal>
                              <Style.CheckboxLabel>
                                <input
                                  type="checkbox"
                                  checked={newStatusFinal}
                                  onChange={e => setNewStatusFinal(e.target.checked)}
                                />
                                Final
                              </Style.CheckboxLabel>
                            </Style.ColFinal>
                            <Style.ColActions>
                              <Style.ConfirmBtn type="button" onClick={confirmAddStatus}>✓</Style.ConfirmBtn>
                              <Style.IconBtn type="button" variant="danger" onClick={cancelAddStatus}>✕</Style.IconBtn>
                            </Style.ColActions>
                          </Style.InlineAddRow>
                        ) : (
                          <Style.AddRowLink type="button" onClick={() => openAddStatus(commitee.id)}>
                            + Add status
                          </Style.AddRowLink>
                        )}
                      </Style.StatusesWrapper>
                    )}
                  </Style.CommiteeSection>
                ))}

                {addingCommiteeFor === governance.id ? (
                  <Style.InlineAddRow>
                    <Style.ColGov />
                    <Style.ColCom>
                      <Style.InlineInput
                        autoFocus
                        type="text"
                        placeholder="Committee name"
                        value={newCommiteeName}
                        onChange={e => setNewCommiteeName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') confirmAddCommitee();
                          if (e.key === 'Escape') cancelAddCommitee();
                        }}
                      />
                    </Style.ColCom>
                    <Style.ColStatus />
                    <Style.ColFinal />
                    <Style.ColActions>
                      <Style.ConfirmBtn type="button" onClick={confirmAddCommitee}>✓</Style.ConfirmBtn>
                      <Style.IconBtn type="button" variant="danger" onClick={cancelAddCommitee}>✕</Style.IconBtn>
                    </Style.ColActions>
                  </Style.InlineAddRow>
                ) : (
                  <Style.AddRowLink type="button" onClick={() => openAddCommitee(governance.id)}>
                    + Add committee
                  </Style.AddRowLink>
                )}
              </Style.CommiteesWrapper>
            )}
          </Style.GovernanceSection>
        ))}
      </Style.Table>

      <AddGovernanceForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Style.Container>
  );
}
