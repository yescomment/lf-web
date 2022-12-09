const TwitterFetcher = {
  fetchTweets() {
    const configList = {
      'profile': {
        'screenName': 'NYUEngelberg'
      },
      'domId': 'twitter-container',
      'maxTweets': 3,
      'enableLinks': true,
      'showUser': true,
      'showTime': false,
      'showImages': true,
      'lang': 'en',
      "showInteraction": false
    };

    twitterFetcher.fetch(configList);
  },
  init() {
    this.fetchTweets();
  }
};

module.exports = TwitterFetcher;
