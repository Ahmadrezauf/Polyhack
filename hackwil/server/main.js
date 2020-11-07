import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import './methods.js';
import './api.js'
import './websockets.js'

function insertLink({ title, url }) {
  LinksCollection.insert({title, url, createdAt: new Date()});
  
}

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  const path = require("path");
  const project_dir = process.env.PWD;
  const parent_dir = path.dirname(project_dir);
  console.log(parent_dir);
  // console.log(process.cwd()); // Meteor execution directory in .meteor/local
  Meteor.call("spawnSensor", parent_dir+"/sensors/index.js", "motion");
  Meteor.call("spawnSensor", parent_dir+"/actuators/index.js", "door");
  
  if (LinksCollection.find().count() === 0) {
    insertLink({
      title: 'Do the Tutorial',
      url: 'https://www.meteor.com/tutorials/react/creating-an-app'
    });

    insertLink({
      title: 'Follow the Guide',
      url: 'http://guide.meteor.com'
    });

    insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com'
    });

    insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com'
    });
  }
});
