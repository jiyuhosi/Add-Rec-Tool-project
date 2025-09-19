# コンテナ起動（ビルド含む）
up:
	docker-compose up --build

# バックグラウンドで起動
upd:
	docker-compose up -d --build

# コンテナ停止
down:
	docker-compose down

# コンテナのみ停止（ボリューム等は残す）
stop:
	docker-compose stop

# コンテナ再起動
restart:
	docker-compose down
	docker-compose up --build

# バックエンドサービスのシェルに入る
backend-bash:
	docker-compose exec backend /bin/bash

# フロントエンドサービスのシェルに入る
frontend-bash:
	docker-compose exec frontend /bin/bash

# Keycloakサービスのシェルに入る
keycloak-bash:
	docker-compose exec keycloak /bin/bash

# ボリューム・イメージ削除を含む完全クリーンアップ
clean:
	docker-compose down -v --rmi all --remove-orphans

# ログ表示
logs:
	docker-compose logs -f

.PHONY: up upd down stop restart backend-bash frontend-bash keycloak-bash clean logs
