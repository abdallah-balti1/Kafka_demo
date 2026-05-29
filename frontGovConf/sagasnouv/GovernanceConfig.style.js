// @flow

import styled from 'styled-components';
import { Grid } from 'styles';

const GREEN = '#009473';
const GREEN_DARK = '#007a5e';
const GREEN_LIGHT = '#e8f5f1';
const DANGER = '#d32f2f';
const DANGER_LIGHT = '#fff5f5';
const BORDER = '#e8e8e8';
const TEXT_PRIMARY = '#1a1a2e';
const TEXT_SECONDARY = '#6b7280';
const BG_GOV = '#f8fffe';
const BG_COM = '#fcfcfc';

export default {
  Container: styled.div`
    width: 100%;
    padding: ${Grid(4)};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `,

  PageHeader: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${Grid(5)};
  `,

  PageTitle: styled.h2`
    font-size: 13px;
    font-weight: 700;
    color: ${TEXT_SECONDARY};
    margin: 0;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  `,

  AddButton: styled.button`
    padding: ${Grid(2)} ${Grid(4)};
    background-color: ${GREEN};
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.3px;
    transition: background 0.15s;
    &:hover { background-color: ${GREEN_DARK}; }
  `,

  Table: styled.div`
    border: 1px solid ${BORDER};
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  `,

  TableHeader: styled.div`
    display: flex;
    align-items: center;
    background-color: ${GREEN};
    color: white;
    padding: ${Grid(2)} ${Grid(3)};
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  `,

  // ── Shared columns ─────────────────────────────────────────────────────────
  ColGov: styled.div`
    flex: 2;
    display: flex;
    align-items: center;
    gap: ${Grid(1)};
    min-width: 0;
    padding-right: ${Grid(2)};
  `,

  ColCom: styled.div`
    flex: 2;
    display: flex;
    align-items: center;
    gap: ${Grid(1)};
    min-width: 0;
    padding-right: ${Grid(2)};
  `,

  ColStatus: styled.div`
    flex: 3;
    display: flex;
    align-items: center;
    gap: ${Grid(1)};
    min-width: 0;
    padding-right: ${Grid(2)};
    font-size: 13px;
    color: ${TEXT_PRIMARY};
  `,

  ColFinal: styled.div`
    flex: 1;
    min-width: 90px;
    display: flex;
    align-items: center;
  `,

  ColActions: styled.div`
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${Grid(1)};
    flex-shrink: 0;
  `,

  // ── Governance ──────────────────────────────────────────────────────────────
  GovernanceSection: styled.div`
    border-bottom: 1px solid ${BORDER};
    &:last-child { border-bottom: none; }
  `,

  GovernanceRow: styled.div`
    display: flex;
    align-items: center;
    padding: ${Grid(2)} ${Grid(3)};
    background-color: ${BG_GOV};
    min-height: 44px;
    &:hover { background-color: ${GREEN_LIGHT}; }
    transition: background 0.1s;
  `,

  GovName: styled.span`
    font-size: 14px;
    font-weight: 600;
    color: ${TEXT_PRIMARY};
    letter-spacing: 0.1px;
  `,

  // ── Committee ───────────────────────────────────────────────────────────────
  CommiteesWrapper: styled.div`
    border-top: 1px solid ${BORDER};
  `,

  CommiteeSection: styled.div`
    border-bottom: 1px solid #f0f0f0;
    &:last-child { border-bottom: none; }
  `,

  CommiteeRow: styled.div`
    display: flex;
    align-items: center;
    padding: ${Grid(1.5)} ${Grid(3)};
    background-color: ${BG_COM};
    min-height: 40px;
    &:hover { background-color: #f5f5f5; }
    transition: background 0.1s;
  `,

  ComName: styled.span`
    font-size: 13px;
    font-weight: 500;
    color: ${TEXT_PRIMARY};
  `,

  // ── Statuses ────────────────────────────────────────────────────────────────
  StatusesWrapper: styled.div`
    border-top: 1px solid #f5f5f5;
  `,

  StatusRow: styled.div`
    display: flex;
    align-items: center;
    padding: ${Grid(1)} ${Grid(3)};
    min-height: 36px;
    background-color: white;
    &:hover { background-color: #fafafa; }
    border-bottom: 1px solid #f9f9f9;
    &:last-child { border-bottom: none; }
  `,

  StatusDot: styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ isFinal }) => (isFinal ? GREEN : '#d1d5db')};
    flex-shrink: 0;
  `,

  Badge: styled.span`
    display: inline-flex;
    align-items: center;
    padding: 2px ${Grid(1.5)};
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3px;
    background-color: ${({ isFinal }) => (isFinal ? GREEN_LIGHT : '#f3f4f6')};
    color: ${({ isFinal }) => (isFinal ? GREEN_DARK : TEXT_SECONDARY)};
    border: 1px solid ${({ isFinal }) => (isFinal ? '#a7f3d0' : '#e5e7eb')};
  `,

  // ── Toggle button ───────────────────────────────────────────────────────────
  ToggleBtn: styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px 4px;
    font-size: 9px;
    color: ${TEXT_SECONDARY};
    transition: transform 0.2s, color 0.1s;
    transform: ${({ isOpen }) => (isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
    flex-shrink: 0;
    &:hover { color: ${GREEN}; }
  `,

  // ── Action icons ────────────────────────────────────────────────────────────
  IconBtn: styled.button`
    width: 26px;
    height: 26px;
    border-radius: 4px;
    border: 1px solid ${({ variant }) =>
      variant === 'danger' ? '#fca5a5' : variant === 'add' ? '#6ee7b7' : '#e5e7eb'};
    background-color: ${({ variant }) =>
      variant === 'danger' ? DANGER_LIGHT : variant === 'add' ? GREEN_LIGHT : 'white'};
    color: ${({ variant }) =>
      variant === 'danger' ? DANGER : variant === 'add' ? GREEN_DARK : TEXT_SECONDARY};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${({ variant }) => (variant === 'add' ? '14px' : '12px')};
    font-weight: 600;
    transition: all 0.15s;
    &:hover {
      background-color: ${({ variant }) =>
        variant === 'danger' ? '#fee2e2' : variant === 'add' ? '#d1fae5' : '#f3f4f6'};
      border-color: ${({ variant }) =>
        variant === 'danger' ? DANGER : variant === 'add' ? GREEN : '#9ca3af'};
    }
  `,

  PlusIcon: styled.span`
    line-height: 1;
  `,

  ConfirmBtn: styled.button`
    width: 26px;
    height: 26px;
    border-radius: 4px;
    border: 1px solid #6ee7b7;
    background-color: ${GREEN_LIGHT};
    color: ${GREEN_DARK};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    &:hover { background-color: #d1fae5; }
  `,

  // ── Inline add row ──────────────────────────────────────────────────────────
  InlineAddRow: styled.div`
    display: flex;
    align-items: center;
    padding: ${Grid(1)} ${Grid(3)};
    background-color: #fffdf0;
    border-top: 1px dashed #fde68a;
    border-bottom: 1px dashed #fde68a;
    min-height: 40px;
  `,

  InlineInput: styled.input`
    flex: 1;
    height: 30px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    padding: 0 ${Grid(2)};
    font-size: 13px;
    outline: none;
    box-sizing: border-box;
    &:focus { border-color: ${GREEN}; box-shadow: 0 0 0 2px ${GREEN_LIGHT}; }
  `,

  CheckboxLabel: styled.label`
    display: flex;
    align-items: center;
    gap: ${Grid(1)};
    font-size: 12px;
    color: ${TEXT_SECONDARY};
    cursor: pointer;
    white-space: nowrap;
  `,

  AddRowLink: styled.button`
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: ${Grid(1)} ${Grid(3)};
    font-size: 12px;
    color: ${TEXT_SECONDARY};
    cursor: pointer;
    transition: color 0.1s;
    &:hover { color: ${GREEN}; }
  `,

  // ── Misc ────────────────────────────────────────────────────────────────────
  EmptyState: styled.div`
    padding: ${Grid(8)};
    text-align: center;
    color: #9ca3af;
    font-size: 14px;
    font-style: italic;
  `,

  Loading: styled.div`
    padding: ${Grid(8)};
    text-align: center;
    color: ${TEXT_SECONDARY};
    font-size: 14px;
  `,
};
