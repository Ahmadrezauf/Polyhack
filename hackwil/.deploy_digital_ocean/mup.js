module.exports = {
  servers: {
    one: {
      host: '134.122.68.124',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    }
  },

  app: {
    name: 'Hackwil',
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    volumes: {
      // passed as '-v /host/path:/container/path' to the docker run command
      '/home': '/home',
    },

    env: {
      ROOT_URL: 'https://hackwil.facetcha.com/',
      PORT: 3009,  /// sets machine port i.e. what is exposed outside of docker
    },

    docker: {
      image: 'abernix/meteord:node-12-base',
    },

    // This is the maximum time in seconds it will wait
    // for your app to start
    // Add 30 seconds if the server has 512mb of ram
    // And 30 more if you have binary npm dependencies.
    deployCheckWaitTime: 60,
    deployCheckPort: 3009,

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    port: 27017,
    version: '3.4.1',
    servers: {
      one: {}
    }
  },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  proxy: {
    domains: 'hackwil.facetcha.com',
    ssl: {
      // Enable let's encrypt to create free certificates.
      // The email is used by Let's Encrypt to notify you when the
      // certificates are close to expiring.
      letsEncryptEmail: 'jonathan@grabigo.com',
      forceSSL: true
    }
  }

};
