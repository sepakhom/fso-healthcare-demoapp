# Use alpine-python-3 appd image
FROM rtortori/ubuntu-python3

# Set the working directory to /
WORKDIR /

# Copy app requirements
ADD requirements.txt titanic_dataset.csv /

# Optionally define proxy environment
#ARG http_proxy=http://proxy-wsa.esl.cisco.com:80
#ARG https_proxy=http://proxy-wsa.esl.cisco.com:80

# Install requirements
RUN pip install -r requirements.txt && pip install -U appdynamics==4.5.4.0

# Set Entry point
ENV APP_ENTRY_POINT "python /predictor.py"

# Copy app requirements
ADD predictor.py utils.py start_with_appd.sh /

# Expose port 5001
EXPOSE 5001/tcp

# Run it
ENTRYPOINT ["./start_with_appd.sh"]
