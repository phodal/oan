var bb = bb || {};

/**
 * DOM helpers
 * @namespace bb.dom
 */
bb.dom = new bb.feature({

  /**
   * Creates and returns a new debounced version of the passed function which will postpone its execution until after {wait} milliseconds have elapsed since the last time it was invoked.
   * @param {function}  - Executable function to postpone
   * @param {number} wait - How much time to postpone execution. Omit to execute immediately.
   * @return {function} - Returns a new debounced version of the passed function
   * @member bb.dom
   */
  debounce: function (func, wait) {
    var timeout, self = this;
    return function () {
      var context = self, args = arguments;
      if (wait == null) {
        return func.apply(context, args);
      }
      if (!timeout) {
        timeout = setTimeout(function() {
          timeout = null;
          func.apply(context, args);
        }, wait);
      }
      return timeout;
    };
  },


  /**
   * Finds child element matching provided selector
   * @param {string} selector - Selector has limitations based on the browser support.
   * @param {boolean} all - Flag to find all matching elements. Otherwise fist found element is returned.
   * @return {element|array|undefined} - Found element or array of elements
   */
  find: function(selector, all) {
    if (!this.querySelector) {bb.warn('Find should be used with DOM elements'); return;}
    return all && this.querySelectorAll(selector) || this.querySelector(selector);
  },

  /**
   * Clear node
   * @param {element=} element - Optional element to clear. Otherwise current execution context will be used.
   */
  empty: function (element) {
    element = element || this;
    while (element.firstChild && element.firstChild.parentNode) { element.firstChild.parentNode.removeChild(element.firstChild); }
  },

  /**
   * Fire an event
   * @param {string} name - Event name to fire
   * @param {object=} params - Details to attach
   * @return {object} - Returns created event
   */
  fire: function(name, params) {
    var event = new CustomEvent(name, {detail: params});
    this.dispatchEvent(event);
    return event;
  },

  /**
   * Add event listener
   * @param {string} name - Name of the event to handle
   * @param {function} fn - Event handler
   */
  listen: function(name, fn) { // Can't use "on" becuase it already booked by component
    this.addEventListener(name, fn);
  },

  /**
   * Set or get attribute of an element
   * @param {string} name - Name of the attribute
   * @param {string=} value - Value of the attribute
   */
  attr: function(name, value) {
    if (value === undefined) {
      return this.getAttribute(name);
    }
    this.setAttribute(name, value);
  },

  /**
   * Get the HTML contents of the element or set the HTML contents
   * @param {string=} str - HTML contents
   */
  html: function(str, undefined) {
    if (str === undefined) {
      return this.innerHTML;
    }
    this.innerHTML = str;
  },

  /**
   * Creates a new HTMLElement with provided contents
   * @param {string} html - HTML contents
   * @param {string=} tag - Optional tag of the element to create
   */
  parse: function(html, tag) {
    var el = document.createElement(tag || 'div');
    el.innerHTML = html;
    return el;
  }
});
