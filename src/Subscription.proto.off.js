import {proto, enu, subscriptionWeakMap} from "./Subscription";

proto.off = proto.removeEventListener = function (eventstr, f) {
    if (typeof eventstr === "function"){
        f = eventstr;
        subscriptionWeakMap.get(this)?.forEach((eventMap,_namespace) => {
            eventMap.forEach((set, event) => {
                set.delete(f);
            })
        })
        return this;
    }
    if (enu.includes(eventstr)) {throw new TypeError("event string cannot be falsey")}
    if (typeof eventstr !== "string"){throw new TypeError("event string must be a string")}
    if (!enu.includes(f) && typeof f !== "function") {
        throw new TypeError("Second argument to subscription's removeEventListener, if exists, has to be a function")
    }
    const [event, namespace = ""] = eventstr.split("@");
    switch ((!enu.includes(namespace) << 2) + (!enu.includes(event) << 1) + (!enu.includes(f))) {
        case 7:
            subscriptionWeakMap.get(this)?.get(namespace)?.get(event)?.delete(f);
            break;
        case 6:
            subscriptionWeakMap.get(this)?.get(namespace)?.delete(event);
            break;
        case 5:
            subscriptionWeakMap.get(this)?.get(namespace)?.forEach((set, _event) => {
                set.delete(f);
            });
            break;
        case 4:
            subscriptionWeakMap.get(this)?.delete(namespace);
            break;
        case 3:
            subscriptionWeakMap.get(this)?.forEach((eventMap, _namespace) => {
                eventMap.forEach((set, _event) => {
                    if (_event === event) {
                        set.delete(f)
                    }
                })
            });
            break;
        case 2:
            subscriptionWeakMap.get(this)?.forEach((eventMap, _namespace, namespaceMap) => {
                eventMap.forEach((set, _event) => {
                    if (_event === event) {
                        namespaceMap.get(_namespace).delete(event);
                    }
                })
            });
            break;
        case 1:
        case 0:
        default:
            throw new Error("Subscription failed to parse removeEvenListener arguments");
    }
    return this;
}