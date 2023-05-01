import React from "react";
import { Button, Text } from "design-system";
import type { AppState } from "@appsmith/reducers";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { INTEGRATION_EDITOR_MODES, INTEGRATION_TABS } from "constants/routes";
import history from "utils/history";
import AnalyticsUtil from "utils/AnalyticsUtil";
import type { WidgetType } from "constants/WidgetConstants";
import { integrationEditorURL } from "RouteBuilder";
import { getCurrentPageId } from "selectors/editorSelectors";
import { DocsLink, openDoc } from "../../../constants/DocumentationLinks";

const Container = styled.div`
  height: 75px;
  padding: var(--ads-v2-spaces-3) var(--ads-v2-spaces-3);
  margin: var(--ads-v2-spaces-2) var(--ads-v2-spaces-4);
  display: flex;
  flex-direction: column;
  gap: var(--ads-v2-spaces-3);
  background-color: var(--ads-v2-color-bg-muted);
  border-radius: var(--ads-v2-border-radius);
`;

export const actionsExist = (state: AppState): boolean =>
  !!state.entities.actions.length;

type ConnectDataCTAProps = {
  widgetTitle: string;
  widgetId?: string;
  widgetType?: WidgetType;
};

function ConnectDataCTA(props: ConnectDataCTAProps) {
  const pageId: string = useSelector(getCurrentPageId);

  const onClick = () => {
    const { widgetId, widgetTitle, widgetType } = props;
    history.push(
      integrationEditorURL({
        pageId,
        selectedTab: INTEGRATION_TABS.NEW,
        params: { mode: INTEGRATION_EDITOR_MODES.AUTO },
      }),
    );
    AnalyticsUtil.logEvent("CONNECT_DATA_CLICK", {
      widgetTitle,
      widgetId,
      widgetType,
    });
  };

  return (
    <Container className="flex flex-col t--propertypane-connect-cta">
      <Text kind="heading-xs">Data required</Text>
      <div className="flex gap-3">
        <Button onClick={onClick} tabIndex={0}>
          Connect data
        </Button>
        <Button
          kind="secondary"
          onClick={() => openDoc(DocsLink.CONNECT_DATA)}
          tabIndex={0}
        >
          Learn more
        </Button>
      </div>
    </Container>
  );
}

export default React.memo(ConnectDataCTA);
