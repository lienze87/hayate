# 内容导航栏组件

## 开发参考

- 每个模块内容**必须**使用 Anchor 组件包裹，Anchor 组件中生成 a 标签，用于标记模块位置和生成导航栏目录
- 内容导航栏组件只在大屏模式，即屏幕宽度大于**1680px**下显示，小屏时将自动隐藏

### 计算当前激活导航标题

- 注意第一个标题和最后一个一个标题的特殊处理
- 注意页面可能存在固定的头部占位元素，需减去其offsetTop
- HTMLElement.offsetTop 为只读属性，它返回当前元素相对于其 offsetParent 元素的顶部内边距的距离。
- 根据组件HTML结构，获取Anchor组件的父组件的offsetTop

### 计算滑动到指定元素的滚动距离

- Element.getBoundingClientRect() 方法返回一个 DOMRect 对象，其提供了元素的大小及其相对于视口的位置。
- Element.getBoundingClientRect().top + window.scrollY 即为元素显示在视口中时应滚动的距离。
- window.scrollTo({ top: y, behavior: "smooth" }); 窗口平滑滚动。
