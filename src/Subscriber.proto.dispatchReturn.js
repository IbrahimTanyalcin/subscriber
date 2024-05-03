import {proto, enu, subscriberWeakMap as wm} from "./Subscriber";

proto.dispatchReturn = proto.dispatchEventReturn = function (channelstr, eventstr, data) {
    if (enu.includes(channelstr)) {throw new TypeError("channel string cannot be falsey")}
    if (typeof channelstr !== "string"){throw new TypeError("channel string must be a string")}
    if (enu.includes(eventstr)) {throw new TypeError("event string cannot be falsey")}
    if (typeof eventstr !== "string"){throw new TypeError("event string must be a string")}
    return [...(wm.get(this)?.get(channelstr) || [])].flatMap(subscription => {
        return subscription.dispatchReturn(eventstr, data).map(resultObj => {
            return {channel: channelstr, subscription, ...resultObj}
        })
    })
}