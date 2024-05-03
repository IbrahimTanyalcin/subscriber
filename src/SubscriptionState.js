

function SubscriptionState (subscription, gc, subscriptionSet) {
    this.gc = gc;
    this.destroy = this.remove = () => {
        subscriptionSet.delete(subscription);
        this.destroy = null;
        return this.isDestroyed = true;
    };
    this.isDestroyed = false;
}

const proto = SubscriptionState.prototype;

export {proto, SubscriptionState}
export {SubscriptionState as default}