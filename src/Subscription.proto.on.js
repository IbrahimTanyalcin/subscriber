import {proto, enu, subscriptionWeakMap} from "./Subscription";

proto.on = proto.addEventListener = function (eventstr, f) {
    if (enu.includes(eventstr)) {throw new TypeError("event string cannot be falsey")};
    if (typeof eventstr !== "string"){throw new TypeError("event string must be a string")}
    if (typeof f !== "function"){throw new TypeError("Subscriptions accept a function as 2nd argument")}
    const 
        [event, namespace = ""] = eventstr.split("@"),
        namespaceMap = subscriptionWeakMap.get(this);
    if (!namespaceMap.has(namespace)) {
        namespaceMap.set(namespace, new Map());
    }
    const eventMap = namespaceMap.get(namespace);
    if (!eventMap.has(event)){
        eventMap.set(event, new Set());
    }
    eventMap.get(event).add(f);
    return this;
}