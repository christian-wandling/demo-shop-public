.PHONY: up down build logs clean prisma-generate db-update db-migrate db-seed test

GREEN := \033[0;32m
RED := \033[0;31m
NC := \033[0m

up:
	@echo "$(GREEN)Starting containers...$(NC)"
	docker compose up -d &&

down:
	@echo "$(GREEN)Stopping containers...$(NC)"
	docker compose down

build:
	@echo "$(GREEN)Building containers...$(NC)"
	docker compose build --no-cache

logs:
	@echo "$(GREEN)Showing logs...$(NC)"
	docker compose logs -f

clean:
	@echo "$(GREEN)Cleaning up...$(NC)"
	docker compose down -v --remove-orphans

prisma-generate:
	@echo "$(GREEN)Setting up prisma...$(NC)"
	npm run prisma:generate

db-update:
	@echo "$(GREEN)Updating database...$(NC)"
	npm run prisma:push

db-migrate:
	@if [ -z "${NAME}" ]; then \
		echo "$(RED)Error: MIGRATION_NAME is required$(NC)"; \
		echo "Usage: make db-migrate MIGRATION_NAME=YourMigrationName"; \
		exit 1; \
	fi
	@echo "$(GREEN)Creating migration...$(NC)"
	npx prisma migrate dev --name ${NAME}

db-seed:
	@echo "$(GREEN)Seeding database...$(NC)"
	npm run prisma:seed
