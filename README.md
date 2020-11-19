# React Group Video Chat

Author: Dave Huang  
Email: bugman195.work@gmail.com

## Reqirements

### Basics

- [x] 实现官方案例中的基础功能，包括参数设置，join、leave、publish、unpublish 行为。
- [x] 实现一对一的视频通话功能。
- [x] 使用自己最擅长的框架（ React 或者 Vue）渲染视图，使用状态来控制和驱动行为。
- [x] 使用 Promise 或 async/await 简化异步逻辑。

### Bonus

- [x] 支持 Stream 的播放/mute/unmute。
- [x] 使用 Typescript。
- [x] 支持多人视频通话。
- [x] UI 可以使用第三方组件库（SCSS）。
- [x] 使用 redux, mobx 等状态管理工具。
- [x] 完善地各个步骤的错误处理。
- [ ] 测试等其他额外加分内容。

## How to run

In the project directory, run:

1. `yarn install`

2. `yarn start`

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

4. Enter the **appId**, **temp token** and **channel name** set from Agora.io project console.

## Result Screenshot

### Landing page

![](./src/res/demo1.jpg)

### Chat room page

![](./src/res/demo2.jpg)

## Project Planning

- Go through document and resources
- Design simple prototype  
  <img src="./src/res/prototype.png" alt="prototype" width="450">
- Go through all the client init flow
- Establish local stream and show UI
- Handle remote stream event handlings
- Add remote streams' UI
- Handle mute function
- Fine tune CSS
