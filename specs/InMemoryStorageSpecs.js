describe("InMemoryStorage", function() {
  var storage = new slog.storages.InMemoryStorage();

  beforeEach(function() {
    storage.clear();
  });

  it("stores new events", function() {
    storage.append({
      logger: "one logger",
      date: new Date().toISOString(),
      message: "first message",
    });
  });

  it("retrieves stored events", function() {
    storage.append({ message: "one", date: new Date().toISOString() });
    storage.append({ message: "two", date: new Date().toISOString() });

    var events = storage.getEvents();
    expect(events.length).toBe(2);
    expect(events[0].message).toBe("one");
    expect(events[1].message).toBe("two");
  });

  it("clears stored events", function() {
    storage.append({ message: "one", date: new Date().toISOString() });
    storage.clear();

    expect(storage.getEvents().length).toBe(0);
  });
});
