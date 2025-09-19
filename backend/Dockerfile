FROM python:3.11

WORKDIR /app

# 依存関係ファイルをコピー
COPY requirements.txt .

# 依存関係をインストール
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY . .

# ポート8000を公開
EXPOSE 8000

# FastAPIサーバーを実行
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
