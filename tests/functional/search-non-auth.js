/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern',
  'intern!object',
  'intern/chai!assert',
  'require',
  'intern/dojo/node!leadfoot/keys'
], function(intern, registerSuite, assert, require) {
  'use strict';

  var url = function(path) {
    return intern.config.siteRoot + path;
  };

  registerSuite({
    name: 'Search (non-auth)',

    'Pressing g inside of search input *doesnt* go to github issues': function() {
      return this.remote
        // set a short timeout, so we don't have to wait 10 seconds
        // to realize we're not at GitHub.
        .setFindTimeout(50)
        .get(require.toUrl(url('/issues')))
        .findByCssSelector('#js-SearchForm-input').click()
        .type('g')
        .end()
        .findByCssSelector('.repo-container .issues-listing')
        .then(assert.fail, function(err) {
          assert.isTrue(/NoSuchElement/.test(String(err)));
        })
        .end();
    },

    'Results are loaded from the query params': function() {
      var params = '?q=vladvlad';
      return this.remote
        .setFindTimeout(intern.config.wc.pageLoadTimeout)
        .get(require.toUrl(url('/issues') + params))
        .findByCssSelector('.wc-IssueList:nth-of-type(1) a').getVisibleText()
        .then(function(text) {
          assert.include(text, 'vladvlad', 'The search query results show up on the page.');
        })
        .end()
        .getCurrentUrl()
        .then(function(currUrl) {
          assert.include(currUrl, 'q=vladvlad', 'Our params didn\'t go anywhere.');
        })
        .end();
    },

    'Clicking on label search suggestion works': function() {
      return this.remote
        .setFindTimeout(intern.config.wc.pageLoadTimeout)
        .get(require.toUrl(url('/issues')))
        .findByCssSelector('[data-remotename=browser-android]').click()
        .end()
        // click the first suggestion, which is "android"
        .findByCssSelector('.wc-IssueList:nth-child(1) > div:nth-child(2) > span:nth-child(1) > a:nth-child(1)').getVisibleText()
        .then(function(text) {
          assert.include(text, 'android', 'Clicking on a suggested label gets you results.');
        })
        .end();
    },

    'Clicking on label search adds query parameter to the URL': function() {
      return this.remote
        .setFindTimeout(intern.config.wc.pageLoadTimeout)
        .get(require.toUrl(url('/issues')))
        .findByCssSelector('[data-remotename=browser-android]').click()
        .end()
        .getCurrentUrl()
        .then(function(currUrl) {
          assert.include(currUrl, 'q=label%3Abrowser-android', 'Url updated with label name');
        })
        .end();
    },

    'Clicking on label search updates the search input': function() {
      return this.remote
        .setFindTimeout(intern.config.wc.pageLoadTimeout)
        .get(require.toUrl(url('/issues')))
        .findByCssSelector('[data-remotename=browser-android]').click()
        .end()
        .sleep(2000)
        .findById('js-SearchForm-input').getProperty('value')
        .then(function(searchText) {
          assert.include(searchText, 'label:browser-android', 'Url updated with label name');
        })
        .end();
    },

    'Search input is visible': function() {
      return this.remote
        .get(require.toUrl(url('/issues')))
        .findByCssSelector('.js-SearchForm').isDisplayed()
        .then(function(isDisplayed) {
          assert.equal(isDisplayed, true, 'Search input is visible for non-authed users.');
        })
        .end();
    }
  });
});
