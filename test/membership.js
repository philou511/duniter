var should   = require('should');
var assert   = require('assert');
var sha1     = require('sha1');
var fs       = require('fs');
var mongoose = require('mongoose');
var server   = require('../app/lib/server');

server.database.init();
var Membership = mongoose.model('Membership');

describe('Membership request', function(){

  describe('JOIN', function(){

    var join;
    var pk = fs.readFileSync(__dirname + "/data/lolcat.pub", "utf8");

    // Loads join with its data
    before(function(done) {
      join = new Membership();
      join.parse(fs.readFileSync(__dirname + '/data/membership/join.0', 'utf8') + fs.readFileSync(__dirname + '/data/membership/join.0.cat.asc', 'utf8'), done);
    });

    it('should be version 1', function(){
      assert.equal(join.version, 1);
    });

    it('should have beta_brousouf currency name', function(){
      assert.equal(join.currency, 'beta_brousouf');
    });

    it('should have JOIN status', function(){
      assert.equal(join.status, "JOIN");
    });

    it('should have basis 0', function(){
      assert.equal(join.basis, 0);
    });

    it('its computed hash should be EE794AB868994AE418D5284BBBA2FD7B5A063F14', function(){
      assert.equal(join.hash, 'EE794AB868994AE418D5284BBBA2FD7B5A063F14');
    });

    it('its manual hash should be EE794AB868994AE418D5284BBBA2FD7B5A063F14', function(){
      assert.equal(sha1(join.getRaw() + join.signature).toUpperCase(), 'EE794AB868994AE418D5284BBBA2FD7B5A063F14');
    });

    it('it should match signature', function(){
      join.verifySignature(pk, function (err, verified) {
        should.not.exist(err);
        should.exist(verified);
        verified.should.be.ok;
      })
    });
  });

  describe('ACTUALIZE', function(){

    var actu;

    // Loads actu with its data
    before(function(done) {
      actu = new Membership();
      actu.loadFromFile(__dirname + "/data/membership/actualize", done);
    });

    it('should be version 1', function(){
      assert.equal(actu.version, 1);
    });

    it('should have beta_brousoufs currency name', function(){
      assert.equal(actu.currency, 'beta_brousoufs');
    });

    it('should have ACTUALIZE status', function(){
      assert.equal(actu.status, "ACTUALIZE");
    });

    it('should have basis 1', function(){
      assert.equal(actu.basis, 1);
    });

    it('its computed hash should be 0B25E92CD102B512B8B1312BBE7B83210176ED46', function(){
      assert.equal(actu.hash, '0B25E92CD102B512B8B1312BBE7B83210176ED46');
    });

    it('its manual hash should be 0B25E92CD102B512B8B1312BBE7B83210176ED46', function(){
      assert.equal(sha1(actu.getRaw()).toUpperCase(), '0B25E92CD102B512B8B1312BBE7B83210176ED46');
    });
  });

  describe('LEAVE', function(){

    var leave;

    // Loads leave with its data
    before(function(done) {
      leave = new Membership();
      leave.loadFromFile(__dirname + "/data/membership/leave", done);
    });

    it('should be version 1', function(){
      assert.equal(leave.version, 1);
    });

    it('should have beta_brousoufs currency name', function(){
      assert.equal(leave.currency, 'beta_brousoufs');
    });

    it('should have LEAVE status', function(){
      assert.equal(leave.status, "LEAVE");
    });

    it('should have basis 2', function(){
      assert.equal(leave.basis, 2);
    });

    it('its computed hash should be 913329BD6D50394DE9B0A024374041049BC4EE6F', function(){
      assert.equal(leave.hash, '913329BD6D50394DE9B0A024374041049BC4EE6F');
    });

    it('its manual hash should be 913329BD6D50394DE9B0A024374041049BC4EE6F', function(){
      assert.equal(sha1(leave.getRaw()).toUpperCase(), '913329BD6D50394DE9B0A024374041049BC4EE6F');
    });

    it('it should be verified', function(){
      var verified = leave.verify('beta_brousoufs');
      verified.should.be.ok;
    });
  });

  describe('BAD-1', function(){

    var bad1;

    // Loads bad1 with its data
    before(function(done) {
      bad1 = new Membership();
      bad1.loadFromFile(__dirname + "/data/membership/bad-1", done);
    });

    it('should be version 1', function(){
      assert.equal(bad1.version, 1);
    });

    it('should have beta_brousoufs currency name', function(){
      assert.equal(bad1.currency, 'beta_brousoufs');
    });

    it('should have LAAF status', function(){
      assert.equal(bad1.status, "LAAF");
    });

    it('should have basis 0', function(){
      assert.equal(bad1.basis, 0);
    });

    it('it should not be verified', function(){
      bad1.verify('beta_brousoufs').should.not.be.ok;
    });
  });
});
