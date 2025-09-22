# Python 仮想環境のセットアップと実行ガイド

## 1. 仮想環境の作成

```bash
# Python 3.8 以上が必要
python -m venv venv

# conda を使う場合
conda create -n add-rec-tool python=3.9
```

## 2. 仮想環境の有効化

```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# conda を使う場合
conda activate add-rec-tool
```

## 3. 依存関係のインストール

```bash
pip install -r requirements.txt
```

## 4. 環境変数の設定

`.env` ファイルを確認し、必要に応じて編集してください。

## 5. MongoDB の起動

ローカルで MongoDB が起動していることを確認してください。

```bash
# Docker を使う場合
docker run -d -p 27017:27017 --name mongodb mongo

# ローカルの MongoDB サービスを起動
brew services start mongodb/brew/mongodb-community  # macOS
sudo systemctl start mongod  # Linux
```

## 6. サーバーの起動

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 7. API ドキュメントの確認

-   Swagger UI: http://localhost:8000/docs
-   ReDoc: http://localhost:8000/redoc

## トラブルシューティング

### Swagger UI が開かない場合

1. サーバーの起動状態を確認

```bash
# ターミナルでサーバーが正常に起動しているか確認
# 次のようなメッセージが表示されます:
# INFO:     Uvicorn running on http://127.0.0.1:8000
```

2. ポート競合を確認

```bash
# 8000 ポートを使用しているプロセスを確認
lsof -i :8000

# 別ポートで起動してみる
uvicorn app.main:app --reload --port 8001
```

3. 依存関係を確認

```bash
# 仮想環境が有効化されているか確認
which python
# 期待される例: /Users/kimri/project/real osaka/real project/Add-Rec-Tool/backend/venv/bin/python

# 必要パッケージのインストール確認
pip list | grep fastapi
pip list | grep uvicorn
```

4. 段階的デバッグ

```bash
# 1. 基本的な Python 実行テスト
cd "/Users/kimri/project/real osaka/real project/Add-Rec-Tool/backend"
python -c "import fastapi; print('FastAPI インストール済み')"

# 2. アプリの import テスト
python -c "from app.main import app; print('アプリのロードに成功')"

# 3. 手動でサーバー起動
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### よくあるエラー

-   ModuleNotFoundError: 仮想環境が有効化されていない、または依存関係が未インストール
-   Address already in use: 8000 ポートが既に使用中
-   ImportError: ファイルパスまたはモジュール構成の問題

## 開発のヒント

-   仮想環境が有効化されているか: `which python`
-   インストール済みパッケージの確認: `pip list`
-   新規パッケージ追加後: `pip freeze > requirements.txt`
-   サーバーログの確認: ターミナルのエラーメッセージを詳細に確認

## Keycloak 連携（簡易モード）

最小構成で Keycloak のトークン検証ができるよう基本依存関係を追加しています。デフォルトでは認証は無効化されており、既存の動作に影響はありません。

### 有効化方法

`.env` または環境変数に以下を設定してください。

```
AUTH_ENABLED=true
KEYCLOAK_ISSUER=http://localhost:8083/realms/<your-realm>
# 必要に応じて設定（audience 検証）
KEYCLOAK_AUDIENCE=<your-frontend-client-id>
```

サーバー起動後、トークンなしで呼び出すと匿名として処理されます（無効化時）。トークンを付与すると検証され、クレームが返ります。

### 確認用エンドポイント

-   GET /api/v1/secure/me
    -   ヘッダー: Authorization: Bearer <access_token>
    -   応答: `{ "claims": { ... } }`

### 開発用トークン取得例（任意）

開発時に Direct Access Grants が有効なクライアントでのみ使用してください。本番は Authorization Code + PKCE を推奨します。

```
curl -X POST \
	"$KEYCLOAK_ISSUER/protocol/openid-connect/token" \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-d "grant_type=password" \
	-d "client_id=<your-client-id>" \
	-d "username=<user>" \
	-d "password=<password>"
```

発行された access_token を用いて呼び出し

```
curl -H "Authorization: Bearer <access_token>" http://localhost:8000/api/v1/secure/me
```

実装ファイル:

-   `app/dependencies/auth.py`: JWKS ベースの JWT 検証（PyJWT）
-   `app/api/routes/secure.py`: /secure/me エンドポイント
-   `app/api/routes/__init__.py`: ルーター登録
