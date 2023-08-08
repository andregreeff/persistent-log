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
