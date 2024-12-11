import React from "react";
import { StyledBurgerButton } from "./navbar.styles";

interface BurgerButtonProps {
  collapsed: boolean;
  setCollapsed: () => void;
}

export const BurguerButton = ({ collapsed, setCollapsed }: BurgerButtonProps) => {
  return (
    <div
      className={StyledBurgerButton()}
      onClick={setCollapsed}
    >
      <div />
      <div />
    </div>
  );
};
