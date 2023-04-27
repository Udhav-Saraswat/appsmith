import reconnectDatasourceModal from "../../../../locators/ReconnectLocators";
import { ObjectsRegistry } from "../../../../support/Objects/Registry";

const apiwidget = require("../../../../locators/apiWidgetslocator.json");
const queryLocators = require("../../../../locators/QueryEditor.json");

const homePage = ObjectsRegistry.HomePage;
const agHelper = ObjectsRegistry.AggregateHelper;
const dataSources = ObjectsRegistry.DataSources;
const ee = ObjectsRegistry.EntityExplorer;
const apiPage = ObjectsRegistry.ApiPage;
const locators = ObjectsRegistry.CommonLocators;

describe("MaintainContext&Focus", function () {
  before("Import the test application", () => {
    homePage.NavigateToHome();
    cy.intercept("GET", "/api/v1/users/features", {
      fixture: "featureFlags.json",
    }).as("featureFlags");
    cy.reload();
    homePage.ImportApp("ContextSwitching.json");
    cy.wait("@importNewApplication").then((interception) => {
      agHelper.Sleep();
      const { isPartialImport } = interception.response.body.data;
      if (isPartialImport) {
        // should reconnect modal
        cy.get(reconnectDatasourceModal.SkipToAppBtn).click({
          force: true,
        });
        cy.wait(2000);
      } else {
        homePage.AssertImportToast();
      }
    });
  });

  it("1. Focus on different entities", () => {
    cy.CheckAndUnfoldEntityItem("Queries/JS");

    cy.SearchEntityandOpen("Text1");
    cy.focusCodeInput(".t--property-control-text", { ch: 2, line: 0 });

    cy.SearchEntityandOpen("Graphql_Query");
    cy.focusCodeInput(".t--graphql-query-editor", { ch: 4, line: 1 });

    cy.SearchEntityandOpen("Rest_Api_1");
    cy.wait(1000);
    cy.get('[data-cy="t--tab-PARAMS"]').click();
    cy.focusCodeInput(apiwidget.queryKey);
    cy.wait("@saveAction");

    cy.SearchEntityandOpen("Rest_Api_2");
    cy.wait(1000);
    cy.contains(".react-tabs__tab", "Headers").click();
    cy.updateCodeInput(apiwidget.headerValue, "test");
    cy.wait("@saveAction");

    cy.SearchEntityandOpen("SQL_Query");
    cy.wait(1000);
    cy.focusCodeInput(".t--actionConfiguration\\.body", { ch: 5, line: 0 });
    cy.wait("@saveAction");

    cy.SearchEntityandOpen("S3_Query");
    cy.wait(1000);
    cy.focusCodeInput(".t--actionConfiguration\\.formData\\.bucket\\.data", {
      ch: 2,
      line: 0,
    });
    cy.wait(1000);
    cy.wait("@saveAction");

    cy.SearchEntityandOpen("JSObject1");
    cy.wait(1000);
    cy.focusCodeInput(".js-editor", { ch: 4, line: 4 });
    cy.wait("@saveAction");

    cy.SearchEntityandOpen("JSObject2");
    cy.wait(1000);
    cy.focusCodeInput(".js-editor", { ch: 2, line: 2 });

    cy.SearchEntityandOpen("Mongo_Query");
    cy.wait(1000);
    cy.updateCodeInput(
      ".t--actionConfiguration\\.formData\\.collection\\.data",
      "TestCollection",
    );
    cy.wait("@saveAction");
  });

  it("2. Maintains focus on property/Api/Query/Js Pane", () => {
    //Maintains focus on the property pane
    cy.get(`.t--entity-name:contains("Page1")`).click();

    cy.get(".t--widget-name").should("have.text", "Text1");
    cy.assertSoftFocusOnCodeInput(".t--property-control-text", {
      ch: 2,
      line: 0,
    });

    //Maintains focus on the API pane
    cy.SearchEntityandOpen("Graphql_Query");
    cy.contains(".react-tabs__tab", "Body").should(
      "have.class",
      "react-tabs__tab--selected",
    );
    cy.assertCursorOnCodeInput(".t--graphql-query-editor", { ch: 4, line: 1 });

    cy.SearchEntityandOpen("Rest_Api_1");
    cy.assertCursorOnCodeInput(apiwidget.queryKey);

    cy.SearchEntityandOpen("Rest_Api_2");
    cy.contains(".react-tabs__tab", "Headers").should(
      "have.class",
      "react-tabs__tab--selected",
    );
    cy.assertCursorOnCodeInput(apiwidget.headerValue);

    //Maintains focus on Query panes
    cy.SearchEntityandOpen("SQL_Query");
    cy.assertCursorOnCodeInput(".t--actionConfiguration\\.body", {
      ch: 5,
      line: 0,
    });

    cy.SearchEntityandOpen("S3_Query");
    cy.assertCursorOnCodeInput(
      ".t--actionConfiguration\\.formData\\.bucket\\.data",
      { ch: 2, line: 0 },
    );
    cy.SearchEntityandOpen("Mongo_Query");
    cy.assertCursorOnCodeInput(
      ".t--actionConfiguration\\.formData\\.collection\\.data",
    );

    //Maintains focus on JS Objects
    cy.SearchEntityandOpen("JSObject1");
    cy.assertCursorOnCodeInput(".js-editor", { ch: 2, line: 4 });

    cy.SearchEntityandOpen("JSObject2");
    cy.assertCursorOnCodeInput(".js-editor", { ch: 2, line: 2 });
  });

  it("3. Check if selected tab on right tab persists", () => {
    ee.SelectEntityByName("Rest_Api_1", "Queries/JS");
    apiPage.SelectRightPaneTab("connections");
    ee.SelectEntityByName("SQL_Query");
    ee.SelectEntityByName("Rest_Api_1");
    apiPage.AssertRightPaneSelectedTab("connections");

    //Check if the URL is persisted while switching pages
    cy.Createpage("Page2");

    ee.SelectEntityByName("Page1", "Pages");
    ee.SelectEntityByName("Rest_Api_1", "Queries/JS");

    ee.SelectEntityByName("Page2", "Pages");
    cy.dragAndDropToCanvas("textwidget", { x: 300, y: 200 });

    ee.SelectEntityByName("Page1", "Pages");
    cy.get(".t--nameOfApi .bp3-editable-text-content").should(
      "contain",
      "Rest_Api_1",
    );
  });

  it("4. Datasource edit mode has to be maintained", () => {
    ee.SelectEntityByName("Appsmith", "Datasources");
    dataSources.EditDatasource();
    dataSources.ExpandSection(0);
    agHelper.GoBack();
    ee.SelectEntityByName("Github", "Datasources");
    dataSources.AssertDSEditViewMode("View");
    ee.SelectEntityByName("Appsmith", "Datasources");
    dataSources.AssertDSEditViewMode("Edit");
    dataSources.AssertSectionCollapseState(0, false);
  });

  it("5. Maintain focus of form control inputs", () => {
    ee.SelectEntityByName("SQL_Query");
    dataSources.ToggleUsePreparedStatement(false);
    cy.SearchEntityandOpen("S3_Query");
    cy.get(queryLocators.querySettingsTab).click();
    cy.setQueryTimeout(10000);

    cy.SearchEntityandOpen("SQL_Query");
    cy.get(".bp3-editable-text-content").should("contain.text", "SQL_Query");
    cy.get(".t--form-control-SWITCH input").should("be.focused");
    cy.SearchEntityandOpen("S3_Query");
    agHelper.Sleep();
    agHelper.GetNClick(dataSources._queryResponse("SETTINGS"));
    cy.xpath(queryLocators.queryTimeout).should("be.focused");
  });

  it("6. Bug 21999 Maintain focus of code editor when Escape is pressed with autcomplete open", () => {
    cy.SearchEntityandOpen("JSObject1");
    cy.assertCursorOnCodeInput(".js-editor", { ch: 2, line: 4 });
    cy.get(locators._codeMirrorTextArea).type("showA");
    agHelper.GetNAssertElementText(locators._hints, "showAlert()");
    agHelper.PressEscape();
    cy.assertCursorOnCodeInput(".js-editor", { ch: 7, line: 4 });
  });
});
