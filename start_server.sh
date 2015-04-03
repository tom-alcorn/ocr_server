#!/bin/bash

. /home/apprunner/ocr/ocr/bin/activate

LOGFILE=/home/apprunner/ocr/ocr_server/start_server.log
touch $LOGFILE

# kill -9 `ps -ef | grep ocr_server/flask_server/app.py | grep -v grep | awk '{print $2}'`
screen -X -S ocr_app quit
screen -dmS ocr_app python /home/apprunner/ocr/ocr_server/flask_server/app.py > $LOGFILE 2>&1 &

exit
