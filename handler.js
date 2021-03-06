'use strict';

require('dotenv').config({ path: './variables.env' });
const connectToDatabase = require('./db');
const Podcast = require('./models/Podcast');
let Parser = require('rss-parser');
let parser = new Parser();

module.exports.create = async (event, context) => {
  // Lambda is async!
  try {
    const feed = await parser.parseURL(event.body);
    const episodes = feed.items.map(episode => {
      const episodesData = {
        title: episode.title,
        subtitle: episode.itunes.subtitle,
        description: episode.itunes.summary,
        pubDate: episode.pubDate,
        audioUrl: episode.enclosure.url
      };
      return episodesData;
    });
    const data = {
      author: feed.itunes.author,
      title: feed.title,
      description: feed.description,
      image: feed.itunes.image,
      episodes: [...episodes]
    };
    const db = await connectToDatabase();
    const createPodcast = await Podcast.create(JSON.parse(data));
    return {
      statusCode: 200,
      body: JSON.stringify(podcast)
    };
  } catch (error) {
    console.error(error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify(error.message)
    };
  }
};

// module.exports.create = (event, context, callback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   connectToDatabase().then(() => {
//     Podcast.create(JSON.parse(event.body))
//       .then(podcast =>
//         callback(null, {
//           statusCode: 200,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Credentials': true,
//             'Access-Control-Allow-Headers': 'Authorization'
//           },
//           body: JSON.stringify(podcast)
//         })
//       )
//       .catch(err =>
//         callback(null, {
//           statusCode: err.statusCode || 500,
//           headers: { 'Content-Type': 'text/plain' },
//           body: 'Could not create the podcast.'
//         })
//       );
//   });
// };

module.exports.getOne = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Podcast.findById(event.pathParameters.id)
      .then(podcast =>
        callback(null, {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          },
          body: JSON.stringify(podcast)
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the podcast.'
        })
      );
  });
};

module.exports.getAll = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Podcast.find()
      .then(podcasts =>
        callback(null, {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          },
          body: JSON.stringify(podcasts)
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the podcast.'
        })
      );
  });
};

module.exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Podcast.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), {
      new: true
    })
      .then(podcast =>
        callback(null, {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          },
          body: JSON.stringify(podcast)
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the podcast.'
        })
      );
  });
};

module.exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Podcast.findByIdAndRemove(event.pathParameters.id)
      .then(podcast =>
        callback(null, {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          },
          body: JSON.stringify({
            message: 'Removed podcast with id: ' + podcast._id,
            podcast: podcast
          })
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the podcast.'
        })
      );
  });
};
