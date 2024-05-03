import {proto, enu, subscriptionWeakMap, subscriptionStateWeakMap} from "./Subscription";

proto.dispatchReturn = proto.dispatchEventReturn = function (eventstr, data) {
    const state = subscriptionStateWeakMap.get(this);
    const results = [];
    if (state.isDestroyed || state.gc(this)){
        state.destroy?.();
        return results;
    }
    if (enu.includes(eventstr)) {throw new TypeError("event string cannot be falsey")}
    if (typeof eventstr !== "string"){throw new TypeError("event string must be a string")}
    const [event, namespace = ""] = eventstr.split("@");
    switch ((!enu.includes(namespace) << 2) + (!enu.includes(event) << 1)) {
        case 6:
            subscriptionWeakMap.get(this)?.get(namespace)?.get(event)?.forEach(f => results.push(
                {namespace, event, value: f(data)}
            ));
            break;
        case 4:
            subscriptionWeakMap.get(this)?.get(namespace)?.forEach((set, _event) => {
                set.forEach(f => results.push(
                    {namespace, event: _event, value: f(data)}
                ));
            });
            break;
        case 2:
            subscriptionWeakMap.get(this)?.forEach((eventMap, _namespace, namespaceMap) => {
                eventMap.forEach((set, _event) => {
                    if (_event === event) {
                        set.forEach(f => results.push(
                            {namespace: _namespace, event: _event, value: f(data)}
                        ));
                    }
                })
            });
            break;
        case 0:
        default:
            throw new Error("Subscription failed to parse dispatchEvent arguments");
    }
    this.ondispatch?.(results);
    return results;
}