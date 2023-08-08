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

function write(level, msg) {
  if (level < currentLevel) return;

  var event = {
    level: level,
    date: new Date(),
    message: msg,
  };

  currentStorage.append(event);

  console.log(event.date.toISOString() + ": " + slog.level.getName(level) + ": " + event.message);
}

function createWriteFunc(level) {
  return function(msg) {
    write(level, msg);
  };
}

for (var levelName in slog.level) {
  if (slog.level.hasOwnProperty(levelName)) {
    slog[levelName.toLowerCase()] = createWriteFunc(slog.level[levelName]);
  }
}

module.exports = slog;
