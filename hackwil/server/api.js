import { WebApp } from 'meteor/webapp';
import express from 'express';

const app = express();
app.use(express.json())

app.post('/api', Meteor.bindEnvironment((req, res) => {
  // console.log(req.body);
  global_facts[req.body.sensorID] = req.body.sensorValue;
  Meteor.call("evaluateFact", global_facts);
  res.status(200).json({ message: 'Sensor data processed!'});
}));

app.post('/send_image', Meteor.bindEnvironment((req, res) => {
  console.log("image received (in server)");
  // console.log(req.body);
  const facts = {
    Motion0: "motion",
    Proximity0: 0.2
  };
  Meteor.call("evaluateFact", facts);
  res.status(200).json({ message: 'Sensor data processed!'});
}));

WebApp.connectHandlers.use(app);