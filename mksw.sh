#!/bin/sh
# 186: stamp sw.js with a hash of the freshly built index.html (new cache name + byte-changed worker every deploy)
cd "$(dirname "$0")" && H=$(sha256sum index.html | cut -c1-12) && sed -i "s/^const BUILD='[^']*';/const BUILD='$H';/" sw.js && grep -q "^const BUILD='$H';" sw.js && echo "sw.js BUILD=$H"
