# hayate

基于Vite+Vue3+Typescript的个人项目

# Pages

- [Echarts图表配置](./src/pages/charts/index.vue)
- [canvas绘制](./src/pages/board/index.vue)
- [视频截取](./src/pages/video/index.vue)
- [笔记](./src/pages/note/index.vue)

# Server

使用Express+[Sequelize](https://sequelize.org/docs/v6/)(a promise-based Node.js ORM tool)+sqlite3构建
```bash
 cd .\server\
 yarn dev
```

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
  { sequelize, modelName: "frames" }
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

## video

#### 路由表

| Path              | Method | Describe                     |
| ----------------- | ------ | ---------------------------- |
| /video?episode=01 | get    | 查询完整视频                 |
| /video/:id        | get    | 查询id对应的frames的截取视频 |

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
