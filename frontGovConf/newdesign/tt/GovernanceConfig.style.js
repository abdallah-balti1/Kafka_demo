// @flow

import styled from 'styled-components';
import { Grid } from 'styles';

const GREEN       = '#009473';
const GREEN_DARK  = '#007a5e';
const GREEN_LIGHT = '#f0faf7';
const DANGER      = '#dc2626';
const DANGER_BG   = '#fff5f5';
const EDIT_COLOR  = '#2563eb';
const EDIT_BG     = '#eff6ff';
const CONFIRM_BG  = '#f0fdf4';
const CONFIRM_CLR = '#16a34a';
const BORDER      = '#e5e7eb';
const BORDER_LIGHT= '#f3f4f6';
const TEXT        = '#111827';
const TEXT_MUTED  = '#6b7280';
const BG_GOV      = '#f8fffe';
const BG_COM      = '#fafafa';

export default {

  Container: styled.div`
    padding: ${Grid(4)};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: ${TEXT};
  `,

  PageHeader: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${Grid(5)};
  `,

  PageTitle: styled.h2`
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${TEXT_MUTED};
  `,

  AddButton: styled.button`
    display: inline-flex;
    align-items: center;
    gap: ${Grid(1)};
    padding: ${Grid(2)} ${Grid(4)};
    background: ${GREEN};
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.4px;
    cursor: pointer;
    transition: background 0.15s, box-shadow 0.15s;
    box-shadow: 0 2px 6px rgba(0,148,115,0.25);
    &:hover {
      background: ${GREEN_DARK};
      box-shadow: 0 3px 10px rgba(0,148,115,0.35);
    }
  `,

  // ── Table ─────────────────────────────────────────────────────────────────
  TableWrapper: styled.div`
    border: 1px solid ${BORDER};
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  `,

  TableHead: styled.div`
    display: flex;
    align-items: center;
    background: ${GREEN};
    padding: 0 ${Grid(3)};
    height: 40px;
  `,

  HeadCell: styled.div`
    ${({ flex }) => flex ? `flex: ${flex};` : ''}
    ${({ width }) => width ? `width: ${width}px; flex-shrink: 0;` : ''}
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #fff;
    ${({ center }) => center ? 'text-align: center; justify-content: center;' : ''}
    padding-right: ${Grid(2)};
    display: flex;
    align-items: center;
  `,

  // ── Rows ──────────────────────────────────────────────────────────────────
  GovernanceBlock: styled.div`
    border-bottom: ${({ isLast }) => isLast ? 'none' : `1px solid ${BORDER}`};
  `,

  GovRow: styled.div`
    display: flex;
    align-items: center;
    padding: 0 ${Grid(3)};
    height: 46px;
    background: ${BG_GOV};
    border-bottom: 1px solid ${BORDER_LIGHT};
    transition: background 0.1s;
    &:hover { background: ${GREEN_LIGHT}; }
  `,

  CommiteeBlock: styled.div`
    border-bottom: 1px solid ${BORDER_LIGHT};
    &:last-child { border-bottom: none; }
  `,

  ComRow: styled.div`
    display: flex;
    align-items: center;
    padding: 0 ${Grid(3)};
    height: 40px;
    background: ${BG_COM};
    border-bottom: 1px solid ${BORDER_LIGHT};
    transition: background 0.1s;
    &:hover { background: #f5f5f5; }
  `,

  StatusRow: styled.div`
    display: flex;
    align-items: center;
    padding: 0 ${Grid(3)};
    height: 36px;
    background: #fff;
    border-bottom: 1px solid #fafafa;
    transition: background 0.1s;
    &:hover { background: #fdfdfd; }
  `,

  InlineRow: styled.div`
    display: flex;
    align-items: center;
    padding: 0 ${Grid(3)};
    height: 46px;
    background: #fffbeb;
    border-top: 1px dashed #fcd34d;
    border-bottom: 1px dashed #fcd34d;
  `,

  // ── Cells ────────────────────────────────────────────────────────────────
  Cell: styled.div`
    ${({ flex }) => flex ? `flex: ${flex};` : ''}
    ${({ width }) => width ? `width: ${width}px; flex-shrink: 0;` : ''}
    display: flex;
    align-items: center;
    ${({ center }) => center ? 'justify-content: center;' : ''}
    padding-right: ${Grid(2)};
    min-width: 0;
    overflow: hidden;
  `,

  // ── Labels ────────────────────────────────────────────────────────────────
  GovLabel: styled.span`
    font-size: 13px;
    font-weight: 700;
    color: ${TEXT};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  ComLabel: styled.span`
    font-size: 13px;
    font-weight: 500;
    color: ${TEXT};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  StatusLabel: styled.span`
    font-size: 13px;
    color: ${TEXT};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  StatusDot: styled.div`
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-right: ${Grid(1.5)};
    background: ${({ isFinal }) => isFinal ? GREEN : '#d1d5db'};
  `,

  Chevron: styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-right: ${Grid(1)};
    font-size: ${({ small }) => small ? '8px' : '9px'};
    color: ${TEXT_MUTED};
    transition: transform 0.2s ease, color 0.1s;
    transform: ${({ isOpen }) => isOpen ? 'rotate(90deg)' : 'rotate(0deg)'};
    flex-shrink: 0;
    line-height: 1;
    &:hover { color: ${GREEN}; }
  `,

  Badge: styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    background: ${({ isFinal }) => isFinal ? GREEN_LIGHT : '#f3f4f6'};
    color: ${({ isFinal }) => isFinal ? GREEN_DARK : TEXT_MUTED};
    border: 1px solid ${({ isFinal }) => isFinal ? '#6ee7b7' : BORDER};
  `,

  // ── Actions ───────────────────────────────────────────────────────────────
  ActionGroup: styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
  `,

  Btn: styled.button`
    width: 26px;
    height: 26px;
    border-radius: 5px;
    border: 1px solid ${({ variant }) => {
      if (variant === 'danger')  return '#fca5a5';
      if (variant === 'edit')    return '#bfdbfe';
      if (variant === 'confirm') return '#86efac';
      return BORDER;
    }};
    background: ${({ variant }) => {
      if (variant === 'danger')  return DANGER_BG;
      if (variant === 'edit')    return EDIT_BG;
      if (variant === 'confirm') return CONFIRM_BG;
      return '#fff';
    }};
    color: ${({ variant }) => {
      if (variant === 'danger')  return DANGER;
      if (variant === 'edit')    return EDIT_COLOR;
      if (variant === 'confirm') return CONFIRM_CLR;
      return TEXT_MUTED;
    }};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    flex-shrink: 0;
    &:hover {
      transform: scale(1.08);
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
  `,

  // ── Inline edit ───────────────────────────────────────────────────────────
  InlineEditGroup: styled.div`
    display: flex;
    align-items: center;
    gap: ${Grid(1)};
    flex: 1;
    min-width: 0;
  `,

  InlineInput: styled.input`
    flex: 1;
    height: 30px;
    border: 1px solid #d1d5db;
    border-radius: 5px;
    padding: 0 ${Grid(2)};
    font-size: 13px;
    outline: none;
    box-sizing: border-box;
    background: #fff;
    min-width: 0;
    transition: border-color 0.15s, box-shadow 0.15s;
    &:focus {
      border-color: ${GREEN};
      box-shadow: 0 0 0 3px rgba(0,148,115,0.12);
    }
  `,

  CheckboxLabel: styled.label`
    display: flex;
    align-items: center;
    gap: ${Grid(1)};
    font-size: 12px;
    color: ${TEXT_MUTED};
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
    flex-shrink: 0;
  `,

  // ── Add inline button (same style as modal add button) ────────────────────
  AddInlineBtn: styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin: ${Grid(1.5)} ${Grid(3)};
    margin-left: ${({ comLevel }) => comLevel ? Grid(3) : Grid(9)};
    padding: ${Grid(1)} ${Grid(3)};
    background: white;
    color: ${TEXT_MUTED};
    border: 1px dashed ${BORDER};
    border-radius: 5px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    &:hover {
      color: ${GREEN};
      border-color: ${GREEN};
      background: ${GREEN_LIGHT};
    }
  `,

  // ── Misc ──────────────────────────────────────────────────────────────────
  EmptyState: styled.div`
    padding: ${Grid(10)};
    text-align: center;
    color: #9ca3af;
    font-size: 14px;
    font-style: italic;
  `,

  Loading: styled.div`
    padding: ${Grid(10)};
    text-align: center;
    color: ${TEXT_MUTED};
    font-size: 14px;
  `,
};
