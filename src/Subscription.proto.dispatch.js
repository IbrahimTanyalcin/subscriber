import {proto, enu, subscriptionWeakMap, subscriptionStateWeakMap} from "./Subscription";

proto.dispatch = proto.dispatchEvent = function (eventstr, data) {
    this.dispatchReturn(eventstr, data);
    return this;
}