# Makefile for kaltwe
# Author: Jaeho Shin <netj@sparcs.org>
# Created: 2010-02-13

VERSION=1.0

FILES=$(shell find * -type f | grep -Ev '^(Makefile|index.html|.*.manifest)$$')

all: index.html kaltwe.manifest

%: %.in
	sed <$< >$@ 's/@VERSION@/$(VERSION)/g'

kaltwe.manifest: Makefile index.html $(FILES)
	echo CACHE MANIFEST >$@
	echo "# Updated: `date +%FT%T%:z`" >>$@
	echo "$(FILES)" >>$@
