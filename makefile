.PHONY: up down build logs clean

GREEN := \033[0;32m
RED := \033[0;31m
NC := \033[0m

up:
	@echo "$(GREEN)Starting containers...$(NC)"
	docker compose up -d

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
