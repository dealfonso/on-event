# Inline Event Handlers (on-event)

This library enables the possibility of using `on-<event-handler>` attributes in HTML tags for any event handler. It is possible to use common events (e.g. `click`, `mouseover`, etc.), but this is of special interest when adding event handlers for custom events or events that have no attribute equivalence in the HTML tags.

While it is not well seen using inline event handlers in HTML tags, sometimes it is the easiest way to do something and a more readable method. For example, if you want to show an alert when the custom event `my-event` is triggered, you would need to do something like this:

```html
<img src="https://picsum.photos/400/200" class="mx-auto">
```

```javascript
document.querySelector('img').addEventListener('my-event', function() {
    alert('my-event');
});
```

Using this library, you can do the same using the following code:

```html
<img src="https://picsum.photos/400/200" class="mx-auto" on-my-event="alert('my-event')">
```

## Key features

### In-line event handlers for custom events

The more important benefit is when you have custom events or events that have no attribute equivalence in the HTML tags that this library is useful. For example, if you want to show an alert when a bootstrap dialog is hidden, you would need to do something like this:

```html
<div class="modal fade">
    ...
</div>
```
```javascript
$('#myModal').on('hidden.bs.modal', function () {
    alert('hidden');
});
```

That forces to use JavaScript code to add the event handler. Using this library, you can do the same using the following code:

```html
<div class="modal fade" on-hidden.bs.modal="alert('hidden')">
    ...
</div>
```

### Avoid the need to add an unnecessary ID to the element

Many times you need to add an ID to an element just to add an event handler. For example, if you want to call a function when a button is clicked, you would need to do something like this:

```html
<button id="myButton">Click me</button>
```
```javascript
document.querySelector('#myButton').addEventListener('click', function() {
    alert('clicked');
});
```

This implies that we needed to add the `myButton` id to a button, while it is not necessary for anything else. Using inline handlers, that fictitious `id` will not be needed. Using this library, you can do the same using the following code:

```html
<button on-click="alert('clicked')">Click me</button>
```

### Activate/Deactivate event handlers

Another advantage of this library is that it allows you to activate/deactivate the event handlers for an element. This is useful when you want to disable some functionality temporarily. For example, if you want to disable the click event handler for an image, you can do it using the following code:

```javascript
document.querySelector('img').onEvent.deactivate('click');
(...)
document.querySelector('img').onEvent.activate('click');
```

## Usage

To use the library, you just need to include the `on-event.js` file in your Web page. You can download it from the [GitHub repository](https://github.com/dealfonso/on-event) or get it from the CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/dealfonso/on-event@1/dist/on-event.min.js"></script>
```

### Declarative HTML Version

The declarative version is the easiest way to use the library. Moreover, this is the reason for this library. You just need to add the `on-<event-name>` attribute to the element that you want to add an event handler. For example:

```html
<img src="https://picsum.photos/400/200" class="mx-auto" on-click="alert('clicked')">
```

Will be equivalent to the following JavaScript code:

```javascript
document.querySelector('img').addEventListener('click', function() {
    alert('clicked');
});
```

### JavaScript

The library adds the `onEvent` property to the `Element` prototype. This property is an object that contains the following methods:

* `activate(eventName = null)`: Activates the event handlers for the selected element (only those added using this library).
* `deactivate(eventName = null)`: Deactivates the event handlers for the selected element (only those added using this library).

For example:

```javascript
document.querySelector('img').onEvent.activate();
```

If the `eventName` parameter is not specified, all the event handlers will be activated/deactivated. Otherwise, only the event handlers for the specified event will be activated/deactivated.

This will only affect those handlers added using `on-<event-name>` attributes.

### jQuery Version

The library also includes a plugin for jQuery, if it is available. This plugin adds the `onEvent` method to the jQuery object with the following options:

* `onEvent("activate", eventName)`: Activates the event handlers for the selected elements (only those added using this library).
* `onEvent("deactivate", eventName)`: Deactivates the event handlers for the selected elements (only those added using this library).

For example:

```javascript
$('img').onEvent('activate');
```

If the `eventName` parameter is not specified, all the event handlers will be activated/deactivated. Otherwise, only the event handlers for the specified event will be activated/deactivated.

This will only affect those handlers added using `on-<event-name>` attributes.

## Advanced usage

Luckily, most event names are in lowercase and can be used directly in the `on-<event-name>` attribute. However, some event names are not in lowercase or have some special characters. One noticeable case is the well-known `DOMContentLoaded` event. 

If you know about javascript programming, the attribute names of the HTMLElements always arrive to the application in lowercase. So event if we write `on-DOMContentLoaded`, the attribute name will be `on-domcontentloaded`. 

In these cases, you can use the `on-<event-name>:map` attribute to provide the real event name. For example:

```html
<img src="https://picsum.photos/400/200" class="mx-auto" on-DOMContentLoaded:map="DOMContentLoaded" on-DOMContentLoaded="alert('DOMContentLoaded')">
```

Will be equivalent to the following JavaScript code:

```javascript
document.querySelector('img').addEventListener('DOMContentLoaded', function() {
    alert('DOMContentLoaded');
});
```

__(*)__ This is a fictitious case because the `DOMContentLoaded` event is not available for the `img` element. But this is just an example to show the reasoning behind the `on-<event-name>:map` attribute.