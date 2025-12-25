#!/usr/bin/sh

SCRIPT_DIR=$(cd $(dirname $0); pwd)
cd $SCRIPT_DIR/src
zip -r ../pretty_refresh.zip *
cd ..
mv -f pretty_refresh.zip pretty_refresh.xpi

