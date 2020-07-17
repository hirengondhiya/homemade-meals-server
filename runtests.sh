#!/bin/bash 

DATE=`date +%d-%m-%y-%H-%M`
LOG="testResults/server.${DATE}.log"

echo $LOG
echo $DATE | tee -a $LOG

echo "START-------------------------" | tee -a $LOG
npm test | tee -a $LOG
echo "END-------------------------" | tee -a $LOG
echo | tee -a $LOG
echo | tee -a $LOG