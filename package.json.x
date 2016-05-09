{
  "name": "fluffenfall",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "watchify src/main.jsx -v -t [babelify --presets [ react ] ] -o public/js/main.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/oisee/react-sceleton.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/oisee/react-sceleton/issues"
  },
  "homepage": "https://github.com/oisee/react-sceleton#readme",
  "dependencies": {
    "babel-preset-react": "^6.5.0",
    "babelify": "^7.3.0",
    "react": "^15.0.2",
    "react-dom": "^15.0.2",
    "watchify": "^3.7.0"
  }
}
