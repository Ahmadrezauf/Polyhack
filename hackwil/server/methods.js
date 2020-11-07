import { create_rule_engine, evaluate_fact } from './rules_evaluation.js';
const { Rools, Rule } = require('rools');
let rules = require('../config/rules.json').rules;

// Create rule base
const rools = new Rools();
create_rule_engine(rules, rools);

Meteor.methods({
    'spawnProcess': (sensor_path, sensor_name) => {
        const { exec } = require('child_process');
        const subprocess = exec(`node ${sensor_path} ${sensor_name.type} ${sensor_name.id}`, function (error, stdout, stderr) {
            if (error) {
                console.log(error.stack);
                console.log('Error code: '+error.code);
                console.log('Signal received: '+error.signal);
            }
            console.log('Child Process STDOUT: '+stdout);
            console.log('Child Process STDERR: '+stderr);
        });

        subprocess.stdout.on('data', function(data) {
            console.log(data); 
        });        

        subprocess.on('exit', function (code) {
        console.log('Child process exited with exit code '+code);
        });
    },
    'evaluateFactTest': () => {
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
    },
    'evaluateFact': (facts) => {
        // facts
        /*const facts_2 = {
            Motion0: "motion",
            Proximity0: 0.7
        };*/
        evaluate_fact(rools, facts);
        console.log(facts)
    }
});