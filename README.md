Emathdisplaymode
==============

See the [demo page](http://e-math.github.io/emathdisplaymode).

What?
-----
A tool for creating LaTeX-like displaystyle formulas. Both in view mode
and in editable mode.

How?
----
Emathdisplaymode is a jQuery-plugin and can be embedded on any web page
by including `jquery.emathdisplaymode.js`-file and defining some html-element
as a displaymode element with: `$('#mydiv').emathdisplaymode()`.

Emathdisplaymode depends on external JavaScript libraries:
* MathQuill
* jQuery

Who?
----
The tool was developed in EU-funded [E-Math -project](http://emath.eu) by
* Petri Salmela
* Petri Sallasmaa

and the copyrights are owned by [Four Ferries oy](http://fourferries.fi).

License?
--------
The tool is licensed under [GNU AGPL](http://www.gnu.org/licenses/agpl-3.0.html).
The tool depends on some publicly available open source components with other licenses:
* [jQuery](http://jquery.com) (MIT-license)
* [MathQuill](http://mathquill.com/) (GNU LGPL)



Usage
======
Initing a displaymode
----
Init a new, empty, editable displaymode

```javascript
jQuery('#box').emathdisplaymode({editable: true});
```

Init a new displaymode in editing mode with existing data.

```javascript
jQuery('#box').emathdisplaymode({
     editable: true,
     latex: "2x+4x-8x=-2x"
});
```

Init a new displaymode in view mode with existing data.

```javascript
jQuery('#box').emathdisplaymode({
     editable: false,
     latex: "2x+4x-8x=-2x"
});
```

Getting data from displaymode
-----------------------

Get the data as a JavaScript object from the table in html-element with
id `#box`.

```javascript
var data = jQuery('#box').emathdisplaymode('get');
```

Edit mode
-----------

In edit mode:
* If the content of the input box has changed, when it loses the focus, the tool triggers 'changed'-event, that can be used to trigger saving the data in the containing system (ebook, Moodle, etc.).
* Enter key triggers 'addnext'-event which can be used in containing system for example to add the next element. Enter also unfocuses the input box (and hence triggers 'changed'-event).
