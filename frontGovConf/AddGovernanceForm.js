// @flow

import React, { useCallback, useState } from 'react';
import Modal from 'components/Modal';
import ModalLayout from 'components/ModalLayout';
import { Grid } from 'styles';
import Style from './AddGovernanceForm.style';

type StatusType = {
  id: string,
  name: string,
  is_final_status: boolean,
};

type CommiteeType = {
  id: string,
  name: string,
  statuses: StatusType[],
};

type ValuesType = {
  governance_name: string,
  commitees: CommiteeType[],
};

export type MapStateToPropsType = {
  creating: boolean,
  creatingError: ?string,
};

export type MapDispatchToPropsType = {
  createGovernance: (payload: any) => void,
};

type PropsType = MapStateToPropsType &
  MapDispatchToPropsType & {
    isOpen: boolean,
    onClose: () => void,
  };

const createEmptyStatus = (): StatusType => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  name: '',
  is_final_status: false,
});

const createEmptyCommitee = (): CommiteeType => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  name: '',
  statuses: [createEmptyStatus()],
});

const AddGovernanceForm = ({ isOpen, onClose, createGovernance, creating }: PropsType) => {
  const [values, setValues] = useState<ValuesType>({
    governance_name: '',
    commitees: [createEmptyCommitee()],
  });
  const [errors, setErrors] = useState<any>({});

  const validate = useCallback(() => {
    const newErrors: any = {};

    if (!values.governance_name.trim()) {
      newErrors.governance_name = 'Required';
    }

    const commiteeErrors = values.commitees.map(commitee => {
      const err: any = {};
      if (!commitee.name.trim()) err.name = 'Required';

      const statusErrors = commitee.statuses.map(status => {
        const sErr: any = {};
        if (!status.name.trim()) sErr.name = 'Required';
        return sErr;
      });

      if (statusErrors.some(e => Object.keys(e).length > 0)) {
        err.statuses = statusErrors;
      }
      return err;
    });

    if (commiteeErrors.some(e => Object.keys(e).length > 0)) {
      newErrors.commitees = commiteeErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;

    createGovernance({
      name: values.governance_name,
      commitees: values.commitees.map(c => ({
        name: c.name,
        statuses: c.statuses.map(s => ({
          name: s.name,
          is_final_status: s.is_final_status,
        })),
      })),
    });

    setValues({ governance_name: '', commitees: [createEmptyCommitee()] });
    setErrors({});
    onClose();
  }, [values, validate, createGovernance, onClose]);

  const handleClose = useCallback(() => {
    setValues({ governance_name: '', commitees: [createEmptyCommitee()] });
    setErrors({});
    onClose();
  }, [onClose]);

  // ── Governance name ─────────────────────────────────────────────────────────
  const updateGovernanceName = useCallback(
    e => setValues(prev => ({ ...prev, governance_name: e.target.value })),
    []
  );

  // ── Commitees ───────────────────────────────────────────────────────────────
  const addCommitee = useCallback(() => {
    setValues(prev => ({
      ...prev,
      commitees: [...prev.commitees, createEmptyCommitee()],
    }));
  }, []);

  const removeCommitee = useCallback((commiteeId: string) => {
    setValues(prev => ({
      ...prev,
      commitees: prev.commitees.filter(c => c.id !== commiteeId),
    }));
  }, []);

  const updateCommiteeName = useCallback((commiteeId: string, name: string) => {
    setValues(prev => ({
      ...prev,
      commitees: prev.commitees.map(c =>
        c.id === commiteeId ? { ...c, name } : c
      ),
    }));
  }, []);

  // ── Statuses ────────────────────────────────────────────────────────────────
  const addStatus = useCallback((commiteeId: string) => {
    setValues(prev => ({
      ...prev,
      commitees: prev.commitees.map(c =>
        c.id === commiteeId
          ? { ...c, statuses: [...c.statuses, createEmptyStatus()] }
          : c
      ),
    }));
  }, []);

  const removeStatus = useCallback((commiteeId: string, statusId: string) => {
    setValues(prev => ({
      ...prev,
      commitees: prev.commitees.map(c =>
        c.id === commiteeId
          ? { ...c, statuses: c.statuses.filter(s => s.id !== statusId) }
          : c
      ),
    }));
  }, []);

  const updateStatusName = useCallback(
    (commiteeId: string, statusId: string, name: string) => {
      setValues(prev => ({
        ...prev,
        commitees: prev.commitees.map(c =>
          c.id === commiteeId
            ? {
                ...c,
                statuses: c.statuses.map(s =>
                  s.id === statusId ? { ...s, name } : s
                ),
              }
            : c
        ),
      }));
    },
    []
  );

  const toggleFinalStatus = useCallback(
    (commiteeId: string, statusId: string) => {
      setValues(prev => ({
        ...prev,
        commitees: prev.commitees.map(c =>
          c.id === commiteeId
            ? {
                ...c,
                statuses: c.statuses.map(s =>
                  s.id === statusId
                    ? { ...s, is_final_status: !s.is_final_status }
                    : s
                ),
              }
            : c
        ),
      }));
    },
    []
  );

  return (
    <Modal
      width={Grid(180)}
      height={Grid(200)}
      isOpen={isOpen}
      onCloseClick={handleClose}
    >
      <ModalLayout
        title="Add Governance Config"
        description="Set up the governance with its committees and statuses"
        onCancel={handleClose}
        onConfirm={handleSubmit}
        isConfirmDisabled={creating}
      >
        {/* Governance name */}
        <Style.Section>
          <Style.Label>Governance name *</Style.Label>
          <Style.Input
            type="text"
            placeholder="Governance name"
            value={values.governance_name}
            onChange={updateGovernanceName}
          />
          {errors.governance_name && (
            <Style.ErrorText>{errors.governance_name}</Style.ErrorText>
          )}
        </Style.Section>

        {/* Committees */}
        <Style.TableHeader>
          <Style.ColHeader style={{ flex: 2 }}>Committee</Style.ColHeader>
          <Style.ColHeader style={{ flex: 3 }}>Status initiative</Style.ColHeader>
          <Style.ColHeader style={{ flex: 1 }}>Final status?</Style.ColHeader>
          <Style.ColHeader style={{ width: 40 }} />
        </Style.TableHeader>

        {values.commitees.map((commitee, ci) => (
          <Style.CommiteeBlock key={commitee.id}>
            {/* Committee name row */}
            <Style.CommiteeRow>
              <Style.CommiteeNameCell>
                <Style.Input
                  type="text"
                  placeholder={`Committee ${ci + 1}`}
                  value={commitee.name}
                  onChange={e => updateCommiteeName(commitee.id, e.target.value)}
                />
                {errors.commitees?.[ci]?.name && (
                  <Style.ErrorText>{errors.commitees[ci].name}</Style.ErrorText>
                )}
              </Style.CommiteeNameCell>

              {/* Statuses for this committee */}
              <Style.StatusesCell>
                {commitee.statuses.map((status, si) => (
                  <Style.StatusRow key={status.id}>
                    <Style.StatusInput
                      type="text"
                      placeholder={`Status ${si + 1}`}
                      value={status.name}
                      onChange={e =>
                        updateStatusName(commitee.id, status.id, e.target.value)
                      }
                    />
                    {errors.commitees?.[ci]?.statuses?.[si]?.name && (
                      <Style.ErrorText>
                        {errors.commitees[ci].statuses[si].name}
                      </Style.ErrorText>
                    )}
                    <Style.FinalStatusCheckbox>
                      <input
                        type="checkbox"
                        checked={status.is_final_status}
                        onChange={() => toggleFinalStatus(commitee.id, status.id)}
                      />
                      <span>Yes</span>
                    </Style.FinalStatusCheckbox>
                    {commitee.statuses.length > 1 && (
                      <Style.RemoveButton
                        type="button"
                        onClick={() => removeStatus(commitee.id, status.id)}
                      >
                        ×
                      </Style.RemoveButton>
                    )}
                  </Style.StatusRow>
                ))}

                {/* Add status */}
                <Style.AddStatusButton
                  type="button"
                  onClick={() => addStatus(commitee.id)}
                >
                  + Add status
                </Style.AddStatusButton>
              </Style.StatusesCell>

              {/* Remove committee */}
              {values.commitees.length > 1 && (
                <Style.RemoveCommiteeButton
                  type="button"
                  onClick={() => removeCommitee(commitee.id)}
                >
                  ×
                </Style.RemoveCommiteeButton>
              )}
            </Style.CommiteeRow>
          </Style.CommiteeBlock>
        ))}

        {/* Add committee */}
        <Style.ActionsRow>
          <Style.AddLineButton type="button" onClick={addCommitee}>
            + Add committee
          </Style.AddLineButton>
        </Style.ActionsRow>
      </ModalLayout>
    </Modal>
  );
};

export default AddGovernanceForm;
