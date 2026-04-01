.PHONY: install dev cms build preview test check clean deploy help

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Start local dev server at http://localhost:4321
	npm run dev

cms: ## Start dev server + local CMS backend (admin at http://localhost:4321/it/admin/)
	npx decap-server & npm run dev

build: ## Build for production
	npm run build

preview: ## Preview production build locally at http://localhost:4321
	npm run preview

test: ## Run unit tests
	npm test

check: ## TypeScript type check
	npm run check

clean: ## Remove build output
	rm -rf dist/

deploy: build ## Build, then push to GitHub (triggers Actions deploy)
	git push origin master
