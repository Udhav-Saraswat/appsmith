import React from "react";
import { useHistory } from "react-router-dom";
import { SettingCategories } from "../types";
import styled from "styled-components";
import {
  ENABLE,
  ADMIN_AUTH_SETTINGS_SUBTITLE,
  ADMIN_AUTH_SETTINGS_TITLE,
  createMessage,
  EDIT,
  UPGRADE,
  UPGRADE_TO_EE,
  AUTHENTICATION_METHOD_ENABLED,
} from "@appsmith/constants/messages";
import { Button, Callout, Icon, Tag, Text, Tooltip } from "design-system";
import { adminSettingsCategoryUrl } from "RouteBuilder";
import AnalyticsUtil from "utils/AnalyticsUtil";
import useOnUpgrade from "utils/hooks/useOnUpgrade";

export const Wrapper = styled.div`
  flex-basis: calc(100% - ${(props) => props.theme.homePage.leftPane.width}px);
  padding: 40px 0 0 24px;
  height: calc(100vh - ${(props) => props.theme.homePage.header}px);
  overflow: auto;
`;

export const SettingsFormWrapper = styled.div``;

export const SettingsHeader = styled(Text)`
  text-transform: capitalize;
`;

export const SettingsSubHeader = styled(Text)``;

const MethodCard = styled.div`
  display: flex;
  align-items: center;
  margin: 32px 0;
`;

const Image = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 8px;
  background: var(--ads-v2-color-black-75);
  object-fit: cover;
  border-radius: 50%;
  padding: 5px;
  align-self: baseline;
`;

const MethodDetailsWrapper = styled.div`
  color: #2e3d49;
  width: 492px;
  margin-right: 60px;
`;

const MethodTitle = styled(Text)`
  display: flex;
  align-items: center;
  margin: 0 0 4px;

  svg {
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
`;

const MethodDets = styled(Text)``;

export type banner = {
  actionLabel: string;
  title: string;
};

export type AuthMethodType = {
  id: string;
  category?: string;
  label: string;
  subText?: string;
  image?: any;
  needsUpgrade?: boolean;
  isConnected?: boolean;
  calloutBanner?: banner;
};

const Label = styled(Tag)<{ business?: boolean }>`
  ${(props) =>
    props.business &&
    `
    color: var(--ads-v2-color-fg);
  `};
`;

const StyledButton = styled(Button)`
  width: 100px;
`;

export function ActionButton({ method }: { method: AuthMethodType }) {
  const history = useHistory();
  const { onUpgrade } = useOnUpgrade({
    logEventName: "ADMIN_SETTINGS_UPGRADE_AUTH_METHOD",
    logEventData: { method: method.label },
    intercomMessage: createMessage(UPGRADE_TO_EE, method.label),
  });

  const onClickHandler = (method: AuthMethodType) => {
    if (!method.needsUpgrade || method.isConnected) {
      AnalyticsUtil.logEvent(
        method.isConnected
          ? "ADMIN_SETTINGS_EDIT_AUTH_METHOD"
          : "ADMIN_SETTINGS_ENABLE_AUTH_METHOD",
        {
          method: method.label,
        },
      );
      history.push(
        adminSettingsCategoryUrl({
          category: SettingCategories.AUTHENTICATION,
          selected: method.category,
        }),
      );
    } else {
      onUpgrade();
    }
  };

  return (
    <StyledButton
      className={`t--settings-sub-category-${
        method.needsUpgrade ? `upgrade-${method.category}` : method.category
      }`}
      data-cy="btn-auth-account"
      kind={method.isConnected ? "primary" : "secondary"}
      onClick={() => onClickHandler(method)}
      size="sm"
    >
      {createMessage(
        method.isConnected ? EDIT : !!method.needsUpgrade ? UPGRADE : ENABLE,
      )}
    </StyledButton>
  );
}

export function AuthPage({ authMethods }: { authMethods: AuthMethodType[] }) {
  return (
    <Wrapper>
      <SettingsFormWrapper>
        <SettingsHeader
          color="var(--ads-v2-color-fg-emphasis-plus)"
          kind="heading-l"
          renderAs="h2"
        >
          {createMessage(ADMIN_AUTH_SETTINGS_TITLE)}
        </SettingsHeader>
        <SettingsSubHeader color="var(--ads-v2-color-fg-emphasis)" renderAs="p">
          {createMessage(ADMIN_AUTH_SETTINGS_SUBTITLE)}
        </SettingsSubHeader>
        {authMethods &&
          authMethods.map((method) => {
            return (
              <MethodCard key={method.id}>
                <Image alt={method.label} src={method.image} />
                <MethodDetailsWrapper>
                  <MethodTitle
                    color="var(--ads-v2-color-fg)"
                    kind="heading-s"
                    renderAs="p"
                  >
                    {method.label}&nbsp;
                    {method.needsUpgrade && (
                      <>
                        <Label business isClosable={false}>
                          Business
                        </Label>
                        &nbsp;
                      </>
                    )}
                    {method.isConnected && (
                      <Tooltip
                        content={createMessage(
                          AUTHENTICATION_METHOD_ENABLED,
                          method.label,
                        )}
                        placement="right"
                      >
                        <Icon
                          className={`${method.category}-green-check`}
                          color="var(--ads-old-color-jade)"
                          name="oval-check"
                        />
                      </Tooltip>
                    )}
                  </MethodTitle>
                  <MethodDets
                    color="var(--ads-v2-color-fg)"
                    kind="body-s"
                    renderAs="p"
                  >
                    {method.subText}
                  </MethodDets>
                  {method.calloutBanner && (
                    <Callout
                      kind="info"
                      links={[
                        {
                          children: method.calloutBanner.actionLabel,
                          to: "",
                        },
                      ]}
                    >
                      {method.calloutBanner.title}
                    </Callout>
                  )}
                </MethodDetailsWrapper>
                <ActionButton method={method} />
              </MethodCard>
            );
          })}
      </SettingsFormWrapper>
    </Wrapper>
  );
}
