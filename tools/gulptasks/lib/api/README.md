# How to view the API
The Highcharts API requires a static file server to be able to perform optimal. 
You can use your own static file server if you have one available, but we have also provided a simple Node.js server to get you started quickly.

## Install Node.js
The provided server requires Node.js to be installed, which can be done by downloading and executing their installer provided at the [Node.js Website](https://nodejs.org/en/).

## Start the server
Once Node.js is installed you can start the server by opening a terminal in this folder, and execute the command `node server.js`. After this the API should be available at http://localhost:8080.

### Usage
```
Usage: node server.js {OPTIONS}

Options:
    --port  Specify a port for the server. Defaults to 8080.
```
