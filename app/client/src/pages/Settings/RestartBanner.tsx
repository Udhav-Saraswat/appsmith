import React from "react";
import { hexToRgba } from "design-system-old";
import { Button, Spinner } from "design-system";
import {
  getIsRestartFailed,
  getRestartingState,
} from "selectors/settingsSelectors";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  createMessage,
  RETRY_BUTTON,
  RESTART_BANNER_BODY,
  RESTART_BANNER_HEADER,
  RESTART_ERROR_BODY,
  RESTART_ERROR_HEADER,
} from "@appsmith/constants/messages";
import { Colors } from "constants/Colors";
import { Icon } from "design-system";
import { retryServerRestart } from "@appsmith/actions/settingsAction";
import { useDispatch } from "react-redux";

const RestartBannerWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 20;
  overflow: auto;
`;

const OverlayBackdrop = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  /* to be replaced: Albin */
  background-color: ${hexToRgba(Colors.COD_GRAY, 0.7)};
  overflow: auto;
  pointer-events: none;
  user-select: none;
  z-index: 20;
`;

const RestartContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${(props) => props.theme.settings.footerHeight}px;
  z-index: 20;
  padding: 0px ${(props) => props.theme.spaces[11]}px 0px 276px;
  background: var(--appsmith-color-black-0);
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: all;
  user-select: text;
`;

const RestartMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
`;

const HeaderContents = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: ${(props) => props.theme.spaces[3]}px;
  gap: 8px;
`;

const Heading = styled.span`
  color: ${(props) => props.theme.colors.modal.headerText};
  font-weight: ${(props) => props.theme.typography.h1.fontWeight};
  font-size: ${(props) => props.theme.typography.h1.fontSize}px;
  line-height: ${(props) => props.theme.typography.h1.lineHeight}px;
  letter-spacing: ${(props) => props.theme.typography.h1.letterSpacing};
  text-transform: capitalize;
`;

const AppIconWrapper = styled.div`
  background: var(--appsmith-color-red-50);
  border-radius: 50%;
  padding: 4px;
  margin-right: 12px;

  svg {
    width: 18px;
    height: 18px;

    path {
      fill: var(--appsmith-color-red-500);
    }
  }
`;

const RestartMessage = styled.p``;

function Header() {
  const isRestartFailed = useSelector(getIsRestartFailed);
  return (
    <HeaderContents>
      {isRestartFailed ? (
        <AppIconWrapper>
          <Icon name="server-line" />
        </AppIconWrapper>
      ) : (
        <Spinner
          iconProps={{ color: "var(--ads-v2-color-orange-500)" }}
          size="lg"
        />
      )}
      <Heading>
        {isRestartFailed
          ? createMessage(RESTART_ERROR_HEADER)
          : createMessage(RESTART_BANNER_HEADER)}
      </Heading>
    </HeaderContents>
  );
}

export default function RestartBanner() {
  const isRestartFailed = useSelector(getIsRestartFailed);
  const isRestarting = useSelector(getRestartingState);
  const dispatch = useDispatch();
  return isRestarting ? (
    <RestartBannerWrapper className="t--admin-settings-restart-notice">
      <OverlayBackdrop />
      <RestartContainer>
        <RestartMessageWrapper>
          <Header />
          <RestartMessage>
            {isRestartFailed
              ? createMessage(RESTART_ERROR_BODY)
              : createMessage(RESTART_BANNER_BODY)}
          </RestartMessage>
        </RestartMessageWrapper>
        {isRestartFailed && (
          <Button
            data-cy="btn-refresh"
            onClick={() => dispatch(retryServerRestart())}
            size="md"
          >
            {createMessage(RETRY_BUTTON)}
          </Button>
        )}
      </RestartContainer>
    </RestartBannerWrapper>
  ) : null;
}
