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
};

type PropsType = MapStateToPropsType & MapDispatchToPropsType;

export default function GovernanceConfig({
  governances,
  loading,
  fetchGovernances,
  deleteGovernance,
  deleteCommitee,
  deleteStatusInitiative,
}: PropsType) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openedGovernances, setOpenedGovernances] = useState<{ [string]: boolean }>({});

  useEffect(() => {
    fetchGovernances();
  }, [fetchGovernances]);

  // Open first governance by default
  useEffect(() => {
    if (governances.length > 0) {
      setOpenedGovernances(prev => {
        if (Object.keys(prev).length > 0) return prev;
        return { [governances[0].id]: true };
      });
    }
  }, [governances]);

  const toggleGovernance = useCallback((id: number) => {
    setOpenedGovernances(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  if (loading) {
    return <Style.Loading>Loading...</Style.Loading>;
  }

  return (
    <Style.Container>
      {/* Header */}
      <Style.Header>
        <Style.Title>GOVERNANCE CONFIG</Style.Title>
        <Style.AddButton type="button" onClick={openModal}>
          + ADD GOVERNANCE
        </Style.AddButton>
      </Style.Header>

      {/* Table header */}
      <Style.TableHeader>
        <Style.ColGovernance>Governance</Style.ColGovernance>
        <Style.ColCommitee>Committee</Style.ColCommitee>
        <Style.ColStatus>Status initiative</Style.ColStatus>
        <Style.ColFinal>Final status?</Style.ColFinal>
        <Style.ColActions />
      </Style.TableHeader>

      {/* Governance rows */}
      {governances.length === 0 && (
        <Style.EmptyState>No governance configured yet.</Style.EmptyState>
      )}

      {governances.map(governance => (
        <Style.GovernanceBlock key={governance.id}>
          {/* Governance header row */}
          <Style.GovernanceRow onClick={() => toggleGovernance(governance.id)}>
            <Style.ColGovernance>
              <Style.ToggleIcon isOpen={openedGovernances[governance.id]}>▶</Style.ToggleIcon>
              <strong>{governance.name}</strong>
            </Style.ColGovernance>
            <Style.ColCommitee />
            <Style.ColStatus />
            <Style.ColFinal />
            <Style.ColActions>
              <Style.DeleteButton
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  deleteGovernance(governance.id);
                }}
              >
                🗑
              </Style.DeleteButton>
            </Style.ColActions>
          </Style.GovernanceRow>

          {/* Committees */}
          {openedGovernances[governance.id] &&
            (governance.commitees || []).map(commitee => (
              <Style.CommiteeBlock key={commitee.id}>
                {/* Commitee rows with statuses */}
                {(commitee.status_initiatives || []).map((status, si) => (
                  <Style.StatusRow key={status.id}>
                    {/* Show commitee name only on first status row */}
                    <Style.ColGovernance />
                    <Style.ColCommitee>
                      {si === 0 && (
                        <>
                          <span>{commitee.name}</span>
                          <Style.DeleteButton
                            type="button"
                            onClick={() => deleteCommitee(commitee.id)}
                            style={{ marginLeft: 8 }}
                          >
                            🗑
                          </Style.DeleteButton>
                        </>
                      )}
                    </Style.ColCommitee>
                    <Style.ColStatus>{status.name}</Style.ColStatus>
                    <Style.ColFinal>
                      {status.is_final_status ? (
                        <Style.Badge isYes>Yes</Style.Badge>
                      ) : (
                        <Style.Badge>No</Style.Badge>
                      )}
                    </Style.ColFinal>
                    <Style.ColActions>
                      <Style.DeleteButton
                        type="button"
                        onClick={() => deleteStatusInitiative(status.id)}
                      >
                        🗑
                      </Style.DeleteButton>
                    </Style.ColActions>
                  </Style.StatusRow>
                ))}

                {/* Empty commitee (no statuses) */}
                {(commitee.status_initiatives || []).length === 0 && (
                  <Style.StatusRow>
                    <Style.ColGovernance />
                    <Style.ColCommitee>
                      <span>{commitee.name}</span>
                      <Style.DeleteButton
                        type="button"
                        onClick={() => deleteCommitee(commitee.id)}
                        style={{ marginLeft: 8 }}
                      >
                        🗑
                      </Style.DeleteButton>
                    </Style.ColCommitee>
                    <Style.ColStatus>—</Style.ColStatus>
                    <Style.ColFinal>—</Style.ColFinal>
                    <Style.ColActions />
                  </Style.StatusRow>
                )}
              </Style.CommiteeBlock>
            ))}

          {/* Empty governance (no commitees) */}
          {openedGovernances[governance.id] &&
            (governance.commitees || []).length === 0 && (
              <Style.EmptyCommitee>No committees yet.</Style.EmptyCommitee>
            )}
        </Style.GovernanceBlock>
      ))}

      {/* Modal */}
      <AddGovernanceForm isOpen={isModalOpen} onClose={closeModal} />
    </Style.Container>
  );
}
