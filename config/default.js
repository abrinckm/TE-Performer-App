module.exports = {
  "env": "prod",
  "apiUrl": "www.createbetterreasoning.com/api",
  "logger": {
    "name": "TEDummyApp",
    "streams": [
      {
        "level": "info",
        "stream": process.stdout
      },
      {
        "level": "error",
        "stream": process.stderr
      }
    ]
  }
}