
const subscriberWeakMap = new WeakMap();
const enu = ["", null, void(0)];

function Subscriber () {
    subscriberWeakMap.set(this, new Map());
}

const proto = Subscriber.prototype;

export {subscriberWeakMap, enu, proto, Subscriber}
export {Subscriber as default}