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

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

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

  // Inline add commitee
  const [addingCommiteeFor, setAddingCommiteeFor] = useState(null);
  const [newCommiteeName, setNewCommiteeName] = useState('');

  // Inline add status
  const [addingStatusFor, setAddingStatusFor] = useState(null);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusFinal, setNewStatusFinal] = useState(false);

  useEffect(() => { fetchGovernances(); }, [fetchGovernances]);

  useEffect(() => {
    if (governances.length > 0) {
      const allGovOpen = {};
      const allComOpen = {};
      governances.forEach(g => {
        allGovOpen[g.id] = true;
        (g.commitees || []).forEach(c => { allComOpen[c.id] = true; });
      });
      setOpenedGovernances(allGovOpen);
      setOpenedCommitees(allComOpen);
    }
  }, [governances]);

  const toggleGovernance = useCallback((id) => {
    setOpenedGovernances(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleCommitee = useCallback((id) => {
    setOpenedCommitees(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // ── Commitee inline ───────────────────────────────────────────────────────
  const openAddCommitee = useCallback((govId) => {
    setAddingCommiteeFor(govId);
    setNewCommiteeName('');
    setOpenedGovernances(prev => ({ ...prev, [govId]: true }));
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

  // ── Status inline ──────────────────────────────────────────────────────────
  const openAddStatus = useCallback((comId) => {
    setAddingStatusFor(comId);
    setNewStatusName('');
    setNewStatusFinal(false);
    setOpenedCommitees(prev => ({ ...prev, [comId]: true }));
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
      {/* Header */}
      <Style.PageHeader>
        <Style.PageTitle>GOVERNANCE CONFIG</Style.PageTitle>
        <Style.AddButton type="button" onClick={() => setIsModalOpen(true)}>
          <PlusIcon /> ADD GOVERNANCE
        </Style.AddButton>
      </Style.PageHeader>

      {/* Table */}
      <Style.TableWrapper>
        {/* Column headers */}
        <Style.TableHead>
          <Style.HeadCell flex={2}>Governance</Style.HeadCell>
          <Style.HeadCell flex={2}>Committee</Style.HeadCell>
          <Style.HeadCell flex={3}>Status initiative</Style.HeadCell>
          <Style.HeadCell flex={1} center>Final status?</Style.HeadCell>
          <Style.HeadCell width={100} center>Actions</Style.HeadCell>
        </Style.TableHead>

        {/* Body */}
        {governances.length === 0 && (
          <Style.EmptyState>No governance configured yet.</Style.EmptyState>
        )}

        {governances.map((governance, gi) => (
          <Style.GovernanceBlock key={governance.id} isLast={gi === governances.length - 1}>

            {/* ── Governance row ── */}
            <Style.GovRow>
              <Style.Cell flex={2}>
                <Style.Chevron
                  type="button"
                  isOpen={openedGovernances[governance.id]}
                  onClick={() => toggleGovernance(governance.id)}
                >▶</Style.Chevron>
                <Style.GovLabel>{governance.name}</Style.GovLabel>
              </Style.Cell>
              <Style.Cell flex={2} />
              <Style.Cell flex={3} />
              <Style.Cell flex={1} />
              <Style.Cell width={100} center>
                <Style.ActionGroup>
                  <Style.Btn variant="edit" title="Edit governance"><EditIcon /></Style.Btn>
                  <Style.Btn variant="danger" title="Delete governance" onClick={() => deleteGovernance(governance.id)}><DeleteIcon /></Style.Btn>
                </Style.ActionGroup>
              </Style.Cell>
            </Style.GovRow>

            {/* ── Committees ── */}
            {openedGovernances[governance.id] && (
              <>
                {(governance.commitees || []).map((commitee, ci) => (
                  <Style.CommiteeBlock key={commitee.id}>

                    {/* Commitee row */}
                    <Style.ComRow>
                      <Style.Cell flex={2} />
                      <Style.Cell flex={2}>
                        <Style.Chevron
                          type="button"
                          isOpen={openedCommitees[commitee.id]}
                          onClick={() => toggleCommitee(commitee.id)}
                          small
                        >▶</Style.Chevron>
                        <Style.ComLabel>{commitee.name}</Style.ComLabel>
                      </Style.Cell>
                      <Style.Cell flex={3} />
                      <Style.Cell flex={1} />
                      <Style.Cell width={100} center>
                        <Style.ActionGroup>
                          <Style.Btn variant="edit" title="Edit committee"><EditIcon /></Style.Btn>
                          <Style.Btn variant="danger" title="Delete committee" onClick={() => deleteCommitee(commitee.id)}><DeleteIcon /></Style.Btn>
                        </Style.ActionGroup>
                      </Style.Cell>
                    </Style.ComRow>

                    {/* Statuses */}
                    {openedCommitees[commitee.id] && (
                      <>
                        {(commitee.status_initiatives || []).map(status => (
                          <Style.StatusRow key={status.id}>
                            <Style.Cell flex={2} />
                            <Style.Cell flex={2} />
                            <Style.Cell flex={3}>
                              <Style.StatusDot isFinal={status.is_final_status} />
                              <Style.StatusLabel>{status.name}</Style.StatusLabel>
                            </Style.Cell>
                            <Style.Cell flex={1} center>
                              <Style.Badge isFinal={status.is_final_status}>
                                {status.is_final_status ? 'Yes' : 'No'}
                              </Style.Badge>
                            </Style.Cell>
                            <Style.Cell width={100} center>
                              <Style.ActionGroup>
                                <Style.Btn variant="edit" title="Edit status"><EditIcon /></Style.Btn>
                                <Style.Btn variant="danger" title="Delete status" onClick={() => deleteStatusInitiative(status.id)}><DeleteIcon /></Style.Btn>
                              </Style.ActionGroup>
                            </Style.Cell>
                          </Style.StatusRow>
                        ))}

                        {/* Inline add status row */}
                        {addingStatusFor === commitee.id ? (
                          <Style.InlineRow>
                            <Style.Cell flex={2} />
                            <Style.Cell flex={2} />
                            <Style.Cell flex={3}>
                              <Style.InlineInput
                                autoFocus
                                type="text"
                                placeholder="Status name..."
                                value={newStatusName}
                                onChange={e => setNewStatusName(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') confirmAddStatus();
                                  if (e.key === 'Escape') cancelAddStatus();
                                }}
                              />
                            </Style.Cell>
                            <Style.Cell flex={1} center>
                              <Style.CheckboxLabel>
                                <input type="checkbox" checked={newStatusFinal} onChange={e => setNewStatusFinal(e.target.checked)} />
                                Final
                              </Style.CheckboxLabel>
                            </Style.Cell>
                            <Style.Cell width={100} center>
                              <Style.ActionGroup>
                                <Style.Btn variant="confirm" onClick={confirmAddStatus}><CheckIcon /></Style.Btn>
                                <Style.Btn variant="danger" onClick={cancelAddStatus}><DeleteIcon /></Style.Btn>
                              </Style.ActionGroup>
                            </Style.Cell>
                          </Style.InlineRow>
                        ) : (
                          <Style.AddLink type="button" indent={3} onClick={() => openAddStatus(commitee.id)}>
                            <PlusIcon /> Add status
                          </Style.AddLink>
                        )}
                      </>
                    )}
                  </Style.CommiteeBlock>
                ))}

                {/* Inline add commitee row */}
                {addingCommiteeFor === governance.id ? (
                  <Style.InlineRow>
                    <Style.Cell flex={2} />
                    <Style.Cell flex={2}>
                      <Style.InlineInput
                        autoFocus
                        type="text"
                        placeholder="Committee name..."
                        value={newCommiteeName}
                        onChange={e => setNewCommiteeName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') confirmAddCommitee();
                          if (e.key === 'Escape') cancelAddCommitee();
                        }}
                      />
                    </Style.Cell>
                    <Style.Cell flex={3} />
                    <Style.Cell flex={1} />
                    <Style.Cell width={100} center>
                      <Style.ActionGroup>
                        <Style.Btn variant="confirm" onClick={confirmAddCommitee}><CheckIcon /></Style.Btn>
                        <Style.Btn variant="danger" onClick={cancelAddCommitee}><DeleteIcon /></Style.Btn>
                      </Style.ActionGroup>
                    </Style.Cell>
                  </Style.InlineRow>
                ) : (
                  <Style.AddLink type="button" indent={2} onClick={() => openAddCommitee(governance.id)}>
                    <PlusIcon /> Add committee
                  </Style.AddLink>
                )}
              </>
            )}
          </Style.GovernanceBlock>
        ))}
      </Style.TableWrapper>

      <AddGovernanceForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Style.Container>
  );
}
