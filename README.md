# Add-Rec-Tool

## プロジェクト概要

Add-Rec-Tool は、FastAPI + MongoDB を用いたバックエンドを中心に、開発・運用を素早く始められるようにしたプロジェクトです。認証には任意で Keycloak を連携できます（バックエンド詳細は backend/README.md を参照）。

## 主な構成

-   backend: FastAPI ベースの API（MongoDB、Keycloak 連携のサンプルあり）
-   frontend: フロントエンド（例: React/Next.js/Vite 等）
-   bff: フロントエンド専用の BFF 層（Express/NestJS 等、API 集約・認証ヘッダー付与などを担当）
-   infra（任意）: Docker Compose などの起動定義
-   その他: Makefile による起動補助（存在しない場合は docker compose を直接利用）

## 前提条件

-   Docker / Docker Compose
-   Make（GNU Make）
-   Python 3.9+（バックエンド単体起動時）
-   Node.js 18+（推奨）
-   npm / yarn / pnpm のいずれか

## クイックスタート（Make 利用）

以下は Makefile にターゲットが定義されている前提です。未導入の場合は docker compose のコマンドに読み替えてください。

1. .env の準備（必要に応じてルートや backend/.env を設定）
2. 起動

```bash
make up
```

3. ログ確認

```bash
make logs
```

4. 停止/破棄

```bash
make down
```

5. 動作確認

-   Backend Swagger: http://localhost:8000/docs
-   Bff: http://localhost:8080
-   GraphQL: Backend http://localhost:8000/graphql
-   MongoDB: localhost:27017
-   Keycloak（任意）: http://localhost:8083
-   vite: http://localhost:5173/

## よく使う Make ターゲット

-   make up: サービス起動（docker compose up -d 相当）
-   make down: サービス停止・破棄（docker compose down）
-   make logs: すべてのコンテナログをフォロー
-   make ps: 稼働中のサービス一覧
-   make rebuild: イメージを再ビルドして起動
-   make clean: ボリュームやキャッシュも含めてクリーンアップ（必要時のみ）

## Backend の詳細

バックエンドのセットアップやトラブルシューティングは backend/README.md を参照してください。主な内容:

-   仮想環境の作成と依存関係のインストール
-   Uvicorn によるローカル起動
-   Keycloak 連携の有効化（ENV: AUTH_ENABLED, KEYCLOAK_ISSUER, KEYCLOAK_AUDIENCE）
-   検証用エンドポイント: GET /api/v1/secure/me（任意）

## Frontend の詳細

-   位置: frontend ディレクトリ（実装スタックはプロジェクトに合わせて読み替え）
-   セットアップ:
    ```bash
    cd frontend
    npm ci   # or: npm install / yarn / pnpm i
    ```
-   開発起動:
    ```bash
    npm run dev
    # 既定例: http://localhost:3000
    ```
-   ビルド/本番起動:
    ```bash
    npm run build
    npm run start
    ```
-   環境変数（例）:
    -   API ベース URL: NEXT_PUBLIC_API_BASE_URL または VITE_API_BASE_URL を使用
    -   GraphQL エンドポイント: NEXT_PUBLIC_GRAPHQL_ENDPOINT または VITE_GRAPHQL_ENDPOINT
    -   例: http://localhost:8080/graphql（BFF 経由）/ http://localhost:8000/graphql（バックエンド直）
    -   ファイル: .env.local（フロント）, backend/.env（バックエンド）
-   API 接続先:
    -   開発: フロント → バックエンド http://localhost:8000
    -   逆プロキシや CORS 設定は実装に合わせて調整

## BFF の詳細

-   位置: bff ディレクトリ
-   役割: API の集約/変換、認証ヘッダー付与、CORS 回避、Cookie→Bearer 変換、レート制御 等
-   セットアップ:
    ```bash
    cd bff
    npm ci   # or: npm install / yarn / pnpm i
    ```
-   開発起動:
    ```bash
    # ローカル API へプロキシする例
    PORT=8080 BACKEND_BASE_URL=http://localhost:8000 npm run dev
    # 既定アクセス: http://localhost:8080
    # GraphQL: http://localhost:8080/graphql （/graphql をバックエンドへプロキシする想定）
    ```
-   ビルド/本番起動:
    ```bash
    npm run build
    PORT=8080 BACKEND_BASE_URL=http://localhost:8000 npm run start
    ```
-   環境変数（例）:
    -   PORT: BFF の公開ポート（デフォルト例: 8080）
    -   BACKEND_BASE_URL: バックエンド API のベース URL（例: http://localhost:8000 / Docker: http://backend:8000）
    -   SESSION_SECRET: Cookie ベースのセッションを使う場合に設定
    -   （任意）GRAPHQL_PATH: GraphQL のパス（デフォルト例: /graphql）

## Docker / コンテナ運用

-   前提: Docker と Docker Compose v2
-   起動:
    ```bash
    docker compose up -d
    ```
-   再ビルドして起動:
    ```bash
    docker compose build --no-cache
    docker compose up -d
    ```
-   ログ確認:
    ```bash
    docker compose logs -f --tail=100
    ```
-   停止/破棄:
    ```bash
    docker compose down
    # ボリュームも削除
    docker compose down -v
    ```
-   コンテナへ入る（例）:
    ```bash
    docker compose exec backend bash
    docker compose exec frontend sh
    docker compose exec bff sh
    ```
-   ポート例:
    -   Frontend: 3000 / 5173（Vite 開発）
    -   BFF: 8080
    -   Backend(API): 8000
    -   MongoDB: 27017
    -   Keycloak（任意）: 8083
-   環境変数:
    -   ルート .env、backend/.env、frontend/.env.local、bff/.env を用途に応じて設定

## トラブルシューティング

-   ポート競合: 3000/5173（Frontend）、8080（BFF）、8000（API）、27017（MongoDB）、8083（Keycloak）を使用
-   依存関係の不整合: backend/venv を有効化してから pip install -r backend/requirements.txt
-   Make が使えない場合: docker compose コマンドを直接使用（例: docker compose up -d）

## ライセンス

プロジェクトに適用するライセンスがある場合はここに記載してください。
