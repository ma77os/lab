(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Main, World;

World = require('./World');

Main = (function() {
  function Main() {
    new World;
  }

  return Main;

})();

new Main;



},{"./World":2}],2:[function(require,module,exports){
var Particle, World;

Particle = require('./assets/Particle');

World = (function() {
  World.prototype.TOTAL_PARTICLES = 50;

  function World() {
    this.setup();
    this.createElements();
    this.render();
  }

  World.prototype.setup = function() {
    var spotLight;
    this.scene = new THREE.Scene;
    this.renderer = new THREE.WebGLRenderer;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.z = 50;
    spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 0, 20);
    spotLight.castShadow = true;
    spotLight.shadowDarkness = 0.7;
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;
    this.scene.add(spotLight);
    return document.body.appendChild(this.renderer.domElement);
  };

  World.prototype.createElements = function() {
    var i, j, ref, results;
    this.container = new THREE.Mesh();
    this.scene.add(this.container);
    this.particles = [];
    results = [];
    for (i = j = 0, ref = this.TOTAL_PARTICLES; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      this.particle = new Particle();
      this.particle.position.x = Math.random() * 20 - 10;
      this.particle.position.y = Math.random() * 20 - 10;
      this.particle.position.z = Math.random() * 20 - 10;
      results.push(this.container.add(this.particle));
    }
    return results;
  };

  World.prototype.render = function() {
    requestAnimationFrame(this.render.bind(this));
    this.container.rotation.y += .01;
    this.container.rotation.x += .01;
    return this.renderer.render(this.scene, this.camera);
  };

  module.exports = World;

  return World;

})();



},{"./assets/Particle":3}],3:[function(require,module,exports){
var Particle,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Particle = (function(superClass) {
  extend(Particle, superClass);

  function Particle() {
    var geometry, material;
    geometry = new THREE.BoxGeometry(2, 2, 2);
    material = new THREE.MeshLambertMaterial({
      color: 0xffffff
    });
    this.castShadow = true;
    this.receiveShadow = true;
    Particle.__super__.constructor.call(this, geometry, material);
    this.rotation.y = Math.random() * Math.PI * 2;
  }

  return Particle;

})(THREE.Mesh);

module.exports = Particle;



},{}]},{},[1]);
