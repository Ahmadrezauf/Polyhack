import re
import string
import nltk
import spacy
import pandas as pd
import numpy as np
import math

from spacy.matcher import Matcher, PhraseMatcher
from spacy.tokens import Span
from spacy import displacy

import json

nlp = spacy.load("en_core_web_sm")

result = {}

with open('devices.json') as json_file:
    data = json.load(json_file)
    all_sensor_names = data["sensors"]
    all_actuator_names = data["actuators"]
    #for p in data['sensor']:
    #    print('Name: ' + p['name'])
    #    print('From: ' + p['from'])
    #    print('Website: ' + p['website'])
    #    print('')

#print(all_sensor_names)
#print(all_actuator_names)
#all_sensor_names = ["sensor1","sensor2","sensor3","ProximitySensor1"]
#all_actuator_names = ["a1","a2","a3","door"]

#sent = "if sensor1 is bigger than 3 and sensor2 is smaller than 8 then set a1 to 5"

sent = input("Please enter your desired rule: ")
id = input("Please enter a new ruleID: ")

doc = nlp(sent)

tokens = nltk.word_tokenize(sent)

for tok in doc:
  print(tok.text, "-->",tok.dep_,"-->", tok.pos_)


pattern1 = [{'POS':'NOUN'},
           {'LOWER':'is'},
           {'REL':'ADJ'},
           {'LOWER':'than'},
           {'VAL':'NUM'}]

pattern1_neg = [{'POS':'NOUN'},
              {'LOWER':'is'},
              {'LOWER':'not'},
              {'REL':'ADJ'},
              {'LOWER':'than'},
              {'VAL':'NUM'}]

pattern_conj = [{"CON":'and'},
               {'POS':'NOUN'},
               {'LOWER':'is'},
               {'REL':'ADJ'},
               {'LOWER':'than'},
               {'VAL':'NUM'}]

pattern_conj_neg = [{'CON':'and'},
              {'POS':'NOUN'},
              {'LOWER':'is'},
              {'LOWER':'not'},
              {'REL':'ADJ'},
              {'LOWER':'than'},
              {'VAL':'NUM'}]

pattern_disj = [{"CON":'or'},
               {'POS':'NOUN'},
               {'LOWER':'is'},
               {'REL':'ADJ'},
               {'LOWER':'than'},
               {'VAL':'NUM'}]

pattern_disj_neg = [{'CON':'or'},
              {'POS':'NOUN'},
              {'LOWER':'is'},
              {'LOWER':'not'},
              {'REL':'ADJ'},
              {'LOWER':'than'},
              {'VAL':'NUM'}]


pattern_action = [{'ACT':'set'},
                  {'POS':'NOUN'},
                  {'LOWER':'to'},
                  {'VAL':'NUM'}]

pattern_conj_action = [{'CON':'and'},
                  {'ACT':'set'},
                  {'POS':'NOUN'},
                  {'LOWER':'to'},
                  {'VAL':'NUM'}]

pattern_disj_action = [{'CON':'or'},
                  {'ACT':'set'},
                  {'POS':'NOUN'},
                  {'LOWER':'to'},
                  {'VAL':'NUM'}]

pattern_action_V = [{'ACT':'set'},
                  {'POS':'NOUN'},
                  {'LOWER':'to'},
                  {'VAL':'VERB'}]

pattern_conj_action_V = [{'CON':'and'},
                  {'ACT':'set'},
                  {'POS':'NOUN'},
                  {'LOWER':'to'},
                  {'VAL':'VERB'}]

pattern_disj_action_V = [{'CON':'or'},
                  {'ACT':'set'},
                  {'POS':'NOUN'},
                  {'LOWER':'to'},
                  {'VAL':'VERB'}]


matcher = Matcher(nlp.vocab)
phrase_matcher = PhraseMatcher(nlp.vocab)

matcher.add("matching_1", None, pattern1)
matcher.add("matching_2", None, pattern1_neg)
matcher.add("matching_3", None, pattern_conj)
matcher.add("matching_4", None, pattern_conj_neg)
matcher.add("matching_5", None, pattern_disj)
matcher.add("matching_6", None, pattern_disj_neg)
matcher.add("matching_7", None, pattern_action)
matcher.add("matching_8", None, pattern_conj_action)
matcher.add("matching_9", None, pattern_disj_action)
matcher.add("matching_10", None, pattern_action_V)
matcher.add("matching_11", None, pattern_conj_action_V)
matcher.add("matching_12", None, pattern_disj_action_V)



matches = matcher(doc)

found_patterns = set()
for match_id, start, end in matches:
    string_id = nlp.vocab.strings[match_id]  # Get string representation
    span = doc[start:end]  # The matched span
    print(match_id, string_id, start, end, span.text)
    found_patterns.add(span.text)

all_relations = ["bigger", "smaller", "equal", "beq", "seq"]

actions = []
rules = []
for r in found_patterns:
    tmp = nlp(r)
    dr = {}
    flag_is_sensor = False
    for tok in tmp:
        t = str(tok)
        if t in all_sensor_names:
            dr["sensor"]=t
            flag_is_sensor = True
        elif t in all_actuator_names:
            dr["actuator"] = t
        if t in all_relations:
            if t == "equal":
                s = "="
            elif t == "smaller":
                s = "<"
            elif t == "bigger":
                s = ">"
            elif t == "beq":
                s = ">="
            elif t == "seq":
                s = "<="
            dr["operator"] = s
        if str(tok.pos_) == "NUM" or str(tok.pos_) == "VERB" :
            dr["value"] = t
    if flag_is_sensor:
        rules.append(dr)
    else:
        actions.append(dr)


rules = [dict(t) for t in {tuple(d.items()) for d in rules}]
actions = [dict(t) for t in {tuple(d.items()) for d in actions}]
print("SENTENCE {}".format(sent))
print("RULES {}".format(rules))
print("ACTIONS {}".format(actions))

result["ruleID"] = id
result["conditions"]=rules
result["actions"]=actions

with open('new_rule.txt', 'w') as outfile:
    json.dump(result, outfile)

