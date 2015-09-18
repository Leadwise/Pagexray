'use strict';

var assert = require('chai').assert,
  util = require('../lib/util'),
  forEach = require('lodash.foreach');

describe('util', function() {

  describe('#getContentType', function() {
    var typeToMimeMapping = {
      'doc': ['text/plain', 'text/html', 'text/html; charset=utf-8'],
      'js': ['text/javascript', 'application/x-javascript; charset=utf-8'],
      'css': ['text/css'],
      'image': ['image/png', 'image/jpg', 'image/gif', 'image/x-icon', 'image/svg+xml', 'image/webp'],
      'font': ['application/font-woff', 'application/font-sfnt', 'application/x-font-opentype',
        'application/x-font-ttf'],
      'flash': ['application/x-shockwave-flash'],
      'unknown': ['application/my-own-type']
    };

    forEach(typeToMimeMapping, function(mimes, type) {
      forEach(mimes, function(mime) {
        it('should categorize ' + mime + ' as ' + type, function() {
          var result = util.getContentType(mime);
          assert.deepEqual(result, type);
        });
      });
    });
  });

  describe('#flattenHeaders', function() {
    // setup a HAR header structure
    var headers = [{
      name: 'header1',
      value: 'value1'
    }, {
      name: 'header2',
      value: 'value2'
    }, {
      name: 'HEADER3',
      value: 'value3'
    } ];


    var myFlattenHeaders = util.flattenHeaders(headers);

    it('the name of the key should be removed when the headers are flatten', function() {
      assert.isUndefined(myFlattenHeaders.name);
    });

    it('the name of the value should be removed when the headers are flatten', function() {
      assert.isUndefined(myFlattenHeaders.value);
    });

    it('all header names should be lowercase when flattend', function() {
      assert.strictEqual(myFlattenHeaders.header3, 'value3');
      assert.isUndefined(myFlattenHeaders.HEADER3);
    });

  });

  describe('#getHostname', function() {

    it('should fetch the domain from a URL with a filename', function() {
      var result = util.getHostname('https://www.sitespeed.io/with/a/path.jsp');
      assert.deepEqual(result, 'www.sitespeed.io');
    });

    it('should fetch the domain from a URL with a query string', function() {
      var result = util.getHostname('https://www.sitespeed.io/with/a/?apa=hepp&apa2=oj');
      assert.deepEqual(result, 'www.sitespeed.io');
    });

    it('should fetch the domain from a URL with #', function() {
      var result = util.getHostname('http://www.sitespeed.io/with/a/?apa=hepp&apa2=oj#yes');
      assert.deepEqual(result, 'www.sitespeed.io');
    });

    it('should fetch the domain from a URL with only the domain', function() {
      var result = util.getHostname('http://www.sitespeed.io');
      assert.deepEqual(result, 'www.sitespeed.io');
    });

    it('should fetch the domain from a URL without a sub domain', function() {
      var result = util.getHostname('http://sitespeed.io');
      assert.deepEqual(result, 'sitespeed.io');
    });

    it('the domain should be empty if it is missing', function() {
      var result = util.getHostname('hoppla');
      assert.deepEqual(result, '');
    });

    it('the domain should be empty if it is undefined', function() {
      var result = util.getHostname();
      assert.deepEqual(result, '');
    });

  });
});
