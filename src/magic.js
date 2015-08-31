(function(window){
    var Magic = function(id){
        // check id
        if(!id) return;

        var dom = document.getElementById(id);

        // check dom
        if(!dom) return;

        this.__template = dom.innerHTML;
    }; 

    Magic.prototype = {
        constructor: Magic,
        __template: '',
        render: function(data){
            var that = this,
                template = that.__template;

            if(!template || template == '') return '';

            // parse line and combine "__template+="
            template = template.replace(/(.+)\n/g,'__template+=\'$1\';\n');
            // process boundary sign, for __template+={for var i=0;i<10;i++}
            template = template.replace(/__template\+=\'\s*{%(.+)%}\s*\'\;/g,'$1');
            // parse varible
            template = template.replace(/{\$([^\$}]+)\$}/g,'\';\n__template += $1;\n__template += \'');

            template = '' + 
                       'with(__data){' +
                       'var __template = \'\';' + 
                       template + 
                       '}' +
                       'return __template';

            var templator = new Function('__data', template);

            return templator(data);
        }
    };

    window.Magic = function(id){
        return new Magic(id);
    };
})(window);

// support amd
if (typeof define === 'function' && define.amd){
    define('magic', [], function(){
		return Magic;
	});
}
