import SubscriptionState from "./SubscriptionState";
import {enu} from "./Subscriber";

const 
    subscriptionWeakMap = new WeakMap(),
    subscriptionStateWeakMap = new WeakMap();

function Subscription (gc = () => false, subscriptionSet) {
    subscriptionStateWeakMap.set(this, new SubscriptionState(this, gc, subscriptionSet));
    subscriptionWeakMap.set(this, new Map());
}

const proto = Subscription.prototype;

export {subscriptionWeakMap, subscriptionStateWeakMap, enu, proto, Subscription}
export {Subscription as default}