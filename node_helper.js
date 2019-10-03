  /* Magic Mirror
   * Module: MMM-PirateSpeakNews
   *
   * By BuzzKc
   * MIT Licensed.
   */
  var NodeHelper = require('node_helper');
  var request = require('request');
  var pirateSpeak = require('pirate-speak');
  
 
 module.exports = NodeHelper.create({

start: function() {
    	console.log("Starting module: " + this.name);
    },
    
     getNews: function (url) {
         request({ url: url, method: 'GET' }, (error, response, body) => {
             if (!error && response.statusCode == 200) {
                 var result = JSON.parse(body);

                 //translate results to pirate speak
                 for (let i = 0; i < result.articles.length; i++) {
                     result.articles[i].title = this.pirateSpeakTranslate(result.articles[i].title);
                     if(result.articles[i].description) {
                         result.articles[i].description = this.pirateSpeakTranslate(result.articles[i].description);
                     }
                 }

                 this.sendSocketNotification('PIRATESPEAKNEWS_RESULT', result);
           }
         });
     },
 
     socketNotificationReceived: function(notification, payload) {
         if (notification === 'GET_PIRATESPEAKNEWS') {
             this.getNews(payload);
             
         }
     },

     pirateSpeakTranslate: function(value) {
        return pirateSpeak.translate(value);
     }
 });
 
