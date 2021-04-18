#!/bin/bash 

function kill_server {
 	sh_id=`ps aux | awk '/[s]tock_sentiment/ {print $2}'`

	if [[ "$sh_id" -ne "" ]]
	then 
		kill -9 $sh_id
	fi
}

function start_server {
	if [ -e /home/debian/backend/stock_sentiment ] 
	then 
		/home/debian/backend/stock_sentiment &
	fi	
	return
}

kill_server
start_server &
