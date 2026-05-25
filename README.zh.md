# vibly-site

Vibly 首页，基于 Vite + React + Tailwind CSS 构建。

## 页面

- 首页：`/`
- 捐赠页：`/donate/`

## 本地预览

安装依赖：

```bash
pnpm install
```

启动开发服务器：

```bash
pnpm dev
```

构建生产包：

```bash
pnpm build
```

然后访问（默认开发端口）:

- 首页：`http://localhost:5173/`
- 捐赠页：`http://localhost:5173/donate/`

`/donate/` 作为静态页面由 `public/donate/` 提供。

## 项目结构

- `src/`：React 首页源码
  - `src/App.jsx`：首页 UI（加入命令预览、多语言、主题切换）
  - `src/main.jsx`：应用入口
  - `src/index.css`：Tailwind 入口样式
- `public/`：静态资源与静态页面
  - `public/assets/`：图标与图片
  - `public/donate/`：捐赠页面
  - `public/site.config.js`：静态页面配置
  - `public/main.js` 与 `public/styles.css`：捐赠页面脚本与样式

## NPM 脚本

- `pnpm dev`：启动本地开发服务器
- `pnpm build`：构建生产包
- `pnpm preview`：预览生产构建结果

## 配置

React 首页的内容（多语言文案、链接、运行时列表）定义在 `src/App.jsx` 中。

捐赠页（`/donate/`）读取 `public/site.config.js`，相关配置项：

- `donate.title`
- `donate.subtitle`
- `donate.address`
- `donate.explorer`
- `donate.qr`
- `donate.copy`
