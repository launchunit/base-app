# Base App

#### Install Dependencies:
```bash
## Production env:
$ sudo npm install --production

## Install all of it:
$ sudo npm install
```

#### Env Variables to Set
```bash
$ export NODE_PORT || PORT
# Api
$ export MONGO_URL
$ export REDIS_URL
# Web
$ export GZIP_STATIC
$ export BASE_URL
$ export ASSET_URL
$ export VERSION
$ export GA
```

#### Endpoints
```bash
$ curl http://localhost:5001/status
```

#### Dev
```bash
$ # Install nodemon globally
$ npm install nodemon --global
$ npm run web-watch
$ npm run api-watch
```

#### Prod
```bash
$ npm run web
$ npm run api
```

#### Load Testing
```bash
$ minigun run tests/load/test.json -o tests/load/report

# Monitor Mem & CPU
$ top -pid $(pgrep -lfa node | grep index.js | awk '{print $1}')
```

------

#### Run Tests

```bash
$ npm test

# OR for continuous testing
$ nodemon --exec "npm test"
```
