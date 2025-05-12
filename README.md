# Ruby on Rails チュートリアルのサンプルアプリケーション with React Router

このリポジトリは [yasslab/sample_app のサンプルアプリケーション (第7版 第14章)](https://github.com/yasslab/sample_apps/tree/main/7_0/ch14) を React Router で動かすためのリポジトリです。

## 概要

- [SPA Mode の React Router](https://reactrouter.com/how-to/pre-rendering#pre-rendering-with-ssrfalse) で動かします
  - 開発環境は React Router （Vite dev server proxy） 経由で Rails サーバーにアクセスします
  - 本番環境は React Router （Vite build） で静的ファイルを生成し、Rails サーバーの静的ファイルとして配置 （public 配下） & 配信します
- Ruby on Rails で作ったロジックはそのまま利用します
- Ruby on Rails の View は利用せず、React Router でリビルドします

## React Router の導入

### 1. フロントエンドプロジェクトの作成

[Installation | React Router](https://reactrouter.com/start/framework/installation) に沿って React Router を導入します。

```bash
npx create-react-router@latest frontend
```

### 2. フロントエンドプロジェクトの設定

[React Router の SPA Mode](https://reactrouter.com/how-to/spa) を設定

```diff:frontend/react-router.config.ts
-  ssr: true,
+  ssr: false,
} satisfies Config;
```

React Router へのアクセスを Rails サーバーにプロキシするように設定

```diff:frontend/vite.config.ts
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
+  server: {
+    proxy: {
+      "/api": "http://localhost:3000",
+      "/users": "http://localhost:3000",
+      "/login": "http://localhost:3000",
+      "/logout": "http://localhost:3000",
+      "/microposts": "http://localhost:3000",
+      "/relationships": "http://localhost:3000",
+    },
+  },
});
```

### 3. 開発環境の起動

フロントエンドとバックエンドを別々に起動します。

```bash
# Rails サーバーを起動（バックエンド）
bin/rails server

# 別ターミナルで React Router を起動（フロントエンド）
cd frontend
npm run dev
```

### 4. React Router のルーティング設定

Rails のルーティングに合わせて React Router のルーティングを設定します。

```tsx:frontend/app/routes/home.tsx
import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sample App" },
    { name: "description", content: "Ruby on Rails Tutorial Sample App" },
  ];
}

export default function Home() {
  return (
    <div className="center jumbotron">
      <h1>Welcome to the Sample App</h1>
      <p>
        This is the home page for the
        <a href="https://railstutorial.jp/">Ruby on Rails Tutorial</a>
        sample application.
      </p>
      <a href="/signup" className="btn btn-lg btn-primary">Sign up now!</a>
    </div>
  );
}
```

### 5. API との連携

Rails のコントローラーを API として利用するための設定を行います。

```ruby:app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  include SessionsHelper
  
  # API リクエストに対して CSRF トークン検証をスキップ
  skip_before_action :verify_authenticity_token, if: :json_request?
  
  private
  
  def json_request?
    request.format.json?
  end
  
  # ...
end
```

### 6. 本番環境のためのビルド設定

React Router のビルド結果を Rails の public ディレクトリに配置します。

```diff:frontend/package.json
  "scripts": {
    "dev": "react-router dev",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
-   "build": "react-router build",
+   "build": "react-router build && cp -r ./build/client/* ../public/",
    "preview": "react-router preview"
  },
```

### 7. デプロイ手順

本番環境へのデプロイ時には、Rails アプリケーションのデプロイ前に React Router のビルドを実行します。

```bash
# フロントエンドのビルド
cd frontend
npm run build

# Rails アプリケーションのデプロイ
cd ..
# ここに通常の Rails デプロイコマンドを記述
```

## 動作確認

1. Rails サーバーと React Router の開発サーバーを起動
2. ブラウザで http://localhost:5173 にアクセス（React Router の開発サーバー）
3. Rails の機能（ログイン、投稿など）が React Router 経由で利用できることを確認

## 参考資料

- [Ruby on Rails チュートリアル](https://railstutorial.jp/)
- [React Router ドキュメント](https://reactrouter.com/)
- [Vite ドキュメント](https://vitejs.dev/)


