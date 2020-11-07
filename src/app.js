const { Rools, Rule } = require('rools');
fs = require('fs');

let rawdata = fs.readFileSync('rules.json');
let rules = JSON.parse(rawdata)['rules'];

function then_func(facts, new_facts){
    console.log("Ali");

    for(var key in new_facts){
        facts[key] = new_facts[key];
    }
}

async function run(rules) {
    // facts
    facts = {
        Motion0: "motion",
        Proximity0: 0.2
    };
    console.log(facts);

    let rools_list = [];
    for(var rule_idx in rules) {
        rule = rules[rule_idx];
        var condition_list = [];
        var action_dict = {};

        // Add conditions
        for(var cond_idx in rule['conditions']){
            condition = rule['conditions'][cond_idx];
            // console.log(condition)
            operator = condition['operator'];
            if(operator === '='){
                await condition_list.push((facts) => facts[condition['sensor']] === condition['value']);
                console.log(facts[condition['sensor']] === condition['value'])
            }
            else if(operator === '<'){
                await condition_list.push((facts) => facts[condition['sensor']] < condition['value']);
                console.log(facts[condition['sensor']] < condition['value'])
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
        
        console.log(condition_list);

        // Add new rule
        kir = [];
        kir.push(condition_list[0]);
        kir.push(condition_list[1]);
        const rools_rule = new Rule({
            name: rule['ruleID'].toString(),
            when: condition_list,
            then: (fact) => then_func(fact, action_dict)
        });
        console.log(rools_rule);
        rools_list.push(rools_rule);
    }
    // console.log(rools_list.length);
    const rools = new Rools();
    await rools.register(rools_list);
    await rools.evaluate(facts);
    console.log(facts);
}

run(rules);