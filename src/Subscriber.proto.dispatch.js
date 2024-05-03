import {proto, subscriberWeakMap as wm} from "./Subscriber";

proto.dispatch = proto.dispatchEvent = function (channelstr, eventstr, data) {
    this.dispatchReturn(channelstr, eventstr, data);
    return this;
}