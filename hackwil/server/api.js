import { WebApp } from 'meteor/webapp';
import express from 'express';

const app = express();
app.use(express.json())

app.post('/api', Meteor.bindEnvironment((req, res) => {
  console.log(req.body);
  res.status(200).json({ message: 'Hello from Express!!!'});
}));

WebApp.connectHandlers.use(app);