import {proto, subscriptionStateWeakMap} from "./Subscription";

proto.destroy = proto.remove = function () {
    const state = subscriptionStateWeakMap.get(this);
    state.destroy?.();
    return this;
}