declare type OptionId = string | number;
declare type OptionName = string | number;
declare type ZRColor = string;
declare type ZRLineType = "solid" | "dotted" | "dashed" | number | number[];
declare type TextAlign = "left" | "center" | "right";
declare type TextVerticalAlign = "top" | "middle" | "bottom";

declare type ZRTextAlign = TextAlign;
declare type ZRTextVerticalAlign = TextVerticalAlign;

interface ComponentOption {
  mainType?: string;
  type?: string;
  id?: OptionId;
  name?: OptionName;
  z?: number;
  zlevel?: number;
}

interface BorderOptionMixin {
  borderColor?: ZRColor;
  borderWidth?: number;
  borderType?: ZRLineType;
  borderCap?: CanvasLineCap;
  borderJoin?: CanvasLineJoin;
  borderDashOffset?: number;
  borderMiterLimit?: number;
}

interface BoxLayoutOptionMixin {
  width?: number | string;
  height?: number | string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
}

interface TitleOption
  extends ComponentOption,
    BoxLayoutOptionMixin,
    BorderOptionMixin {
  mainType?: "title";
  show?: boolean;
  text?: string;
  /**
   * Link to url
   */
  link?: string;
  target?: "self" | "blank";
  subtext?: string;
  sublink?: string;
  subtarget?: "self" | "blank";
  textAlign?: ZRTextAlign;
  textVerticalAlign?: ZRTextVerticalAlign;
  /**
   * @deprecated Use textVerticalAlign instead
   */
  textBaseline?: ZRTextVerticalAlign;
  backgroundColor?: ZRColor;
  /**
   * Padding between text and border.
   * Support to be a single number or an array.
   */
  padding?: number | number[];
  /**
   * Gap between text and subtext
   */
  itemGap?: number;
  textStyle?: string;
  subtextStyle?: string;
  /**
   * If trigger mouse or touch event
   */
  triggerEvent?: boolean;
  /**
   * Radius of background border.
   */
  borderRadius?: number | number[];
}
