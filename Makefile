SHELL := /bin/bash

HUGO_VERSION :=  0.139.4

dev:
	hugo server -D --noHTTPCache --disableFastRender --ignoreCache

update:
	CGO_ENABLED=1 go install -tags extended github.com/gohugoio/hugo@latest
	$(eval VERSION := $(shell hugo version | grep -oP '\d+\.\d+\.\d+'))
	@echo New version: $(VERSION) Old Version: $(HUGO_VERSION)
	@sed -i 's/\(^HUGO_VERSION := \).*/\1 $(VERSION)/' Makefile


install:
	CGO_ENABLED=1 go install -tags extended github.com/gohugoio/hugo@v$(HUGO_VERSION)
