(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window.slog = require("./lib/index");

},{"./lib/index":4}],2:[function(require,module,exports){
var InMemoryStorage = function() {
  this.events = [];
};

InMemoryStorage.prototype.append = function(event) {
  this.events.push(event);
};

InMemoryStorage.prototype.clear = function() {
  this.events = [];
};

InMemoryStorage.prototype.getEvents = function() {
  return this.events;
};

module.exports = InMemoryStorage;

},{}],3:[function(require,module,exports){
var INDEX_KEY = "slog-index";

function initialize() {
  saveIndex({ firstId: 0, nextId: 0 });
}

function saveIndex(index) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

function loadIndex() {
  return JSON.parse(localStorage.getItem(INDEX_KEY));
}

function foreachKey(callback) {
  var index = loadIndex();
  for (var id = index.firstId; id < index.nextId; id++) {
    callback("slog-event-" + id);
  }
}

var LocalStorage = function(opts) {
  var index = loadIndex();

  opts = opts || {};
  this.maxSize = opts.maxSize || 100;

  if (!index) {
    initialize();
  }
};

LocalStorage.prototype.clear = function() {
  foreachKey(function(key) {
    localStorage.removeItem(key);
  });
  initialize();
};

LocalStorage.prototype.purgeOldEvents = function() {
  var eventsToPurge = Math.round(this.maxSize * 0.2);
  var index = loadIndex();

  for (var i = 0; i < eventsToPurge; i++) {
    var key = "slog-event-" + (index.firstId + i);
    localStorage.removeItem(key);
  }

  index.firstId += eventsToPurge;
  saveIndex(index);
};

LocalStorage.prototype.getEvents = function() {
  var events = [];
  foreachKey(function(key) {
    var event = localStorage.getItem(key);
    events.push(JSON.parse(event));
  });
  return events;
};

LocalStorage.prototype.append = function(event) {
  var index = loadIndex();
  var currentSize = index.nextId - index.firstId;

  if (currentSize + 1 > this.maxSize) {
    this.purgeOldEvents();
    index = loadIndex();
  }

  var key = "slog-event-" + index.nextId;
  localStorage.setItem(key, JSON.stringify(event));

  index.nextId++;
  saveIndex(index);
};

module.exports = LocalStorage;

},{}],4:[function(require,module,exports){
var slog = {};

slog.storages = {
  LocalStorage: require("./LocalStorage"),
  InMemoryStorage: require("./InMemoryStorage"),
};

slog.level = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
  getName: function(level) {
    for (var x in this) {
      if (this[x] === level) return x;
    }
    return level;
  },
};

var currentStorage, currentLevel;

slog.reset = function() {
  currentStorage = new slog.storages.LocalStorage();
  currentLevel = slog.level.INFO;
};

slog.reset();

slog.useStorage = function(storage) {
  currentStorage = storage;
};

slog.getStorage = function() {
  return currentStorage;
};

slog.getLevel = function() {
  return currentLevel;
};

slog.setLevel = function(level) {
  currentLevel = level;
};

slog.exportEvents = function(dryRun) {
  var events = currentStorage.getEvents();
  if (!!events && events.length) {
    var illegalFilenameChars = /[-\:\.]/g;
    var firstDate = events[0].date.replaceAll(illegalFilenameChars, "_");
    var lastDate = events[events.length - 1].date.replaceAll(illegalFilenameChars, "_");
    var blob = new Blob([JSON.stringify(events, " ", 2)], { type: "text/plain" });
    var url = URL.createObjectURL(blob);
    var downloadLink = document.createElement("a");
    downloadLink.download = "dashboard-events-" + firstDate + "-" + lastDate + ".json";
    downloadLink.href = url;
    if (typeof downloadLink.click !== "function") {
      throw Error("why does that 'anchor' element have no 'click' function..?");
    }
    if (!dryRun) {
      downloadLink.click();
    }
  }
};

function write(level, message) {
  if (level < currentLevel) return;

  var event = {
    level: level,
    date: new Date(),
    message: message,
  };

  currentStorage.append(event);

  // TODO: this should be reworked to retain the appropriate "console" method.. in the meantime, this will not aim to replace all logging calls.
  // console.log(event.date.toISOString() + ": " + slog.level.getName(level) + ": " + event.message);
}

function createWriteFunc(level) {
  return function(message) {
    write(level, message);
  };
}

for (var levelName in slog.level) {
  if (slog.level.hasOwnProperty(levelName)) {
    slog[levelName.toLowerCase()] = createWriteFunc(slog.level[levelName]);
  }
}

module.exports = slog;

},{"./InMemoryStorage":2,"./LocalStorage":3}]},{},[1]);
