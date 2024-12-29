SHELL := /bin/bash

HUGO_VERSION :=  0.140.1

dev:
	hugo server -D --noHTTPCache --disableFastRender --ignoreCache

update:
	$(eval VERSION := $(shell CGO_ENABLED=1 go install -tags extended github.com/gohugoio/hugo@latest && hugo version | grep -oP '\d+\.\d+\.\d+'))
	@echo New version: $(VERSION) Old Version: $(HUGO_VERSION)
	@sed -i 's/\(^HUGO_VERSION := \).*/\1 $(VERSION)/' Makefile

install-ci:
	@if [ -z $(TMP_DIR) ]; then \
		echo "Error: TMP_DIR is not set."; \
		exit 1; \
	fi
	wget -O $(TMP_DIR)/hugo.deb https://github.com/gohugoio/hugo/releases/download/v$(HUGO_VERSION)/hugo_extended_$(HUGO_VERSION)_linux-amd64.deb \
	&& sudo dpkg -i $(TMP_DIR)/hugo.deb

install:
	CGO_ENABLED=1 go install -tags extended github.com/gohugoio/hugo@v$(HUGO_VERSION)
