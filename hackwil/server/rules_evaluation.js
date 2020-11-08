const { Rools, Rule } = require('rools');
fs = require('fs');

let rules = require('../config/rules.json').rules;
console.log(rules)
//let rules = JSON.parse(rawdata)['rules'];

function then_func(facts, new_facts){
    for(var key in new_facts){
        facts[key] = new_facts[key];
    }
}

async function create_sample_rule_engine(rools) {
    // Create rules
    const rule0 = new Rule({
        name: '0',
        when: (facts) => facts.StreetMotion0 === 'motion',
        then: (facts) => {
            facts.StreetLamp0 = 1;
        },
        // activationGroup: rule['ruleID'].toString()
    });
    const rule1 = new Rule({
        name: '1',
        when: (facts) => facts.CollarProximity0 <= 0.5,
        then: (facts) => {
            facts.CatDoor0 = 'unlocked';
        },
        // activationGroup: rule['ruleID'].toString()
    });
    const rule2 = new Rule({
        name: '2',
        when: [
            (facts) => facts.FloodMotion0 === 'motion',
            (facts) => facts.FloodNoise0 === 'suspicious'
        ],
        then: (facts) => {
            facts.FloodLight0 = 1;
        },
        // activationGroup: rule['ruleID'].toString()
    });
    const rule3 = new Rule({
        name: '3',
        when: (facts) => facts.MuseumMotion0 === 'motion',
        then: (facts) => {
            facts.MuseumLight0 = 1;
            facts.MuseumLight1 = 1;
            facts.MuseumLight2 = 1;
            facts.MuseumLight3 = 1;
        },
        // activationGroup: rule['ruleID'].toString()
    });
    // console.log(rools_rule);
    // rools_list.push(rools_rule);
    await rools.register([rule0, rule1, rule2, rule3]);
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

module.exports = { create_sample_rule_engine, create_rule_engine, evaluate_fact } 

