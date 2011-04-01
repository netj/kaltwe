# Makefile for kaltwe
# Author: Jaeho Shin <netj@sparcs.org>
# Created: 2010-02-13

VERSION=1.1.1

FILESCMD=find * -type f | grep -Ev '^(Makefile|index\.html|.*\.(in|manifest))$$'
FILES=$(shell $(FILESCMD))

all: index.html kaltwe.manifest

kaltwe.manifest: kaltwe.manifest.in Makefile index.html $(FILES)
	echo CACHE MANIFEST >$@
	echo "# Updated: `date +%FT%T%:z`" >>$@
	$(FILESCMD) >>$@
	cat $< >>$@

%: %.in Makefile
	sed <$< >$@ \
	    's/@VERSION@/$(VERSION)/g'

publish:
	git tag -f v$(VERSION)
	git checkout gh-pages
	git checkout -f v$(VERSION) .
	rm -f index.html kaltwe.manifest
	$(MAKE)
	-git commit -m "v$(VERSION) 공개." .
	git push --all
	git checkout master

