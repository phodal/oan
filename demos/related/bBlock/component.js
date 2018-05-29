'use strict';
/**
 * Library building blocks
 * @namespace
 * @version 0.1.2
 */
var bb = bb || {};

(function(bb) {
  /**
   * Utils can be used to control how we create components
   * @namespace
   * @memberof bb
   *
   */
  var utils =  {

    classCallCheck: function(instance, Constructor) {if (!(instance instanceof Constructor)) { throw "Cannot call a class as a function"; }},
    possibleConstructorReturn: function(self, call) {if (!self) { throw "this hasn't been initialised - super() hasn't been called"; } return call && (typeof call === "object" || typeof call === "function") ? call : self; },
    inherits: function(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw "Super expression must either be null or a function, not " + typeof superClass; } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; },

    /**
     * Adds an event handler to a componet
     * @param {object} obj - Target object
     * @param {string} eventType - Name of the event
     * @param {function} eventHandler - Event handler
     * @return {object} - Object with a list of defined event handlers
     */
    addCustomEvent: function (obj, eventType, eventHandler) {
      if (!obj.eventHandlers) { obj.eventHandlers = {}; }
      if (!obj.eventHandlers[eventType]) {
        obj.eventHandlers[eventType] = [];
      }
      if (eventHandler) {
        obj.eventHandlers[eventType].push(eventHandler);
      }
      return obj.eventHandlers[eventType];
    },

    /**
     * Register custom element in the DOM using spec v0
     * @param {function} [HTMLElement] prarentClass - Constructor or class of the element
     * @param {string} isWhat - Name for the component. Could be used as tag name or "is" attribute
     * @param {string=} tag - Tag name of the element. Required when extending native elements
     * @param {object|array} feature - One or more features to have
     * @return {function} - Constructor of registered element
     */
    registerElement: function(parentClass, isWhat, tag, features) {	// v0 spec implementation using https://github.com/WebReflection/document-register-element

      var elementClass = Object.create(parentClass.prototype);

      // Clone event handlers
      if (elementClass.eventHandlers) {
        var clonedHandlers = {};
        for (var i in elementClass.eventHandlers) {
          var handlers = elementClass.eventHandlers[i];
          clonedHandlers[i] = handlers.slice(0); // Clone array of listeners;
        }
        elementClass.eventHandlers = clonedHandlers;
      }

      // Lifecycle
      elementClass.createdCallback = function () {
        // Add event listeners
        for (var i in this.eventHandlers) {
          var event = new CustomEvent(i);
          for (var j in this.eventHandlers[i]) {
            this.addEventListener(event.type, this.eventHandlers[i][j]);
          }
        }

        // Trigger create
        var event = new CustomEvent('create');
        this.dispatchEvent(event);
      };
      elementClass.attachedCallback = function () {
        var event = new CustomEvent('attach');
        this.dispatchEvent(event);
      };
      elementClass.detachedCallback = function () {
        var event = new CustomEvent('detach');
        this.dispatchEvent(event);
      };
      elementClass.attributeChangedCallback = function (attributeName) {
        var event = new CustomEvent('attributeChange', { detail: { attributeName: attributeName } });
        this.dispatchEvent(event);
      };

      // Attach features
      if (features) {
        if (!features.length) { // Can't use Array.isArray
          features = [features];
        }
        for (var i=0;i<features.length;i++) {
          utils.addFeature(elementClass, features[i]);
        }
      }

      var params = {
        prototype: elementClass
      };

      if (tag) {
        params.extends = tag;
      }
      var elementConstructor = document.registerElement(isWhat, params); // v0 syntax

      return elementConstructor;
    },

    /**
     * Define custom element in the DOM using spec v1
     * @param {function=} prarentClass [HTMLElement] - Constructor or class of an element to be extended
     * @param {string} isWhat - Name for the component. Could be used as tag name or "is" attribute
     * @param {string=} tag - Tag name of the element. Required when extending native elements
     * @param {object|array} feature - One or more features to have
     * @return {function} - Constructor of registered element
     */
    defineElement: function(parentClass, isWhat, tag, features) {
      var params, attributesToObserve = [];
      var elementClass = function (_parentClass) {
        utils.inherits(elementClass, _parentClass);

        // Clone event handlers
        if (_parentClass.prototype.eventHandlers) {
          var clonedHandlers = {};
          for (var i in _parentClass.prototype.eventHandlers) {
            var handlers = _parentClass.prototype.eventHandlers[i];
            clonedHandlers[i] = handlers.slice(0); // Clone array of listeners;
          }
          elementClass.prototype.eventHandlers = clonedHandlers;
        }

        function elementClass(self) {
          var _this;

          utils.classCallCheck(this, elementClass);

          var self = (_this = utils.possibleConstructorReturn(this, (elementClass.__proto__ || Object.getPrototypeOf(elementClass)).call(this, self)), _this);

          // Add event listeners

          for (var i in self.eventHandlers) {
            var event = new CustomEvent(i);
            for (var j in self.eventHandlers[i]) {
              self.addEventListener(event.type, self.eventHandlers[i][j]);
            }
          }

          // Trigger create
          var event = new CustomEvent('create');
          self.dispatchEvent(event);
          if (typeof self.createdCallback == 'function') {
            self.createdCallback();
          }

          return self;
        }



        return elementClass;
      }(parentClass);


      // Lifecycle callbacks
      elementClass.prototype.connectedCallback = function () {
        var event = new CustomEvent('attach');
        this.dispatchEvent(event);
      };
      elementClass.prototype.adoptedCallback = function () {
        var event = new CustomEvent('adapt');
        this.dispatchEvent(event);
      };
      elementClass.prototype.disconnectedCallback = function () {
        var event = new CustomEvent('detach');
        this.dispatchEvent(event);
      };
      elementClass.prototype.attributeChangedCallback = function (attributeName, oldValue, newValue, namespace) {
        var event = new CustomEvent('attributeChange', { detail: { attributeName: attributeName, oldValue: oldValue, newValue: newValue, namespace: namespace } });
        this.dispatchEvent(event);
      };

      // Add features
      if (features) {
        if (!features.length) {
          features = [features];
        }
        for (var i in features) {
          utils.addFeature(elementClass.prototype, features[i]);
        }
      }

      // Handle observed attributes
      if (elementClass.prototype.observedAttributesList) {
        var descriptor = {
          key: 'observedAttributes',
          get: function get() {
            return elementClass.prototype.observedAttributesList;
          }
        };
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(elementClass, descriptor.key, descriptor);
      }

      if (tag) {
        params = { extends: tag };
      }

      customElements.define(isWhat, elementClass, params);
      return elementClass;
    },

    /**
     * Adds a feature to the component
     * @param {object} obj - Target object. Usually a prototype of a component. Properties "on", "define", "observedAttribute" will be stacked.
     */
    addFeature: function (obj, properties) {
      var events, propertyDescriptors, i;
      if (!properties) { return; }

      // Clone events
      if (properties.on) {
        events = Object.assign({}, properties.on);
      }

      Object.assign(obj, properties); // IE11 need a polyfill

      // Handle events
      if (events) {
        for (i in events) {
          this.addCustomEvent(obj, i, events[i]);
        }
        delete obj.on;
      }

      // Handle observed attributes
      if (properties.observedAttributes) {
        if (!obj.observedAttributesList) {
          obj.observedAttributesList = [];
        }
        Array.prototype.push.apply(obj.observedAttributesList,properties.observedAttributes);
      }

      // Handle properties getters and setters
      if (properties.define) {
        propertyDescriptors = Object.assign({}, properties.define);
        Object.defineProperties(obj, propertyDescriptors);
      }
    },

    /**
     * Displays warnining message in console of the browser.
     * @param {any} [...] One or more things to display
     *
     */
    warn: function() {
      var args = Array.prototype.slice.call(arguments);
      console.warn.apply(null,args);
    }
  }

  /**
   * Define a component and register in the DOM
   * @memberof bb
   * @param {object} [...] One or more features to have in the component. Features will be mixed. At least one of the features needs to have "is" proeprty defined.
   * @return {function} Constructor for elements
   */
  var component = function() {
    'use strict';
    var features = arguments;

    if (!features.length) {
      return;
    }

    // Detect isWhat, tag and parent class
    var props = feature.apply(null, arguments);
    var isWhat = props.is;
    var tag = props.tag;
    var parentClass = props.extends;

    if (!parentClass) {parentClass = HTMLElement;}
    if (tag && !isWhat) {isWhat = tag; tag = null;};
    if (!tag && !isWhat) {utils.warn('Name not specified'); return;}
    if (props.polyfill == 'v0') {
      return utils.registerElement(parentClass, isWhat, tag, arguments);
    } else {
      return utils.defineElement(parentClass, isWhat, tag, arguments);
    }

  }


  /**
   * Created a feature from one or more objects
   * @constructor
   * @memberof bb
   * @param {object} [...]
   * @return {object} Created feature. Each feature could have special properties like "is", "tag", "extends", "observedAttributes", "on", "define" used to define components
   */
  var feature = function() {
    'use strict';
    var self = this || {};
    if (arguments.length) {
      for (var i = 0; i<arguments.length; i++) {
        if (typeof arguments[i] != 'object') {utils.warn('Expected object in argument #' + i); continue;}
        Object.assign(self, arguments[i]);
      }
    }
    return self;
  };
  Object.assign(feature.prototype, {
    is: null,
    tag: null,
    extends: null,
    define: null,
    on: null,
    observedAttributes: null,
  });

  bb.component = component;
  bb.feature = feature;
  bb.utils = utils;
})(bb);
