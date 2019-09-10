const fs = require("fs");
const http = require("http");

const electron = require("electron");
const express = require("express");
const pug = require("pug");
const socket_io = require("socket.io");

const package = require("./package.json");

const app = express();
const eapp = electron.app;
const server = http.createServer(app);
const io = new socket_io(server);

let win;

function createWindow() {
  if (win != undefined) return win.show();
  win = new electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  });
  win.loadURL("http://localhost:9274");
};

app.use(express.static("public"));

app.get("/", function(request, response) {
  if (!fs.existsSync("./inc/config.json")) response.redirect("/setup");
});

app.get("/setup", function(request, response) {
  response.append("Content-Type", "text/html; charset=utf-8");
  response.send(pug.renderFile("./ui/setup.pug", {MCSM_VERSION: package.version}));
});

eapp.on("ready", function() {
  console.log("Electron app ready")
  server.listen(9274, "127.0.0.1", function() {
    console.log("HTTP server listening on port " + server.address().port);
    createWindow();
  });
});
