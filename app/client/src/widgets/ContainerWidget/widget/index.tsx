import React from "react";

import {
  CONTAINER_GRID_PADDING,
  GridDefaults,
  MAIN_CONTAINER_WIDGET_ID,
  WIDGET_PADDING,
} from "constants/WidgetConstants";
import WidgetFactory, { DerivedPropertiesMap } from "utils/WidgetFactory";
import ContainerComponent, { ContainerStyle } from "../component";

import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";

import { ValidationTypes } from "constants/WidgetValidation";

import { compact, map, sortBy } from "lodash";
import WidgetsMultiSelectBox from "pages/Editor/WidgetsMultiSelectBox";

import {
  Alignment,
  LayoutDirection,
  Positioning,
  ResponsiveBehavior,
  Spacing,
} from "components/constants";
import {
  generatePositioningConfig,
  generateResponsiveBehaviorConfig,
} from "utils/layoutPropertiesUtils";
import { connect } from "react-redux";
import {
  addWrappers,
  removeWrappers,
  updateWrappers,
} from "actions/autoLayoutActions";

export class ContainerWidget extends BaseWidget<
  ContainerWidgetProps<WidgetProps>,
  ContainerWidgetState
> {
  constructor(props: ContainerWidgetProps<WidgetProps>) {
    super(props);
    this.state = {
      useAutoLayout: false,
      direction: LayoutDirection.Horizontal,
      isMobile: false,
    };
    this.renderChildWidget = this.renderChildWidget.bind(this);
  }

  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "General",
        children: [
          {
            helpText: "Controls the visibility of the widget",
            propertyName: "isVisible",
            label: "Visible",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "animateLoading",
            label: "Animate Loading",
            controlType: "SWITCH",
            helpText: "Controls the loading of the widget",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "Enables scrolling for content inside the widget",
            propertyName: "shouldScrollContents",
            label: "Scroll Contents",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
        ],
      },
      {
        sectionName: "Layout",
        children: [
          {
            helpText: "Position styles to be applied to the children",
            propertyName: "positioning",
            label: "Positioning",
            controlType: "DROP_DOWN",
            defaultValue: Positioning.Fixed,
            options: [
              { label: "Fixed", value: Positioning.Fixed },
              { label: "Horizontal stack", value: Positioning.Horizontal },
              { label: "Vertical stack", value: Positioning.Vertical },
            ],
            isJSConvertible: false,
            isBindProperty: true,
            isTriggerProperty: true,
            validation: { type: ValidationTypes.TEXT },
          },
          // ...getLayoutConfig(Alignment.Left, Spacing.None),
          // { ...generateResponsiveBehaviorConfig(ResponsiveBehavior.Fill) },
        ],
      },
      {
        sectionName: "Styles",
        children: [
          {
            helpText: "Use a html color name, HEX, RGB or RGBA value",
            placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
            propertyName: "backgroundColor",
            label: "Background Color",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "Use a html color name, HEX, RGB or RGBA value",
            placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
            propertyName: "borderColor",
            label: "Border Color",
            controlType: "COLOR_PICKER",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "Enter value for border width",
            propertyName: "borderWidth",
            label: "Border Width",
            placeholderText: "Enter value in px",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.NUMBER },
          },
          {
            propertyName: "borderRadius",
            label: "Border Radius",
            helpText:
              "Rounds the corners of the icon button's outer border edge",
            controlType: "BORDER_RADIUS_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "boxShadow",
            label: "Box Shadow",
            helpText:
              "Enables you to cast a drop shadow from the frame of the widget",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "General",
        children: [
          {
            helpText: "Controls the visibility of the widget",
            propertyName: "isVisible",
            label: "Visible",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "Enables scrolling for content inside the widget",
            propertyName: "shouldScrollContents",
            label: "Scroll Contents",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "animateLoading",
            label: "Animate Loading",
            controlType: "SWITCH",
            helpText: "Controls the loading of the widget",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          generatePositioningConfig(),
          { ...generateResponsiveBehaviorConfig(ResponsiveBehavior.Fill) },
        ],
      },
    ];
  }

  static getPropertyPaneStyleConfig() {
    return [
      {
        sectionName: "Color",
        children: [
          {
            helpText: "Use a html color name, HEX, RGB or RGBA value",
            placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
            propertyName: "backgroundColor",
            label: "Background Color",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "Use a html color name, HEX, RGB or RGBA value",
            placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
            propertyName: "borderColor",
            label: "Border Color",
            controlType: "COLOR_PICKER",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "Border and Shadow",
        children: [
          {
            helpText: "Enter value for border width",
            propertyName: "borderWidth",
            label: "Border Width",
            placeholderText: "Enter value in px",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.NUMBER },
          },
          {
            propertyName: "borderRadius",
            label: "Border Radius",
            helpText:
              "Rounds the corners of the icon button's outer border edge",
            controlType: "BORDER_RADIUS_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "boxShadow",
            label: "Box Shadow",
            helpText:
              "Enables you to cast a drop shadow from the frame of the widget",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {};
  }
  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }
  static getMetaPropertiesMap(): Record<string, any> {
    return {};
  }

  componentDidMount(): void {
    super.componentDidMount();
    this.updatePositioningInformation();
    this.checkIsMobile();
  }

  componentDidUpdate(prevProps: ContainerWidgetProps<any>): void {
    super.componentDidUpdate(prevProps);
    if (this.props.positioning !== prevProps.positioning) {
      this.updatePositioningInformation();
      this.updateWrappers(prevProps);
    }
  }

  checkIsMobile = (): void => {
    if (window.innerWidth < 767) this.setState({ isMobile: true });
  };

  updatePositioningInformation = (): void => {
    if (!this.props.positioning || this.props.positioning === Positioning.Fixed)
      this.setState({ useAutoLayout: false });
    else
      this.setState({
        useAutoLayout: true,
        direction:
          this.props.positioning === Positioning.Horizontal
            ? LayoutDirection.Horizontal
            : LayoutDirection.Vertical,
      });
  };

  updateWrappers = (prevProps: ContainerWidgetProps<any>): void => {
    if (this.props.positioning === Positioning.Fixed) {
      this.props.removeWrappers &&
        this.props.removeWrappers(this.props.widgetId);
    } else if (prevProps.positioning === Positioning.Fixed) {
      this.props.addWrappers &&
        this.props.addWrappers(
          this.props.widgetId,
          this.props.positioning === Positioning.Horizontal
            ? LayoutDirection.Horizontal
            : LayoutDirection.Vertical,
        );
    } else
      this.props.updateWrappers &&
        this.props.updateWrappers(
          this.props.widgetId,
          this.props.positioning === Positioning.Horizontal
            ? LayoutDirection.Horizontal
            : LayoutDirection.Vertical,
        );
  };

  getSnapSpaces = () => {
    const { componentWidth } = this.getComponentDimensions();
    console.log(`${this.props.widgetName}: ${componentWidth}`);
    // For all widgets inside a container, we remove both container padding as well as widget padding from component width
    let padding = (CONTAINER_GRID_PADDING + WIDGET_PADDING) * 2;
    if (
      this.props.widgetId === MAIN_CONTAINER_WIDGET_ID ||
      this.props.type === "CONTAINER_WIDGET"
    ) {
      //For MainContainer and any Container Widget padding doesn't exist coz there is already container padding.
      padding = CONTAINER_GRID_PADDING * 2;
    }
    if (this.props.noPad) {
      // Widgets like ListWidget choose to have no container padding so will only have widget padding
      padding = WIDGET_PADDING * 2;
    }
    let width = componentWidth;
    width -= padding;
    return {
      snapRowSpace: GridDefaults.DEFAULT_GRID_ROW_HEIGHT,
      snapColumnSpace: componentWidth
        ? width / GridDefaults.DEFAULT_GRID_COLUMNS
        : 0,
    };
  };

  renderChildWidget(childWidgetData: WidgetProps): React.ReactNode {
    const childWidget = { ...childWidgetData };

    const { componentHeight, componentWidth } = this.getComponentDimensions();

    childWidget.rightColumn = componentWidth;
    childWidget.bottomRow = this.props.shouldScrollContents
      ? childWidget.bottomRow
      : componentHeight;
    childWidget.minHeight = componentHeight;
    childWidget.shouldScrollContents = false;
    childWidget.canExtend = this.props.shouldScrollContents;

    childWidget.parentId = this.props.widgetId;
    // Pass layout controls to children
    childWidget.useAutoLayout = this.state.useAutoLayout;
    childWidget.direction = this.state.direction;
    childWidget.positioning = this.props.positioning;
    childWidget.alignment = this.props.alignment;
    childWidget.spacing = this.props.spacing;

    return WidgetFactory.createWidget(childWidget, this.props.renderMode);
  }

  renderChildren = () => {
    return map(
      // sort by row so stacking context is correct
      // TODO(abhinav): This is hacky. The stacking context should increase for widgets rendered top to bottom, always.
      // Figure out a way in which the stacking context is consistent.
      this.state.useAutoLayout
        ? this.props.children
        : sortBy(compact(this.props.children), (child) => child.topRow),
      this.renderChildWidget,
    );
  };

  renderAsContainerComponent(props: ContainerWidgetProps<WidgetProps>) {
    // console.log(`${props.widgetName} : ${props.widgetId} =======`);
    // console.log(props);
    return (
      <ContainerComponent {...props}>
        <WidgetsMultiSelectBox
          {...this.getSnapSpaces()}
          noContainerOffset={!!props.noContainerOffset}
          widgetId={this.props.widgetId}
          widgetType={this.props.type}
        />
        {/* without the wrapping div onClick events are triggered twice */}
        <>{this.renderChildren()}</>
      </ContainerComponent>
    );
  }

  getPageView() {
    return this.renderAsContainerComponent(this.props);
  }

  static getWidgetType(): string {
    return "CONTAINER_WIDGET";
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  removeWrappers: (id: string) => dispatch(removeWrappers(id)),
  addWrappers: (id: string, direction: LayoutDirection) =>
    dispatch(addWrappers(id, direction)),
  updateWrappers: (id: string, direction: LayoutDirection) =>
    dispatch(updateWrappers(id, direction)),
});

export interface ContainerWidgetProps<T extends WidgetProps>
  extends WidgetProps {
  children?: T[];
  containerStyle?: ContainerStyle;
  shouldScrollContents?: boolean;
  noPad?: boolean;
  positioning?: Positioning;
  alignment?: Alignment;
  spacing?: Spacing;
  removeWrappers?: (id: string) => void;
  addWrappers?: (id: string, direction: LayoutDirection) => void;
  updateWrappers?: (id: string, direction: LayoutDirection) => void;
}

export interface ContainerWidgetState extends WidgetState {
  useAutoLayout: boolean;
  direction: LayoutDirection;
  isMobile: boolean;
}

export default connect(null, mapDispatchToProps)(ContainerWidget);
// export default ContainerWidget;
