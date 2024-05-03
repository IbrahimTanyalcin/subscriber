# SUBSCRIBER

size: 1.3Kb (gzipped)

This tiny library let's you coordinate and dispatch events using channels, namespaces and events. 

You create the subscriber once. And add subscriptions to it. You dispatch from the subscriber passing first channel name, event name and an optional data:
```js
 const 
    subscriber = new Subscriber(),
    subscription = subscriber.subscribe("my-channel");
subscription.on("my-event@my-namespace", () => console.log("Hello World!"));
subscriber.dispatch("my-channel", "my-event"); // Hello World!
```

You can create multiple channels:

```js
const subscription$1 = subscriber.subscribe("my-channel");
const subscription$2 = subscriber.subscribe("my-channel");
const subscription$3 = subscriber.subscribe("my-other-channel");
```

Add events to subscriptions using event name, only namespace or both. There must be `@` between event and namespace. Event comes first:

```js
subscription$1.on("my-event", () => void(0))
subscription$1.on("@my-namespace", () => void(0))
subscription$1.on("my-event@my-namespace", () => void(0))
```

Pass optional data if you want:

```js
const 
    subscriber = new Subscriber(),
    subscription$1 = subscriber.subscribe("my-channel"),
    subscription$2 = subscriber.subscribe("my-channel");
subscription$1.on("my-event@my-namespace", (data) => data.firstname);
subscription$1.on("my-other-event@my-namespace", (data) => data.lastname);
subscriber.dispatchReturn("my-channel", "@my-namespace", {firstname: "john", lastname: "doe"})
/*
    [
        {channel: "my-channel", subscription: subscription$1, namespace: "my-namespace", event: "my-event", value: "john"},
        {channel: "my-channel", subscription: subscription$2, namespace: "my-namespace", event: "my-other-event", value: "doe"}
    ]
*/
```

## Methods

| Method                          | Example                    | Explanation                      |
|---------------------------------|----------------------------|----------------------------------|
| `subscriber.clear()`    |  | Clears all the event listeners in the channel's `Set` |
| `subscriber.off(channelstr)`    | `subscriber.off("my-channel")` | Removes the channel, recreated automatically if needed later |
| `subscriber.removeChannel(channelstr)`    | `subscriber.off("my-channel")` | Alias for `subscriber.off` |
| `subscriber.dispatch(channelstr, eventstr [,data])`    | `subscriber.dispatch("my-channel", "my-event", {hello: "world"})` | Dispatches events in the channel |
| `subscriber.dispatchReturn(channelstr, eventstr [,data])`    | `subscriber.dispatchReturn("my-channel", "my-event", {hello: "world"})` | Dispatches events but instead of returning the subscriber, it returns the callback results as an array with the signature `{channel, subscription, namespace, event, value}` |
| `subscriber.subscribe(channelstr[,gc])`    | `subscriber.subscribe("my-channel")` | Creates a subscription to a channel |
