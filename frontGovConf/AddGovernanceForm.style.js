// @flow

import styled from 'styled-components';
import { Grid } from 'styles';

export default {
  Section: styled.div`
    margin-bottom: ${Grid(4)};
  `,

  Label: styled.label`
    display: block;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: ${Grid(1)};
    color: #333;
  `,

  Input: styled.input`
    width: 100%;
    height: 40px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 0 ${Grid(2)};
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
    &:focus {
      border-color: #009473;
    }
  `,

  StatusInput: styled.input`
    flex: 1;
    height: 36px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 0 ${Grid(2)};
    font-size: 13px;
    outline: none;
    box-sizing: border-box;
    &:focus {
      border-color: #009473;
    }
  `,

  ErrorText: styled.span`
    color: #e53935;
    font-size: 11px;
    margin-top: ${Grid(0.5)};
    display: block;
  `,

  TableHeader: styled.div`
    display: flex;
    align-items: center;
    background-color: #1a3c5e;
    color: white;
    padding: ${Grid(2)} ${Grid(3)};
    border-radius: 4px 4px 0 0;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 0;
  `,

  ColHeader: styled.div`
    padding: 0 ${Grid(1)};
  `,

  CommiteeBlock: styled.div`
    border: 1px solid #e8e8e8;
    border-top: none;
    &:last-of-type {
      border-radius: 0 0 4px 4px;
    }
  `,

  CommiteeRow: styled.div`
    display: flex;
    align-items: flex-start;
    padding: ${Grid(2)} ${Grid(3)};
    gap: ${Grid(2)};
    border-bottom: 1px solid #f0f0f0;
  `,

  CommiteeNameCell: styled.div`
    flex: 2;
    padding-right: ${Grid(2)};
  `,

  StatusesCell: styled.div`
    flex: 4;
    display: flex;
    flex-direction: column;
    gap: ${Grid(1)};
  `,

  StatusRow: styled.div`
    display: flex;
    align-items: center;
    gap: ${Grid(2)};
  `,

  FinalStatusCheckbox: styled.label`
    display: flex;
    align-items: center;
    gap: ${Grid(1)};
    font-size: 13px;
    color: #555;
    white-space: nowrap;
    cursor: pointer;
    min-width: 60px;
  `,

  RemoveButton: styled.button`
    width: 28px;
    height: 28px;
    border: 1px solid #cccccc;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    &:hover {
      background: #ffeaea;
      border-color: #e53935;
      color: #e53935;
    }
  `,

  RemoveCommiteeButton: styled.button`
    width: 28px;
    height: 28px;
    border: 1px solid #cccccc;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: ${Grid(1)};
    &:hover {
      background: #ffeaea;
      border-color: #e53935;
      color: #e53935;
    }
  `,

  AddStatusButton: styled.button`
    align-self: flex-start;
    min-width: ${Grid(18)};
    padding: ${Grid(1)} ${Grid(2)};
    border: 1px dashed #009473;
    background: white;
    color: #009473;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    margin-top: ${Grid(1)};
    &:hover {
      background: #f0faf7;
    }
  `,

  ActionsRow: styled.div`
    display: flex;
    justify-content: flex-start;
    margin-top: ${Grid(3)};
  `,

  AddLineButton: styled.button`
    min-width: ${Grid(22)};
    padding: ${Grid(2)} ${Grid(3)};
    border: 1px solid #cccccc;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    &:hover {
      background: #f5f5f5;
    }
  `,
};
