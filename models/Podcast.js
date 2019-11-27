const mongoose = require('mongoose');

const EpisodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pubDate: {
    type: Date,
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  }
});

const PodcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    episodes: [EpisodeSchema]
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('Podcast', PodcastSchema);
