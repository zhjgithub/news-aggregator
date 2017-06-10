/**
 *
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
APP.Data = (function() {

  var HN_API_BASE = 'https://hacker-news.firebaseio.com';
  var HN_TOPSTORIES_URL = HN_API_BASE + '/v0/topstories.json';
  var HN_STORYDETAILS_URL = HN_API_BASE + '/v0/item/[ID].json';

  var nextCallbackID = 0;
  var callbacks = {};
  
  var worker = new Worker('scripts/worker.js');
  worker.addEventListener('message', function(e) {
    var callbackID = e.data.callbackID;
    if(callbacks[callbackID]) {
      callbacks[callbackID](e.data.response);
      callbacks[callbackID] = null;
    };
  });

  function getTopStories(callback) {
    request(HN_TOPSTORIES_URL, function(response) {
      callback(response);
    });
  }

  function getStoryById(id, callback) {

    var storyURL = HN_STORYDETAILS_URL.replace(/\[ID\]/, id);

    request(storyURL, function(response) {
      callback(response);
    });
  }

  function getStoryComment(id, callback) {

    var storyCommentURL = HN_STORYDETAILS_URL.replace(/\[ID\]/, id);

    request(storyCommentURL, function(response) {
      callback(response);
    });
  }

  function request(url, callback) {
    var callbackID = nextCallbackID++;
    callbacks[callbackID] = callback;
    worker.postMessage({url: url, callbackID: callbackID});
  }

  return {
    getTopStories: getTopStories,
    getStoryById: getStoryById,
    getStoryComment: getStoryComment
  };

})();
