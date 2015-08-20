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

            // parse html
            template = template.replace(/(<.+>)/g,'__template += \'$1\';');
            // parse special html,for {$variable1$}-{$variable2$}
            template = template.replace(/\$}([^{\$]){\$/g,'$}__template += \'$1\';{$');
            // parse syntax
            template = template.replace(/{%(.+)%}/g,'$1');
            // parse varible
            // TODO:<span></span>{$variable$} parse error
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
        /*
         * only support render data
        render:function(templateId, data){
            var template = $('#' + templateId).html(),
                html;

            (function(record){
                html = template.replace(/\${[a-zA-z0-9\$\.\[\]\_]+}/g, function(result){
                    var origin = /\${([a-zA-Z0-9\$\.\[\]\_]+)}/g.exec(result),
                        value = eval("record." + origin[1]);

                    return value !== undefined && value !== null ? value : '';
                });
            })(data);

            return html;
        }   
        */
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
