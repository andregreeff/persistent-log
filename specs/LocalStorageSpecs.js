describe("LocalStorage", function() {
  var storage = new slog.storages.LocalStorage({
    maxSize: 10,
  });

  beforeEach(function() {
    storage.clear();
  });

  it("can add events to local storage", function() {
    storage.append({ message: "one", date: new Date().toISOString() });
    storage.append({ message: "two", date: new Date().toISOString() });

    var events = storage.getEvents();
    expect(events[0].message).toBe("one");
    expect(events[1].message).toBe("two");
  });

  describe("when size grows over max size", function() {
    var events;

    beforeEach(function() {
      for (var i = 0; i < 10; i++) {
        storage.append({ message: i, date: new Date().toISOString() });
      }
      storage.append({ message: "the last one", date: new Date().toISOString() });
      events = storage.getEvents();
    });

    it("reduces size by 20% before adding more events", function() {
      expect(events.length).toBe(9);
    });

    it("drops older events", function() {
      expect(events[0].message).toBe(2);
      expect(events[8].message).toBe("the last one");
    });
  });
});
