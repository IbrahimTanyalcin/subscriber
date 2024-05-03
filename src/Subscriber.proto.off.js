import {proto, enu, subscriberWeakMap as wm} from "./Subscriber";

proto.off = proto.removeChannel = function (channelstr) {
    if (enu.includes(channelstr)) {throw new TypeError("channel string cannot be falsey")}
    if (typeof channelstr !== "string"){throw new TypeError("channel string must be a string")}
    wm.get(this)?.delete(channelstr);
    return this;
}