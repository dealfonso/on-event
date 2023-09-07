/**
    MIT License

    Copyright (c) 2023 Carlos de Alfonso (https://github.com/dealfonso)

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

'use strict';

function init(el) {
    // If any attribute starts with on- (e.g. on-click, on-selectboxui-changed, etc.) get the rest and add an event listener
    let handlers = {};
    let nameMap = {};
    for (let attr of el.attributes) {
        if (attr.name.startsWith('on-')) {
            // If the attribute is on-<...>:map, then it's a map of events name; otherwise, it's a handler
            if (attr.name.endsWith(':map')) {
                let event = attr.name.substring(3, attr.name.length - 4);
                let map = attr.value;
                nameMap[event] = map;
            } else {
                let event = attr.name.substring(3);
                handlers[event] = function(e) {
                    return eval(attr.value);
                };
            }
        }
    }
    el.onEvent = {
        _handlers: handlers,
        _map: nameMap,
        _eventName: function(event) {
            if (this.onEvent._map[event] !== undefined) {
                return this.onEvent._map[event];
            }
            return event;
        }.bind(el),
        deactivate: function(event = null) {
            if (event !== null) {
                if (this._handlers[event] !== undefined) {
                    el.removeEventListener(this._eventName(event), this._handlers[event]);
                }
            } else {
                let _eventName = this._eventName;
                Object.keys(handlers).forEach(function(event) {
                    el.removeEventListener(_eventName(event), handlers[event]);
                });
            }
        },
        activate: function(event = null) {
            if (event !== null) {
                if (this.handlers[event] !== undefined) {
                    el.addEventListener(this._eventName(event), handlers[event]);
                }
            } else {
                let _eventName = this._eventName;
                Object.keys(handlers).forEach(function(event) {
                    el.addEventListener(_eventName(event), handlers[event]);
                });
            }
        }        
    }
    el.onEvent.activate();
}

if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll('*').forEach(function(el) {
            init(el);
        });    
    });
}

if (window.$ !== undefined) {
    $.fn.onEvent = function(action, options = null) {
        this.each(function() {
            if (this.onEvent === undefined) {
                init(this);
            }
            if (typeof action === 'string') {
                switch (action) {
                    case 'deactivate':
                        this.onEvent.deactivate(options);
                        break;
                    case 'activate':
                        this.onEvent.activate(options);
                        break;
                    default:
                        console.error('Unknown action: ' + action);
                        break;
                }
            }
        });
        return this;
    };
}

window.onEvent = init;
window.onEvent.version = '0.1.0';
