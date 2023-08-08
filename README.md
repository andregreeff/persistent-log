# storage-logger

Storage Logger (formerly "Persistent Log") is a a simple logging helper for JS client applications, providing a more persistent means of log entry storage than one would find with `console`.

## Why another log library? Isn't console.log good enough?

With the increasing complexity in javascript client apps, volatile logs like the one offered by `console.log()` are often not enough to track down that elusive bug your users are finding.

Storage Logger allows your app to save log messages using `localStorage` and read them whenever you need, event if they were logged in another session.

## How to use

Get Storage Logger from https://raw.github.com/andregreeff/storage-logger/master/dist/slog.js and include it in your page.

```Javascript
// Create a storage object
var storage = new slog.storages.LocalStorage({ maxSize: 200 });

// Initialize storage and level (DEBUG, INFO, WARN, ERROR or FATAL)
slog.useStorage(storage);
slog.setLevel(slog.level.INFO);

// Write messages to log
slog.debug("debug message");
slog.info("info message");
slog.warn("warn message");
slog.error("error message");
slog.fatal("fatal message");

// Retrieve stored events
var events = storage.getEvents();
```

Each logged message will be recorded as an event with the following shape:

```
{
	level: 0, // 0 - DEBUG, ..., 3 - FATAL
	message: 'some message',
	date: '2013-12-31T12:04:32.283Z'
}
```

## How to build

storage-logger uses [grunt](http://gruntjs.com/), [browserify](http://browserify.org/) and [karma](http://karma-runner.github.io/0.10/index.html). Building your own version of storage-logger is easy:

1. Clone the repo
2. Install grunt-cli globally: `npm install -g grunt-cli`
3. Install local dependencies: `npm install`
4. Build using the default grunt task (the result will be placed in './dist/slog.js'): `grunt`

There is also a very convenient task for development that watches source files and runs the build process (browserify, karma tests, etc.) after each change:

`grunt dev`

## License

[MIT License](http://opensource.org/licenses/MIT)

(c) Juan María Hernández Arroyo 2014
