/***
|''Name:''|emathdisplaymode.js|
|''Author:''|Petri Sallasmaa, Petri Salmela|
|''Description:''|Tool for showing math in displaymode|
|''Version:''|1.0|
|''Date:''|September 19, 2013|
|''License:''|[[GNU Lesser General Public License|http://www.gnu.org/copyleft/lesser.html]]|
|''~CoreVersion:''|2.6.2|
|''Contact:''|pesasa@iki.fi|
|''Dependencies ''|[[DataTiddlerPlugin]]|
|''Documentation:''| |

!!!!!Revisions
<<<
20130919.1021 ''start''
<<<

!!!!!Code
***/
//{{{
/*
 * jquery.emathdisplaymode.js
 * jQuery plugin for displaymode math
 * and TiddlyWiki macro
 *
 * E-Math -project http://emath.eu
 * Petri Salmela
 * License: LGPL 2.0 or later
 *
 */

(function($){
    
    /**
     * emathdisplaymode
     * @param options
     */
    
    $.fn.emathdisplaymode = function(options) {
        
        if (methods[options]){
            return methods[options].apply( this, Array.prototype.slice.call( arguments, 1));
        } else if (typeof(options) === 'object' || !options) {
            return methods.init.apply(this, arguments);
        } else {
            $.error( 'Method ' +  options + ' does not exist on jQuery.emathdisplaymode' );
            return this;
        }
    };
    
    var methods = {
        init: function( options ){
            var settings = $.extend({
                latex: '',
                editable: false
            }, options);

            return this.each(function(){
                var displaymode = new EmDisplaymode(this, settings);
                displaymode.init();
            });
        },
        get: function( options ){
            this.trigger('get_data');
            return this.data('emathdisplaymode_data'); // return the current value
        },
        set: function( options ){
            if (typeof(options) === 'string'){
                this.trigger('set_data', [options]);
            }
        }
    };
    
    var EmDisplaymode = function(place, settings){
        this.inited = false;
        this.place = $(place);
        this.latex = settings.latex;
        this.editable = settings.editable;
    };
    
    EmDisplaymode.prototype.init = function(){
        var mqtype = (this.editable ? 'mathquill-editable' : 'mathquill-embedded-latex');
        var html = '<div class="emathdisplaymode"><span class="emdisplaymode-content '+mqtype+'">'+this.latex+'</span></div>';
        this.html = $(html);
        this.place.html(this.html);
        this.html.find('.mathquill-embedded-latex').mathquill();
        this.html.find('.mathquill-editable').mathquill('editable');
        this.mqcontent = this.html.find('.emdisplaymode-content');
        this.initHandlers();
        if ($('head style#emathdisplaymodecss').length < 1){
            $('head').append('<style type="text/css" id="emathdisplaymodecss">' + this.strings.css + '</style>');
        }
    };
    
    EmDisplaymode.prototype.initHandlers = function(){
        // Init event handlers.
        var displaymode = this;
        this.mqcontent.bind('focusout.displaymode', function(e){
            displaymode.latex = displaymode.mqcontent.mathquill('latex');
            displaymode.changed();
        });
        this.place.bind('get_data', function(e){
            $(this).data('emathdisplaymode_data', displaymode.getData());
        });
        this.place.bind('set_data', function(e, latex){
            displaymode.setData(latex);
        });
        this.place.delegate('.emdisplaymode-content', 'keydown', function(event){
            // When enter key is pressed, trigger 'addnext' event to tell the containing box/app about this.
            // As extra parameters: the type of this element (emathdisplaymode) and the dom-element
            // so that the containing element knows where this happenend an to whom.
            if (event.which === 13 && event) {
                displaymode.place.trigger('addnext', ['emathdisplaymode', displaymode.place]);
                jQuery(this).focusout().blur();
            }
        });
    }
    
    EmDisplaymode.prototype.changeMode = function(iseditmode){
        // Change the edit/view mode
        this.mqcontent.mathquill('revert');
        if (iseditmode) {
            this.mqcontent.removeClass('.mathquill-embedded-latex')
                .addClass('.mathquill-editable')
                .mathquill('editable');
        } else {
            this.mqcontent.removeClass('.mathquill-editable')
                .addClass('.mathquill-embedded-latex')
                .mathquill();
        }
    }
    
    EmDisplaymode.prototype.getData = function(){
        // Return the latex content.
        this.latex = this.mqcontent.mathquill('latex');
        return {latex: this.latex, editable: this.editable};
    }
    
    EmDisplaymode.prototype.setData = function(options){
        // Set the given data.
        if (typeof(options) === 'string') {
            this.latex = latex;
        } else {
            this.latex = options.latex || this.latex;
            if (this.editable !== !!options.editable) {
                this.editable = !!options.editable || this.editable;
                this.changeMode(this.editable)
            }
        }
        this.mqcontent.mathquill('latex', this.latex);
        this.changed();
    }
    
    EmDisplaymode.prototype.changed = function(){
        this.place.trigger('changed');
    }
    
    EmDisplaymode.prototype.strings = {
        css: [
            '.emathdisplaymode {display: block; margin: 0.2em 0; text-align: center;}',
            '.emathdisplaymode .emdisplaymode-content {display: inline-block; text-align: left;}',
            '.emathdisplaymode .emdisplaymode-content.mathquill-editable {border: 1px solid transparent; background-color: #f8f8f8; border-radius: 5px; padding: 0.2em 0.5em; box-shadow: inset 1px 1px 2px rgba(0,0,0,0.5), inset -1px -1px 2px rgba(255,255,255,0.5);}',
            '.emathdisplaymode .emdisplaymode-content.mathquill-editable.hasCursor {box-shadow: inset 1px 1px 2px rgba(0,0,0,0.5), inset -1px -1px 2px rgba(255,255,255,0.5), 0 0 3px 2px #68B4DF;}'
        ].join('\n')
    };
    
})(jQuery)

if (typeof(config) !== 'undefined' && typeof(config.macros) !== 'undefined'){
    // Create macro for TiddlyWiki
    config.macros.emathdisplaymode = {
        /******************************
         * Show emathdisplaymode
         ******************************/
        handler: function (place, macroName, params, wikifier, paramString, tiddler)
        {
            if (params.length < 1){
                wikify('Missing displaymode.', place, null, tiddler);
                return false;
            }
            var displaymodeid = params[0];
            var iseditable = (params[1] === 'edit'|| params[1] === 'authordialog');
            var emtabletext = '{{emathdisplaymodewrapper emathdisplaymode_'+displaymodeid+'{\n}}}';
            wikify(emtabletext, place);
            if (tiddler) {
                var settings = jQuery.extend(true, {}, tiddler.data('emathdisplaymode',{}));
            } else {
                var settings = {};
            }
            settings[displaymodeid] = settings[displaymodeid] || {};
            settings[displaymodeid].editable = iseditable;
            var displaymode = jQuery(place).find('.emathdisplaymodewrapper.emathdisplaymode_'+displaymodeid).last().emathdisplaymode(settings[displaymodeid])
            if (iseditable &&  params[1] !== 'authordialog') {
                displaymode.bind('changed', function(e){
                    var $emdmplace = jQuery(this);
                    var data = $emdmplace.emathdisplaymode('get');
                    var settings = tiddler.data('emathdisplaymode', {});
                    settings[displaymodeid] = data;
                    var autosavestatus = config.options.chkAutoSave;
                    config.options.chkAutoSave = false;
                    tiddler.setData('emathdisplaymode', settings);
                    config.options.chkAutoSave = autosavestatus;
                });
            }
            return true;
            
        }
    }
}
//}}}