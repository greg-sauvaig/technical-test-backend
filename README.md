# Backend test


## Installation

this application is a multi container docker app it is meant to be built with

```bash
docker-compose up --build --no-start
```

## Usage
### server
to run the app use docker-compose command
```bash
docker-compose run -p 3000:3000 --name node --rm node level{num}
```
### queue
launch the dedicated queue processor
```bash
docker-compose run --name queue --rm queue queueFile
```
or
```bash
docker-compose run --name queue --rm queue queueProcess
```

## License
[MIT](https://choosealicense.com/licenses/mit/)