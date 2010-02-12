# Makefile for kaltwe
# Author: Jaeho Shin <netj@sparcs.org>
# Created: 2010-02-13

FILES=$(shell find * -type f | grep -Ev '^(Makefile|index.html|.*.manifest)$$')

kaltwe.manifest: Makefile index.html $(FILES)
	echo CACHE MANIFEST >$@
	echo "# Updated: `date +%FT%T%:z`" >>$@
	echo "$(FILES)" >>$@
