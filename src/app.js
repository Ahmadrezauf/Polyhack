const { Rools, Rule } = require('rools');
fs = require('fs');

let rawdata = fs.readFileSync('rules.json');
let rules = JSON.parse(rawdata)['rules'];

function then_func(facts, new_facts){
    for(var key in new_facts){
        facts[key] = new_facts[key];
    }
}

async function create_rule_engine(rules, rools) {
    let rools_list = [];
    for(var rule_idx in rules) {
        const rule = rules[rule_idx];
        var condition_list = [];
        var action_dict = {};

        // Add conditions
        for(var cond_idx in rule['conditions']){
            const condition = rule['conditions'][cond_idx];
            operator = condition['operator'];
            if(operator === '='){
                condition_list.push((facts) => facts[condition['sensor']] === condition['value']);
                // console.log(facts[condition['sensor']] === condition['value'])
            }
            else if(operator === '<'){
                condition_list.push((facts) => facts[condition['sensor']] < condition['value']);
                // console.log(facts[condition['sensor']] < condition['value'])
            }
            else if(operator === '>'){
                condition_list.push((facts) => facts[condition['sensor']] > condition['value']);
            }
            else if(operator === '<='){
                condition_list.push((facts) => facts[condition['sensor']] <= condition['value']);
            }
            else if(operator === '>='){
                condition_list.push((facts) => facts[condition['sensor']] >= condition['value']);
            }
            else if(operator === '!='){
                condition_list.push((facts) => facts[condition['sensor']] !== condition['value']);
            }
        }

        // Add actions
        for(var action_idx in rule['actions']){
            action = rule['actions'][action_idx];
            action_dict[action['actuator']] = action['value'];
        }

        // Add new rule
        const rools_rule = new Rule({
            name: rule['ruleID'].toString(),
            when: condition_list,
            then: (fact) => then_func(fact, action_dict)
        });
        // console.log(rools_rule);
        rools_list.push(rools_rule);
    }
    // console.log(rools_list.length);
    await rools.register(rools_list);
    // console.log(rools);
    // return rools;
    // await rools.evaluate(facts);
    // console.log(facts);
}

async function evaluate_fact(rule_base, facts) {
    await rule_base.evaluate(facts);
}

// Create rule base
const rools = new Rools();
create_rule_engine(rules, rools);

// facts
const facts = {
    Motion0: "motion",
    Proximity0: 0.2
};
evaluate_fact(rools, facts);
console.log(facts)

// facts
const facts_2 = {
    Motion0: "motion",
    Proximity0: 0.7
};
evaluate_fact(rools, facts_2);
console.log(facts_2)


