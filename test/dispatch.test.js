const
    {resolve, join} = require('path');

describe(`testing functionality`, () => {
    beforeAll(async () => {
    })

    afterAll(async () => {
    })

    test(`create subscriber object, add channel and dispatch`, async () => {
        expect.assertions(1);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription = subscriber.subscribe("mychannel");
        subscription.on("myevent@mynamespace", () => counter++);
        subscriber.dispatch("mychannel", "myevent"); //increment
        subscriber.dispatch("mychannel", "@mynamespace"); //increment
        subscriber.dispatch("mychannel", "myevent@mynamespace"); //increment
        expect(counter).toBe(3);
    })

    test(`create 2 subscriptions from 2 channels`, async () => {
        expect.assertions(1);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            subscription$2 = subscriber.subscribe("my-other-channel");
        subscription$1.on("my-event@my-namespace", () => counter |= 0b1);
        subscription$2.on("my-event@my-namespace", () => counter |= 0b10);
        subscriber.dispatch("my-channel", "my-event");
        subscriber.dispatch("my-other-channel", "my-event");
        expect(counter).toBe(3);
    })

    test(`namespaces can be omitted`, async () => {
        expect.assertions(1);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            subscription$2 = subscriber.subscribe("my-other-channel");
        subscription$1.on("my-event", () => counter |= 0b1);
        subscription$2.on("my-event", () => counter |= 0b10);
        subscriber.dispatch("my-channel", "my-event");
        subscriber.dispatch("my-other-channel", "my-event");
        expect(counter).toBe(3);
    })

    test(`events can be omitted provided that there is a namespace`, async () => {
        expect.assertions(1);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            subscription$2 = subscriber.subscribe("my-other-channel");
        subscription$1.on("@my-namespace", () => counter |= 0b1);
        subscription$2.on("@my-namespace", () => counter |= 0b10);
        subscriber.dispatch("my-channel", "@my-namespace");
        subscriber.dispatch("my-other-channel", "@my-namespace");
        expect(counter).toBe(3);
    })

    test(`making sure channels and namespaces are not mixed up`, async () => {
        expect.assertions(1);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            subscription$2 = subscriber.subscribe("my-other-channel");
        subscription$1.on("@my-namespace", () => counter |= 0b1);
        subscription$2.on("@my-namespace", () => counter |= 0b10);
        subscriber.dispatch("my-other-channel", "@my-namespace");
        expect(counter).toBe(2);
    })

    test(`events can be empty provided there is a namespace, but cannot be dispatched without the namespace`, async () => {
        expect.assertions(1);
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel");
        subscription$1.on("@my-namespace", () => void(0));
        expect(() => {subscriber.dispatch("my-channel", "")}).toThrow();
    })

    test(`to fire events with empty string, use the namespace`, async () => {
        expect.assertions(1);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel");
        subscription$1.on("@my-namespace", () => counter |= 0b1);
        subscriber.dispatch("my-channel", "@my-namespace")
        expect(counter).toBe(1);
    })

    test(`dispatch returns the subscriber itself`, async () => {
        expect.assertions(1);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel");
        subscription$1.on("@my-namespace", () => counter++);
        subscriber
        .dispatch("my-channel", "@my-namespace")
        .dispatch("my-channel", "@my-namespace")
        expect(counter).toBe(2);
    })

    test(`dispatchReturn returns the results of the events as an array of objects`, async () => {
        expect.assertions(1);
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            subscription$2 = subscriber.subscribe("my-channel");
        subscription$1.on("my-event@my-namespace", () => "hello");
        subscription$1.on("my-other-event@my-namespace", () => "world!");
        expect(subscriber.dispatchReturn("my-channel", "@my-namespace")).toEqual(
            [
                {channel: "my-channel", subscription: subscription$1, namespace: "my-namespace", event: "my-event", value: "hello"},
                {channel: "my-channel", subscription: subscription$2, namespace: "my-namespace", event: "my-other-event", value: "world!"}
            ]
        );
    })

    test(`cannot create an empty string channel`, async () => {
        expect.assertions(1);
        const subscriber = new Subscriber();
        expect(() => {subscriber.subscribe("")}).toThrow();
    })

    test(`cannot create subscription with empty string event`, async () => {
        expect.assertions(1);
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel");
        expect(() => {subscription$1.on("",() => {})}).toThrow();
    })

    test(`dispatching a non-existent channel should not throw`, async () => {
        expect.assertions(3);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel");
        subscription$1.on("@my-namespace", () => counter++);
        expect(() => {subscriber.dispatch("my-inexistent-channel", "@my-namespace")}).not.toThrow();
        expect(() => {subscriber.dispatch("my-inexistent-channel", "@my-namespace")}).not.toThrow();
        expect(counter).toBe(0);
    })

    test(`dispatching a non-existent event should not throw`, async () => {
        expect.assertions(2);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel");
        subscription$1.on("my-event@my-namespace", () => counter++);
        expect(() => {subscriber.dispatch("my-channel", "inexistent-event")}).not.toThrow();
        expect(counter).toBe(0);
    })

    test(`dispatching a non-existent event even with known namespace should not throw`, async () => {
        expect.assertions(2);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel");
        subscription$1.on("my-event@my-namespace", () => counter++);
        expect(() => {subscriber.dispatch("my-channel", "inexistent-event@my-namespace")}).not.toThrow();
        expect(counter).toBe(0);
    })

    test(`dispatching a non-existent event even with known namespace via non-existent channel should not throw`, async () => {
        expect.assertions(2);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel");
        subscription$1.on("my-event@my-namespace", () => counter++);
        expect(() => {subscriber.dispatch("my-inexistent-channel", "inexistent-event@my-namespace")}).not.toThrow();
        expect(counter).toBe(0);
    })

    test(`subscriptions accept an optional garbage collection function that if returns true, removed from the set`, async () => {
        expect.assertions(1);
        let counter = 0;
        let flag = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel", () => flag);
        subscription$1.on("my-event", () => counter++);
        subscriber.dispatch("my-channel", "my-event"); //increment
        flag = 1;
        subscriber.dispatch("my-channel", "my-event"); //removed, and if cannot be reached, it will be released from the weakmap
        expect(counter).toBe(1);
    })

    test(`you can remove events from subscriptions`, async () => {
        expect.assertions(1);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel");
        subscription$1.on("my-event", () => counter++);
        subscriber.dispatch("my-channel", "my-event"); //increment
        subscription$1.off("my-event");
        subscriber.dispatch("my-channel", "my-event"); //removed
        expect(counter).toBe(1);
    })

    test(`you can remove specific functions from events`, async () => {
        expect.assertions(2);
        let counter = 0;
        let j = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            f1 = () => counter++,
            f2 = () => j++;
        subscription$1.on("my-event", f1);
        subscription$1.on("my-event", f2);
        subscriber.dispatch("my-channel", "my-event"); //increment
        subscription$1.off("my-event", f1);
        subscriber.dispatch("my-channel", "my-event"); //removed
        expect(counter).toBe(1);
        expect(j).toBe(2);
    })

    test(`you can remove namespaces from subscriptions`, async () => {
        expect.assertions(2);
        let counter = 0;
        let j = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            f1 = () => counter++,
            f2 = () => j++;
        subscription$1.on("my-event@my-namespace", f1);
        subscription$1.on("my-event@my-namespace", f2);
        subscriber.dispatch("my-channel", "my-event"); //increment
        subscription$1.off("@my-namespace");
        subscriber.dispatch("my-channel", "my-event"); //removed
        expect(counter).toBe(1);
        expect(j).toBe(1);
    })

    test(`you can remove a function from a namespace`, async () => {
        expect.assertions(2);
        let counter = 0;
        let j = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            f1 = () => counter++,
            f2 = () => j++;
        subscription$1.on("my-other-event@my-namespace", f1);
        subscription$1.on("my-event@my-namespace", f2);
        subscriber.dispatch("my-channel", "@my-namespace"); //increment
        subscription$1.off("@my-namespace", f2);
        subscriber.dispatch("my-channel", "@my-namespace"); //removed
        expect(counter).toBe(2);
        expect(j).toBe(1);
    })

    test(`you can remove an event from a namespace`, async () => {
        expect.assertions(2);
        let counter = 0;
        let j = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            f1 = () => counter++,
            f2 = () => j++;
        subscription$1.on("my-other-event@my-namespace", f1);
        subscription$1.on("my-event@my-namespace", f2);
        subscriber.dispatch("my-channel", "@my-namespace"); //increment
        subscription$1.off("my-other-event@my-namespace");
        subscriber.dispatch("my-channel", "@my-namespace"); //removed
        expect(counter).toBe(1);
        expect(j).toBe(2);
    })

    test(`you can remove a specific function from an event from a namespace`, async () => {
        expect.assertions(3);
        let counter = 0;
        let j = 0;
        let k = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            f1 = () => counter++,
            f2 = () => j++,
            f3 = () => k++;
        subscription$1.on("my-other-event@my-namespace", f1);
        subscription$1.on("my-other-event@my-namespace", f3);
        subscription$1.on("my-event@my-namespace", f2);
        subscriber.dispatch("my-channel", "@my-namespace");
        subscription$1.off("my-other-event@my-namespace", f1);
        subscriber.dispatch("my-channel", "@my-namespace");
        expect(counter).toBe(1);
        expect(j).toBe(2);
        expect(k).toBe(2);
    })

    test(`ondispatch handler is fired for each dispatch`, async () => {
        expect.assertions(4);
        let counter = 0;
        let j = 0;
        let k = 0;
        let m = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            f1 = () => counter++,
            f2 = () => j++,
            f3 = () => k++,
            f4 = () => m++;
        subscription$1.on("my-other-event@my-namespace", f1);
        subscription$1.on("my-other-event@my-namespace", f3);
        subscription$1.on("my-event@my-namespace", f2);
        subscription$1.ondispatch = f4;
        subscriber.dispatch("my-channel", "@my-namespace");
        subscriber.dispatch("my-channel", "@my-namespace");
        expect(counter).toBe(2);
        expect(j).toBe(2);
        expect(k).toBe(2);
        expect(m).toBe(2);
    })

    test(`ondispatch shouldn't be called if the subscription is to be garbage collected`, async () => {
        expect.assertions(4);
        let counter = 0;
        let j = 0;
        let k = 0;
        let m = 0;
        let flag = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel", () => flag),
            f1 = () => counter++,
            f2 = () => j++,
            f3 = () => k++,
            f4 = () => m++;
        subscription$1.on("my-other-event@my-namespace", f1);
        subscription$1.on("my-other-event@my-namespace", f3);
        subscription$1.on("my-event@my-namespace", f2);
        subscription$1.ondispatch = f4;
        subscriber.dispatch("my-channel", "@my-namespace");
        flag = 1;
        for (let i = 0; i < 50; ++i) {
            subscriber.dispatch("my-channel", "@my-namespace");
        }
        expect(counter).toBe(1);
        expect(j).toBe(1);
        expect(k).toBe(1);
        expect(m).toBe(1);
    })

    test(`additional data can be passed onto dispatch`, async () => {
        expect.assertions(1);
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            subscription$2 = subscriber.subscribe("my-channel");
        subscription$1.on("my-event@my-namespace", (data) => data.firstname);
        subscription$1.on("my-other-event@my-namespace", (data) => data.lastname);
        expect(subscriber.dispatchReturn("my-channel", "@my-namespace", {firstname: "john", lastname: "doe"})).toEqual(
            [
                {channel: "my-channel", subscription: subscription$1, namespace: "my-namespace", event: "my-event", value: "john"},
                {channel: "my-channel", subscription: subscription$2, namespace: "my-namespace", event: "my-other-event", value: "doe"}
            ]
        );
    })

    test(`channels can be removed`, async () => {
        expect.assertions(1);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            subscription$2 = subscriber.subscribe("my-other-channel");
        subscription$1.on("my-event", () => counter |= 0b1);
        subscription$2.on("my-event", () => counter |= 0b10);
        subscriber.off("my-other-channel");
        subscriber.dispatch("my-channel", "my-event");
        subscriber.dispatch("my-other-channel", "my-event");
        expect(counter).toBe(1);
    })

    test(`slightly more efficient way of removing a channel as it doesn't remove but clear the set`, async () => {
        expect.assertions(1);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            subscription$2 = subscriber.subscribe("my-other-channel");
        subscription$1.on("my-event", () => counter |= 0b1);
        subscription$2.on("my-event", () => counter |= 0b10);
        subscriber.clear("my-channel");
        subscriber.dispatch("my-channel", "my-event");
        subscriber.dispatch("my-other-channel", "my-event");
        expect(counter).toBe(2);
    })

    test(`tyring to remove empty string or non-string channels should throw`, async () => {
        expect.assertions(7);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel");
        subscription$1.on("@my-namespace", () => counter++);
        expect(() => {subscriber.off("")}).toThrow();
        expect(() => {subscriber.off(null)}).toThrow();
        expect(() => {subscriber.off({value: "test"})}).toThrow();
        expect(() => {subscriber.clear("")}).toThrow();
        expect(() => {subscriber.clear(null)}).toThrow();
        expect(() => {subscriber.clear({value: "test"})}).toThrow();
        subscriber.dispatch("my-channel", "@my-namespace");
        expect(counter).toBe(1);
    })

    test(`subscriptions can be destroyed`, async () => {
        expect.assertions(1);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            subscription$2 = subscriber.subscribe("my-other-channel");
        subscription$1.on("my-event", () => counter |= 0b1);
        subscription$2.on("my-event", () => counter |= 0b10);
        subscription$1.destroy().on("my-event", () => counter = 100); //subscription destroyed, should not fire.
        subscriber.dispatch("my-channel", "my-event");
        subscriber.dispatch("my-other-channel", "my-event");
        expect(counter).toBe(2);
    })

    test(`destroying a subscription more than once should not throw and should have no effect`, async () => {
        expect.assertions(1);
        let counter = 0;
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel"),
            subscription$2 = subscriber.subscribe("my-other-channel");
        subscription$1.on("my-event", () => counter |= 0b1);
        subscription$2.on("my-event", () => counter |= 0b10);
        for (let i = 0; i <= 1000; ++i) {
            subscription$1.destroy().on("my-event", () => counter = Math.random());
        }
        subscriber.dispatch("my-channel", "my-event");
        subscriber.dispatch("my-other-channel", "my-event");
        expect(counter).toBe(2);
    })

    test(`ondispatch should return empty array if dispatches operate on non-existing namespace(s)/event(s)`, async () => {
        expect.assertions(4);
        const 
            subscriber = new Subscriber(),
            subscription$1 = subscriber.subscribe("my-channel");
        subscription$1.on("my-event@my-namespace", (data) => data.firstname);
        subscription$1.on("my-other-event@my-namespace", (data) => data.lastname);
        
        expect(subscriber.dispatchReturn("my-channel", "@my-wrong-namespace", {firstname: "john", lastname: "doe"})).toEqual(
            []
        );
        expect(subscriber.dispatchReturn("my-channel", "wrong-event", {firstname: "john", lastname: "doe"})).toEqual(
            []
        );
        expect(subscriber.dispatchReturn("my-channel", "wrong-event@my-wrong-namespace", {firstname: "john", lastname: "doe"})).toEqual(
            []
        );
        subscription$1.ondispatch = (data) => expect(data).toEqual([]);
        subscriber.dispatchReturn("my-channel", "wrong-event@my-wrong-namespace", {firstname: "john", lastname: "doe"});
    })
});
