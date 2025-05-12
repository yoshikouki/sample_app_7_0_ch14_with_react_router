# Ruby on Rails チュートリアルのサンプルアプリケーション with React Router

このリポジトリは [yasslab/sample_app のサンプルアプリケーション (第7版 第14章)](https://github.com/yasslab/sample_apps/tree/main/7_0/ch14) を React Router で動かすためのリポジトリです。

## 概要

- [SPA Mode の React Router](https://reactrouter.com/how-to/pre-rendering#pre-rendering-with-ssrfalse) で動かします
  - 開発環境は React Router (Vite dev server proxy) 経由で Rails サーバーにアクセスします
  - 本番環境は React Router (Vite build) で静的ファイルを生成し、Rails サーバーの静的ファイルとして配置 (public 配下) & 配信します
- Ruby on Rails で作ったロジックはそのまま利用します
- Ruby on Rails の View は利用せず、React Router でリビルドします

## React Router の導入

### 1. フロントエンドプロジェクトの作成

[Installation | React Router](https://reactrouter.com/start/framework/installation) に従って React Router を導入します。

```bash
npx create-react-router@latest frontend
```

### 2. フロントエンドプロジェクトの設定

[React Router の SPA Mode](https://reactrouter.com/how-to/spa) を設定

```diff

```

React Router へのアクセスを Rails サーバーにプロキシするように設定

```diff

```


