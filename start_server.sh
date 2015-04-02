#!/bin/bash

. /home/apprunner/ocr/ocr/bin/activate

LOGFILE=/home/apprunner/ocr/ocr_server/start_server.log
touch $LOGFILE

python /home/apprunner/ocr/ocr_server/flask_server/app.py > $LOGFILE 2>&1
