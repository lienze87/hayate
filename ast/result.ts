const OptionId  = ['string','number']
const OptionName  = ['string','number']
const ZRColor  = ['string']
const ZRLineType  = ['solid','dotted','dashed','number','number[]']
const TextAlign  = ['left','center','right']
const TextVerticalAlign  = ['top','middle','bottom']

const ZRTextAlign  = ['TextAlign']
const ZRTextVerticalAlign  = ['TextVerticalAlign']

const ComponentOption = {
  mainType: { type: 'string', required: false},
  type: { type: 'string', required: false},
  id: { type: 'OptionId', required: false},
  name: { type: 'OptionName', required: false},
  z: { type: 'number', required: false},
  zlevel: { type: 'number', required: false},
}

const BorderOptionMixin = {
  borderColor: { type: 'ZRColor', required: false},
  borderWidth: { type: 'number', required: false},
  borderType: { type: 'ZRLineType', required: false},
  borderCap: { type: 'CanvasLineCap', required: false},
  borderJoin: { type: 'CanvasLineJoin', required: false},
  borderDashOffset: { type: 'number', required: false},
  borderMiterLimit: { type: 'number', required: false},
}

const BoxLayoutOptionMixin = {
  width: { type: 'number,string', required: false},
  height: { type: 'number,string', required: false},
  top: { type: 'number,string', required: false},
  right: { type: 'number,string', required: false},
  bottom: { type: 'number,string', required: false},
  left: { type: 'number,string', required: false},
}

const TitleOption
  extends ComponentOption,
    BoxLayoutOptionMixin,
    BorderOptionMixin {
  mainType: { type: 'title', required: false},
  show: { type: 'boolean', required: false},
  text: { type: 'string', required: false},
  /**
   * Link to url
   */
  link: { type: 'string', required: false},
  target: { type: 'self,blank', required: false},
  subtext: { type: 'string', required: false},
  sublink: { type: 'string', required: false},
  subtarget: { type: 'self,blank', required: false},
  textAlign: { type: 'ZRTextAlign', required: false},
  textVerticalAlign: { type: 'ZRTextVerticalAlign', required: false},
  /**
   * @deprecated Use textVerticalAlign instead
   */
  textBaseline: { type: 'ZRTextVerticalAlign', required: false},
  backgroundColor: { type: 'ZRColor', required: false},
  /**
   * Padding between text and border.
   * Support to be a single number or an array.
   */
  padding: { type: 'number,number[]', required: false},
  /**
   * Gap between text and subtext
   */
  itemGap: { type: 'number', required: false},
  textStyle: { type: 'string', required: false},
  subtextStyle: { type: 'string', required: false},
  /**
   * If trigger mouse or touch event
   */
  triggerEvent: { type: 'boolean', required: false},
  /**
   * Radius of background border.
   */
  borderRadius: { type: 'number,number[]', required: false},
}
