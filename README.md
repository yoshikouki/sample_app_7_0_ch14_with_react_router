# Ruby on Rails チュートリアルのサンプルアプリケーション with React Router

このリポジトリは [yasslab/sample_app のサンプルアプリケーション (第7版 第14章)](https://github.com/yasslab/sample_apps/tree/main/7_0/ch14) を React Router で動かすためのリポジトリです。

### 概要

- [SPA Mode の React Router](https://reactrouter.com/how-to/pre-rendering#pre-rendering-with-ssrfalse) で動かします
  - 開発環境は React Router(Vite dev server proxy)経由で Rails サーバーにアクセスします
  - 本番環境は React Router(Vite build)で静的ファイルを生成し、Rails サーバーの静的ファイルとして配置(public 配下) & 配信します
- Ruby on Rails で作ったロジックはそのまま利用します
- Ruby on Rails の View は利用せず、React Router でリビルドします

### React Router の導入

#### 1. フロントエンドプロジェクトの作成

[Installation | React Router](https://reactrouter.com/start/framework/installation) に沿って React Router を導入します。

```bash
npx create-react-router@latest frontend
```

#### 2. フロントエンドプロジェクトの設定

[React Router の SPA Mode](https://reactrouter.com/how-to/spa) を設定

```diff:frontend/react-router.config.ts
-  ssr: true,
+  ssr: false,
} satisfies Config;
```

#### 3. 開発環境の起動

フロントエンドとバックエンドを別々に起動します。

```bash
# React Router の起動確認
cd frontend
npm run dev
```

#### 4. React Router のルーティング設定

React Router のルーティングを設定します。

```tsx:frontend/app/routes.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
] satisfies RouteConfig;
```

```tsx:frontend/app/routes/home.tsx
import type { Route } from "./+types/home";

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
        This is the home page for the{" "}
        <a href="https://railstutorial.jp/">Ruby on Rails Tutorial</a>
        {" "}sample application.
      </p>
      <a href="/signup" className="btn btn-lg btn-primary">Sign up now!</a>
    </div>
  );
}
```

#### 重要：ルーティングの重複に関する注意

Rails と React Router のルーティングが重複すると、とくに本番環境で意図しない動作が発生する可能性があります。以下の点に注意してください：

- React Router の開発サーバーで設定したプロキシパスと同じパスを React Router のルーティングにも設定すると、React Router が優先され Rails のエンドポイントにリクエストが到達しない場合があります
- `/users` のようなパスが Rails と React Router の両方に存在する場合、開発環境では設定によって異なる挙動になる可能性があります
- 本番環境では、すべてのルーティングを適切に設計し、Rails API と React Router のフロントエンドの役割分担を明確にしてください

このような問題を避けるため、次のいずれかの方法を検討してください：
- Rails API 用のパスに `/api` プレフィックスを付ける（例：`/api/users`）
- React Router のルートパスに接頭辞を付ける（例：`/app/*`）
- 明確な API 呼び出しと UI ルーティングのガイドラインを設けて厳格に従う

#### 5. API との連携

Rails のコントローラーを API として利用するための設定を行います。
この設定はセキュリティリスクを伴います。本番環境ではリスク評価を行った上で対策を講じてください。

```ruby:config/routes.rb
Rails.application.routes.draw do
  get    "/help",    to: "static_pages#help"
  get    "/about",   to: "static_pages#about"
  get    "/contact", to: "static_pages#contact"
  get    "/signup",  to: "users#new"
  get    "/login",   to: "sessions#new"
  post   "/login",   to: "sessions#create"
  delete "/logout",  to: "sessions#destroy"
  resources :account_activations, only: [:edit]
  resources :password_resets,     only: [:new, :create, :edit, :update]

  namespace :api do
    resources :users do
      member do
        get :following, :followers
      end
    end
    resources :microposts,          only: [:create, :destroy]
    resources :relationships,       only: [:create, :destroy]
    get '/microposts', to: 'static_pages#home'
  end
end
```

React Router へのアクセスを Rails サーバーにプロキシするように設定 (開発環境用の設定)

```ts:frontend/vite.config.ts
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/help": "http://localhost:3000",
      "/about": "http://localhost:3000",
      "/contact": "http://localhost:3000",
      "/signup": "http://localhost:3000",
      "/login": "http://localhost:3000",
      "/logout": "http://localhost:3000",
      "/account_activations": "http://localhost:3000",
      "/password_resets": "http://localhost:3000",
    },
  },
});
```

API リクエスト (JSON) に対して CSRF トークン検証をスキップするための設定

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

#### 6. 本番環境のためのビルド設定

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

#### 7. デプロイ手順

本番環境へのデプロイ時には、Rails アプリケーションのデプロイ前に React Router のビルドを実行します。

```bash
# フロントエンドのビルド
cd frontend
npm run build

# Rails アプリケーションのデプロイ
cd ..
# ここに通常の Rails デプロイコマンドを記述
```

### 動作確認

1. Rails サーバーと React Router の開発サーバーを起動
2. ブラウザで http://localhost:5173 にアクセス（React Router の開発サーバー）
3. Rails の機能（ログイン、投稿など）が React Router 経由で利用できることを確認

### 参考資料

- [Ruby on Rails チュートリアル](https://railstutorial.jp/)
- [React Router ドキュメント](https://reactrouter.com/)
- [Vite ドキュメント](https://vitejs.dev/)



### 開発サーバーを起動するための Procfile.dev を作成

```bin/dev
#!/usr/bin/env sh

if ! gem list foreman -i --silent; then
  echo "Installing foreman..."
  gem install foreman
fi

# Default to port 3000 if not specified
export PORT="${PORT:-3000}"

# Let the debug gem allow remote connections,
# but avoid loading until `debugger` is called
export RUBY_DEBUG_OPEN="true"
export RUBY_DEBUG_LAZY="true"

exec foreman start -f Procfile.dev "$@"
```

```Procfile.dev
web: bin/rails server
frontend: cd frontend && pnpm run dev
```

```bash
# 初回のみ
chmod +x ./bin/dev
bin/dev

# 2回目以降
bin/dev
```

参考: https://zenn.dev/ykpythemind/articles/78586345df229b#procfile%E3%82%92%E4%BD%9C%E6%88%90(optional)
