# Predictor returns a survival prediction based on a request from the web tier.
# Version 2 also logs the transaction to Redis and returns prediction with 2 decimal digits precision


import redis
import os
from utils import logger
import time
from datetime import datetime

from flask import Flask, request, jsonify
import socket
import json

# Logging
log = logger('predictor', '{}/predictor.log'.format(os.getcwd()))

# Default serve delay
global serve_delay
serve_delay = 1

# Define services endpoints

try:
    redis_service = os.environ['REDIS_SERVICE']
except:
    redis_service = '127.0.0.1'

try:
    redis_port = os.environ['REDIS_PORT']
except:
    redis_port = '6379'

log.debug('Redis target is: {}'.format(redis_service))


# Redis support in version 2
r = redis.Redis(host=redis_service, port=redis_port,
                db=0, socket_connect_timeout=2)


# Flask app object
app = Flask(__name__)

# Log application started
log.info('APPSTART: Predictor started')








@app.route('/booking', methods=['POST'])
def predictor():
    log.debug('Incoming booking request from: {}'.format(request.remote_addr))
    
    try:
        result = {
            "name": str(request.json['name']),
            "lastname": str(request.json['lastname']),
            "mobile": request.json['mobile'],
            "date": request.json['date'],
            "doctor": request.json['doctor'],
            "price": request.json['price'],
            "age": request.json['age'],
            "gender": request.json['gender'],
            "creditcard": request.json['creditcard'],
            "category": request.json['category']
        }
        try:
            log.info("Adding patient:" + str(json.dumps(result)) )
            r.rpush('transactions', str(json.dumps(result)))
            log.debug('REDIS: Logged transaction')
            log.debug('Waiting {} seconds before serving...'.format(serve_delay))
            time.sleep(serve_delay)
        except:
            log.warning(
                'REDIS: {} is not reachable. Will not log this transaction.'.format(redis_service))
            pass
        log.debug('Returning prediction to {}'.format(request.remote_addr))
        
        return jsonify(result)
    except as e:
        log.error('Can\'t return payload, something is wrong')

# Kubernetes health checks
@app.route('/healthz', methods=['GET'])
def healthz():
    return "I'm fine"

# Serve delay views
@app.route('/delay01', methods=['GET'])
def delay01():
    global serve_delay
    serve_delay = 0.1
    return "Set serve delay to 0.1 second - Timestamp: {} - serve_delay: {}".format(datetime.now(), serve_delay)

@app.route('/delay1', methods=['GET'])
def delay1():
    global serve_delay
    serve_delay = 1
    return "Set serve delay to 1 second - Timestamp: {} - serve_delay: {}".format(datetime.now(), serve_delay)

@app.route('/delay3', methods=['GET'])
def delay3():
    global serve_delay
    serve_delay = 3
    return "Set serve delay to 3 second - Timestamp: {} - serve_delay: {}".format(datetime.now(), serve_delay)

@app.route('/delay5', methods=['GET'])
def delay5():
    global serve_delay
    serve_delay = 5
    return "Set serve delay to 5 seconds - Timestamp: {} - serve_delay: {}".format(datetime.now(), serve_delay)


@app.route('/delay10', methods=['GET'])
def delay10():
    global serve_delay
    serve_delay = 10
    return "Set serve delay to 10 seconds - Timestamp: {} - serve_delay: {}".format(datetime.now(), serve_delay)

@app.route('/log', methods=['GET'])
def showlog():
    with open('{}/predictor.log'.format(os.getcwd())) as logfile:
        return logfile.read()


# Run Flask
if __name__ == "__main__":
    app.run(debug=False, host='0.0.0.0', port=5001, threaded=True)
