import {proto, enu, subscriberWeakMap as wm} from "./Subscriber";
import Subscription from "./Subscription";

proto.subscribe = function (channelstr, gc = () => false) {
    if (enu.includes(channelstr)) {throw new TypeError("channel string cannot be falsey")}
    if (typeof channelstr !== "string"){throw new TypeError("channel string must be a string")}
    const channelMap = wm.get(this);
    if (!channelMap.has(channelstr)) {
        channelMap.set(channelstr, new Set());
    }
    const 
        subscriptionSet = channelMap.get(channelstr),
        subscription = new Subscription(gc, subscriptionSet);
    subscriptionSet.add(subscription);
    return subscription;
}