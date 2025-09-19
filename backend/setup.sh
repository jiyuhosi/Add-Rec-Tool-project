# 仮想環境作成スクリプト
echo "🐍 Python仮想環境セットアップ開始..."

# Pythonバージョン確認
python_version=$(python3 --version 2>&1)
echo "Pythonバージョン: $python_version"

# 仮想環境作成
if [ ! -d "venv" ]; then
    echo "📦 仮想環境作成中..."
    python3 -m venv venv
    echo "✅ 仮想環境作成完了"
else
    echo "⚠️  仮想環境が既に存在します。"
fi

echo ""
echo "🎯 次のステップ:"
echo "1. 仮想環境をアクティベート:"
echo "   source venv/bin/activate  # macOS/Linux"
echo "   venv\\Scripts\\activate     # Windows"
echo ""
echo "2. 依存関係インストール及びサーバー実行:"
echo "   ./run.sh"