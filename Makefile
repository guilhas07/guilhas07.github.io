SHELL := /bin/bash

dev:
	hugo server -D --noHTTPCache --disableFastRender --ignoreCache

update:
	rm ~/go/bin/hugo
	CGO_ENABLED=1 go install -tags extended github.com/gohugoio/hugo@latest

