import { create_sample_rule_engine, create_rule_engine, evaluate_fact } from './rules_evaluation.js';
const { Rools, Rule } = require('rools');
let rules = require('../config/rules.json').rules;

// Create rule base
const rools = new Rools();
create_sample_rule_engine(rools);

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
        //facts
        const facts = {
            StreetMotion0: "motion",
            FloodMotion0: "motion",
            FloodNoise0: "suspicious",
            MuseumMotion0: "no motion",
            CollarProximity0: 0.7
        };
        evaluate_fact(rools, facts);
        console.log(facts)
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