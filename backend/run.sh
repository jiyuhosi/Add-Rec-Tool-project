#!/bin/bash

echo "=== Add-Rec-Tool バックエンドサーバー開始 ==="

# 仮想環境確認
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "⚠️  仮想環境がアクティベートされていません！"
    echo "次のコマンドで仮想環境をアクティベートしてください："
    echo "source venv/bin/activate  # macOS/Linux"
    echo "venv\\Scripts\\activate     # Windows"
    exit 1
fi

echo "✅ 仮想環境アクティベート済み: $VIRTUAL_ENV"

# 依存関係インストール
echo "📦 依存関係インストール中..."
pip install -r requirements.txt

# MongoDB接続確認（オプション）
echo "🔍 MongoDB接続確認中..."

# FastAPIサーバー実行
echo "🚀 FastAPIサーバー開始..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload