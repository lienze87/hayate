# hayate

基于Vite+Vue3+Typescript的个人项目

# Pages

- [Echarts图表配置](./src/pages/charts/index.vue)
- [canvas绘制](./src/pages/board/index.vue)
- [视频截取](./src/pages/video/index.vue)
- [笔记](./src/pages/note/index.vue)

# 项目依赖

- [gasp](https://gsap.com/) (A wildly robust JavaScript animation library built for professionals)
- [Lenis](https://github.com/darkroomengineering/lenis) (Lenis is a lightweight, robust, and performant smooth scroll library)

# Server

使用Express+[Sequelize](https://sequelize.org/docs/v6/)(a promise-based Node.js ORM tool)+sqlite3构建

```bash
 cd .\server\
 yarn dev
```

## upload

#### 路由表

| Path               | Method | Describe                                         |
| ------------------ | ------ | ------------------------------------------------ |
| /upload            | post   | 上传文件接口，文件存储在/server/upload文件夹内   |
| /upload/:extension | get    | 查询/server/upload文件夹中指定文件后缀的文件列表 |

## video

#### 路由表

| Path             | Method | Describe                      |
| ---------------- | ------ | ----------------------------- |
| /video/:filename | get    | 查询完整视频                  |
| /video/info/:id  | get    | 查询由ffprobe获取的视频元信息 |
| /videoPart/:id   | get    | 查询id对应的frames的截取视频  |

## frames

#### ORM定义

```javascript
class Frames extends Model {}
Frames.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    episode: DataTypes.INTEGER,
    name: DataTypes.STRING,
    start: DataTypes.STRING,
    startIndex: DataTypes.INTEGER,
    end: DataTypes.STRING,
    endIndex: DataTypes.INTEGER,
    frames: DataTypes.INTEGER,
    describe: DataTypes.STRING,
  },
  { sequelize, modelName: 'frames' },
);
```

#### 路由表

| Path        | Method | Describe |
| ----------- | ------ | -------- |
| /frames     | get    | 查询列表 |
| /frames/:id | get    | 查询详情 |
| /frames     | post   | 新增数据 |
| /frames/:id | put    | 更新数据 |
| /frames/:id | delete | 删除数据 |

## images

#### 路由表

| Path        | Method | Describe         |
| ----------- | ------ | ---------------- |
| /images/:id | get    | 查询图片帧组信息 |
| /images     | post   | 新增图片帧组     |
| /images/:id | put    | 更新图片帧组     |

## notes

#### 路由表

| Path       | Method | Describe |
| ---------- | ------ | -------- |
| /notes     | get    | 查询列表 |
| /notes/:id | get    | 查询详情 |
| /notes     | post   | 新增数据 |
| /notes/:id | put    | 更新数据 |
| /notes/:id | delete | 删除数据 |
