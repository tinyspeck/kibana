define(function (require) {
  var angular = require('angular');
  var _ = require('lodash');
  var sinon = require('sinon/sinon');
  var $ = require('jquery');

  require('components/clipboard/clipboard');

  describe('Clipboard directive', function () {

    var $scope, $rootScope, $compile, $interpolate, el, tips;

    beforeEach(function (done) {
      // load the application
      module('kibana');

      inject(function (_$rootScope_, _$compile_, _$interpolate_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $interpolate = _$interpolate_;
        $rootScope.text = 'foo';

        el = $compile('<kbn-clipboard copy="text"></kbn-clipboard>')($rootScope);

        $scope = el.scope();
        $scope.$digest();

        done();
      });

    });

    it('should contain an element with clip-copy', function () {
      var clip = el.find('[clip-copy]');
      expect(clip).to.have.length(1);
    });

    it('should have a tooltip', function () {
      var clip = el.find('[tooltip]');
      expect(clip).to.have.length(1);

      var clipText = $interpolate($(clip).attr('tooltip'))();
      expect(clipText).to.be('Copy to clipboard');

    });

    it('should change the tooltip text when clicked, back when mouse leaves', function () {
      el.mouseenter();
      el.click();
      $scope.$digest();

      var clipText = $interpolate($('[tooltip]', el).attr('tooltip'))();
      expect(clipText).to.be('Copied!');

      el.mouseleave();
      $scope.$digest();

      clipText = $interpolate($('[tooltip]', el).attr('tooltip'))();
      expect(clipText).to.be('Copy to clipboard');
    });

    it('should unbind all handlers on destroy', function () {
      var handlers = $._data(el.get(0), 'events');
      expect(Object.keys(handlers)).to.have.length(2);

      $scope.$destroy();
      expect(Object.keys(handlers)).to.have.length(0);
    });

  });
});