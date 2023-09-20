import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { Button, ButtonWhite } from "./Button";

const ModalContainer = styled.div<{ width: string; height: string }>`
  position: fixed;
  display: flex;
  flex-direction: column;
  left: calc(50vw - ${(props) => props.width}px / 2);
  top: calc(50vh - ${(props) => props.height}px / 2);
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  padding: 30px;
  background-color: ${(props) => props.theme.body};
  border: #ed234b 1px solid;
  border-radius: 8px;
  z-index: 200;
  text-align: center;
  .modal__close-btn {
    position: absolute;
    top: 30px;
    right: 30px;
    padding: 12px;
    background-color: ${(props) => props.theme.body};
    color: ${(props) => props.theme.text};
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 50;
`;

const ModalWrapper = styled.div`
  background-color: transparent;
`;

interface Props {
  width: string;
  height: string;
  element: JSX.Element;
  setModal: Dispatch<SetStateAction<boolean>>;
}

export const Modal = ({ width, height, element, setModal }: Props) => {
  const disableModal = () => {
    setModal(false);
  };
  return (
    <>
      <ModalContainer width={width} height={height}>
        <ModalWrapper>{element}</ModalWrapper>
        <button className="btn modal__close-btn">X</button>
      </ModalContainer>
      <ModalBackground onClick={disableModal} />
    </>
  );
};