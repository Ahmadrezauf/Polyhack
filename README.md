# Polyhack - ASUS Challenge

We're addressing the challenge of ASUS Robotics & AI Center Challenge - IoT Software Foundation for a Smart City! We provide a modular, simple, and scalable IoT with a sustainable rule engine.

### Rule set
A set of rules is provided by the user in a user-friendly manner, for example, "If ProximitySensor1 is smaller than 0.5 then set Door1 to unlock". The rule set is translated into a JSON file that the server can work with. The translation is done via natural languange processing. This part can be extended to receive more complex inputs, or even can be extended to receive a recorded voice and can cast them into the JSON format.
The rule set is then optimized, and the conflicts in the ruleset are resolved in an efficient manner. Optimiztion is done in two major ways:

* Different rules partially share the same premises should be merged into one
* Re-evaluation of all premises is not needed for every change, so we just re-evaluate the affected premises.

Moreover, the ruleset can be extended later on. The optimizations can help when the rule set gets complicated and possible conflicts in the rule set can happen.

Conflicts can happen in the rule set. As an example, when you have multiple rules to fire, which one to pick first?
In order to handle this, we define strategies in the order of priority:
* Refraction -- Each rule will fire only once, at most, during any one match-resolve-act cycle.
* Priority -- Rules with higher priority will fire first. Set the rule's property priority to an integer value. Default priority is 0. Negative values are supported.
* Specificity -- Rules which are more specific will fire first. For example, there is rule R1 with premises P1 and P2, and rule R2 with premises P1, P2 and P3. R2 is more specific than R1 and will fire first. R2 is more specific than R1 because it has all premises of R1 and additional ones.
* Order of rules -- The rules that were registered first will fire first.


### Inference from the rules
Whenever there is an update from the sensors, the server evaluates them with regards to the rules and activates the actuators if needed. The inference from the ruleset is based on the forward-chaining principle, in order to make the inference efficient.

### Scalability

Thanks to nodejs and the rule engine, we're not limited to the number of sensors, the number of rules, or the number of actuators
