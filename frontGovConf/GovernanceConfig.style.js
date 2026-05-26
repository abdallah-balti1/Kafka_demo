// @flow

import styled from 'styled-components';
import { Grid } from 'styles';

export default {
  Container: styled.div`
    width: 100%;
    padding: ${Grid(4)};
  `,

  Header: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${Grid(4)};
  `,

  Title: styled.h2`
    font-size: 16px;
    font-weight: 700;
    color: #1a3c5e;
    margin: 0;
    letter-spacing: 0.5px;
  `,

  AddButton: styled.button`
    padding: ${Grid(2)} ${Grid(4)};
    background-color: #009473;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      background-color: #007a5e;
    }
  `,

  TableHeader: styled.div`
    display: flex;
    align-items: center;
    background-color: #1a3c5e;
    color: white;
    padding: ${Grid(2)} ${Grid(3)};
    font-size: 13px;
    font-weight: 600;
    border-radius: 4px 4px 0 0;
  `,

  ColGovernance: styled.div`
    flex: 2;
    display: flex;
    align-items: center;
    gap: ${Grid(1)};
    padding-right: ${Grid(2)};
  `,

  ColCommitee: styled.div`
    flex: 2;
    display: flex;
    align-items: center;
    padding-right: ${Grid(2)};
  `,

  ColStatus: styled.div`
    flex: 3;
    padding-right: ${Grid(2)};
  `,

  ColFinal: styled.div`
    flex: 1;
    min-width: 80px;
  `,

  ColActions: styled.div`
    width: 60px;
    display: flex;
    justify-content: flex-end;
    gap: ${Grid(1)};
  `,

  GovernanceBlock: styled.div`
    border: 1px solid #e8e8e8;
    border-top: none;
    &:last-child {
      border-radius: 0 0 4px 4px;
    }
  `,

  GovernanceRow: styled.div`
    display: flex;
    align-items: center;
    padding: ${Grid(2)} ${Grid(3)};
    background-color: #f5f5f5;
    cursor: pointer;
    &:hover {
      background-color: #eef7f4;
    }
  `,

  ToggleIcon: styled.span`
    display: inline-block;
    transition: transform 0.2s;
    transform: ${({ isOpen }) => (isOpen ? 'rotate(90deg)' : 'rotate(0)')};
    font-size: 10px;
    margin-right: ${Grid(1)};
    color: #1a3c5e;
  `,

  CommiteeBlock: styled.div`
    border-top: 1px solid #f0f0f0;
  `,

  StatusRow: styled.div`
    display: flex;
    align-items: center;
    padding: ${Grid(1.5)} ${Grid(3)};
    border-bottom: 1px solid #f5f5f5;
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: #fafafa;
    }
  `,

  Badge: styled.span`
    display: inline-block;
    padding: ${Grid(0.5)} ${Grid(2)};
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    background-color: ${({ isYes }) => (isYes ? '#e8f5e9' : '#fafafa')};
    color: ${({ isYes }) => (isYes ? '#2e7d32' : '#999')};
    border: 1px solid ${({ isYes }) => (isYes ? '#a5d6a7' : '#e0e0e0')};
  `,

  DeleteButton: styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    padding: ${Grid(0.5)};
    border-radius: 4px;
    opacity: 0.6;
    &:hover {
      opacity: 1;
      background-color: #ffeaea;
    }
  `,

  EmptyState: styled.div`
    padding: ${Grid(6)};
    text-align: center;
    color: #bbb;
    font-size: 14px;
    font-style: italic;
    border: 1px solid #e8e8e8;
    border-top: none;
  `,

  EmptyCommitee: styled.div`
    padding: ${Grid(2)} ${Grid(6)};
    color: #bbb;
    font-size: 13px;
    font-style: italic;
  `,

  Loading: styled.div`
    padding: ${Grid(8)};
    text-align: center;
    color: #999;
    font-size: 14px;
  `,
};
