import React from "react";
import styled from "styled-components";
import { createMessage, SNIPPET_TOOLTIP } from "@appsmith/constants/messages";
import { Button, Tooltip } from "design-system";

export enum ENTITY_TYPE {
  ACTION = "ACTION",
  WIDGET = "WIDGET",
  APPSMITH = "APPSMITH",
  JSACTION = "JSACTION",
}

type Props = {
  className?: string;
  entityId?: string;
  entityType: ENTITY_TYPE;
  // TODO: be more precise with the function type
  onClick: any;
  showIconOnly?: boolean;
};

const StyledButton = styled(Button)`
  padding: 0 10px;
  margin-left: 16px;
`;

export default function SearchSnippets(props: Props) {
  const className = props.className || "";
  const handleClick = props.onClick;

  return props.showIconOnly ? (
    <Button
      isIconButton
      kind="tertiary"
      onClick={handleClick}
      size="md"
      startIcon="snippet"
    />
  ) : (
    <Tooltip content={createMessage(SNIPPET_TOOLTIP)} placement="bottomRight">
      <StyledButton
        className={`t--search-snippets ${className}`}
        kind="secondary"
        onClick={handleClick}
        size="md"
        startIcon="snippet"
      >
        Snippets
      </StyledButton>
    </Tooltip>
  );
}
