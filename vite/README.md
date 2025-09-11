# Add-Rec-Tool フロントエンド

Add-Rec-Toolプロジェクトの React ベースフロントエンドアプリケーションです。TypeScript と Vite を使用して、最適な開発体験とパフォーマンスを実現しています。

## 📋 前提条件

プロジェクトをセットアップする前に、以下のソフトウェアがインストールされていることを確認してください：

- **Node.js** (バージョン 18.0.0 以上)
- **npm** (バージョン 8.0.0 以上) または **yarn** (バージョン 1.22.0 以上)
- **Git** (バージョン管理用)

## 🚀 セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd osaka/Add-Rec-Tool/frontend
```

### 2. 依存関係のインストール

```bash
npm install
# または
yarn install
```

### 3. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、以下の変数を設定してください：

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=Add-Rec-Tool
VITE_APP_VERSION=1.0.0
```

### 4. 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

アプリケーションは `http://localhost:5173` でアクセス可能になります。

## 📁 プロジェクト構成

```
frontend/
├── public/                 # 静的アセット
├── src/
│   ├── components/        # 再利用可能なUIコンポーネント
│   ├── pages/            # ページコンポーネント
│   ├── hooks/            # カスタムReactフック
│   ├── services/         # APIサービス
│   ├── types/            # TypeScript型定義
│   ├── utils/            # ユーティリティ関数
│   ├── styles/           # グローバルスタイルとテーマ
│   ├── App.tsx           # メインアプリケーションコンポーネント
│   └── main.tsx          # アプリケーションエントリーポイント
├── index.html            # HTMLテンプレート
├── package.json          # 依存関係とスクリプト
├── tsconfig.json         # TypeScript設定
├── vite.config.ts        # Vite設定
└── README.md            # このファイル
```

## 🛠️ 利用可能なスクリプト

- `npm run dev` - 開発サーバーの起動
- `npm run build` - 本番用ビルド
- `npm run preview` - 本番ビルドのプレビュー
- `npm run lint` - ESLintの実行
- `npm run lint:fix` - ESLintエラーの自動修正
- `npm run type-check` - TypeScript型チェックの実行

## 🔧 開発環境設定

### TypeScript + Vite セットアップ

このプロジェクトでは、高速な開発と最適なビルドパフォーマンスのためにViteとTypeScriptを使用しています：

- **ホットモジュールリプレースメント (HMR)** による即座の更新
- **Fast Refresh** によるReactコンポーネントの高速リロード
- **型安全** なTypeScript開発環境

## 🌐 API連携

フロントエンドは以下の方法でバックエンドAPIと通信します：

- **ベースURL**: `VITE_API_BASE_URL` 環境変数で設定
- **HTTPクライアント**: APIリクエストにAxiosを使用
- **エラーハンドリング**: APIレスポンスの一元化されたエラー処理
- **型安全性**: APIデータモデル用のTypeScriptインターフェース

## 🧪 テスト

```bash
npm run test          # ユニットテストの実行
npm run test:watch    # ウォッチモードでテスト実行
npm run test:coverage # カバレッジレポートの生成
```

## 📦 本番用ビルド

```bash
npm run build
```

ビルドされたファイルは `dist/` ディレクトリに出力され、任意の静的ファイルサーバーで配信できます。

## 🔍 トラブルシューティング

### よくある問題

1. **ポートが既に使用されている**: `vite.config.ts` でポートを変更するか、使用中のプロセスを終了してください
2. **モジュールが見つからない**: `npm install` ですべての依存関係がインストールされていることを確認してください
3. **TypeScriptエラー**: `npm run type-check` を実行して型の問題を特定してください
4. **ESLintエラー**: `npm run lint:fix` を実行してフォーマットの問題を自動修正してください

### 開発のヒント

- デバッグにはブラウザの開発者ツールを使用してください
- コンポーネント検査のためにReact Developer Tools拡張機能をインストールしてください
- より良い型安全性のためにTypeScriptストリクトモードを使用してください
- プロジェクトのコーディング規約とESLintルールに従ってください

## 🤝 貢献方法

1. `main` ブランチから機能ブランチを作成
2. コーディング標準に従って変更を実施
3. コミット前にテストとリンティングを実行
4. 明確な説明とともにプルリクエストを提出

## 🔧 推奨開発環境

## 📚 技術スタック

- **React 18** - UIライブラリ
- **TypeScript** - 型安全な開発
- **Vite** - 高速ビルドツール
- **ESLint** - コード品質管理
- **Axios** - HTTP通信ライブラリ
- **tailwind css** css
- **shadcn ui** ui Component
