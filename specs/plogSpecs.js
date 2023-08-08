describe("slog", function() {
  describe("when configuring slog", function() {
    beforeEach(function() {
      slog.reset();
    });

    it("is initialized with default settings", function() {
      var storage = slog.getStorage();
      var level = slog.getLevel();
      expect(storage instanceof slog.storages.LocalStorage).toBe(true);
      expect(level).toBe(slog.level.INFO);
    });

    it("can use another storage", function() {
      var storage = { append: function(event) {} };
      slog.useStorage(storage);
      expect(slog.getStorage()).toBe(storage);
    });

    it("can export all current events to file", function() {
      var errorMessage = "";
      try {
        slog.exportEvents(true);
      } catch (error) {
        errorMessage = error.message;
      }
      expect(errorMessage).toBe("");
    });
  });

  describe("when working with levels", function() {
    it("can get the level name using the level number", function() {
      expect(slog.level.getName(slog.level.DEBUG)).toBe("DEBUG");
      expect(slog.level.getName(slog.level.INFO)).toBe("INFO");
      expect(slog.level.getName(slog.level.WARN)).toBe("WARN");
      expect(slog.level.getName(slog.level.ERROR)).toBe("ERROR");
      expect(slog.level.getName(slog.level.FATAL)).toBe("FATAL");
    });
  });

  describe("when logging a text message", function() {
    var events = [];
    var storage = {
      append: function(event) {
        events.push(event);
      },
    };

    beforeEach(function() {
      events = [];
      slog.useStorage(storage);
    });

    describe("when the log level is below message level", function() {
      beforeEach(function() {
        slog.setLevel(slog.level.DEBUG);
      });

      it("adds an event to the storage", function() {
        slog.info("sample message");
        expect(events[0].level).toBe(slog.level.INFO);
        expect(events[0].message).toBe("sample message");
        var now = new Date();
        expect(+events[0].date / 1000).toBeCloseTo(+now / 1000, 0);
      });

      it("adds the event with the specified level", function() {
        slog.warn("this is a warning");
        expect(events[0].level).toBe(slog.level.WARN);
      });
    });

    describe("when the log level is above message level", function() {
      beforeEach(function() {
        slog.setLevel(slog.level.WARN);
      });

      it("ignores the event", function() {
        slog.info("sample message");
        expect(events.length).toBe(0);

        slog.debug("other message");
        expect(events.length).toBe(0);
      });
    });
  });
});
