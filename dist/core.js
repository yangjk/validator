define("#validator/0.8.4/core",["./async","./rule","./utils","./item","#widget/0.9.16/widget","#widget/0.9.16/daparser","#widget/0.9.16/auto-render","#jquery/1.7.2/jquery","#base/0.9.16/base","#base/0.9.16/aspect","#base/0.9.16/attribute","#class/0.9.2/class","#events/0.9.1/events"],function(require,exports,module){function stampItem(item){var set=item.element.attr(DATA_ATTR_NAME);return set||(set=item.cid,item.element.attr(DATA_ATTR_NAME,set)),set}var $=require("#jquery/1.7.2/jquery"),async=require("./async"),Widget=require("#widget/0.9.16/widget"),utils=require("./utils"),Item=require("./item"),validators=[],setterConfig={value:function(){},setter:function(val){return typeof val!="function"?utils.helper(val):val}},Core=Widget.extend({attrs:{triggerType:"blur",checkOnSubmit:!0,stopOnError:!1,autoSubmit:!0,checkNull:!0,onItemValidate:setterConfig,onItemValidated:setterConfig,onFormValidate:setterConfig,onFormValidated:setterConfig,showMessage:setterConfig,hideMessage:setterConfig},setup:function(){this.element.attr("novalidate","novalidate"),this.items=[];var that=this;this.get("checkOnSubmit")&&this.element.submit(function(e){e.preventDefault(),that.execute(function(err){err||that.get("autoSubmit")&&that.element.get(0).submit()})}),this.on("formValidate",function(){var that=this;$.each(this.items,function(i,item){that.query(item.element).get("hideMessage").call(that,null,item.element)})}),this.on("itemValidated",function(err,message,element){err?this.query(element).get("showMessage").call(this,message,element):this.query(element).get("hideMessage").call(this,message,element)}),validators.push(this)},Statics:$.extend({helper:utils.helper},require("./rule"),{autoRender:function(cfg){var validator=new this(cfg);$("input, textarea, select",validator.element).each(function(i,input){input=$(input);var type=input.attr("type");if(type=="button"||type=="submit"||type=="reset")return!0;var options={};type=="radio"||type=="checkbox"?options.element=$("[type="+type+"][name="+input.attr("name")+"]",validator.element):options.element=input;if(!validator.query(options.element)){var obj=utils.parseDom(input);if(!obj.rule)return!0;$.extend(options,obj),validator.addItem(options)}})},query:function(selector){var target=$(selector),result=null;return $.each(validators,function(i,validator){if(target.get(0)==validator.element.get(0))return result=validator,!1;var item=validator.query(target);if(item)return result=item,!1}),result},validate:function(options){var element=$(options.element),validator=new Core({element:element.parents("form")});validator.addItem(options),validator.query(element).execute(),validator.destroy()}}),addItem:function(cfg){var item=new Item($.extend({triggerType:this.get("triggerType"),checkNull:this.get("checkNull"),showMessage:this.get("showMessage"),hideMessage:this.get("hideMessage")},cfg));return this.items.push(item),item.set("_handler",function(){if(!item.get("checkNull")&&!item.element.val())return;item.execute()}),this.element.on(item.get("triggerType"),"["+DATA_ATTR_NAME+"="+stampItem(item)+"]",item.get("_handler")),item.on("all",function(eventName){this.trigger.apply(this,[].slice.call(arguments))},this),this},removeItem:function(selector){var target=selector instanceof Item?selector.element:$(selector),items=this.items,that=this,j;return $.each(this.items,function(i,item){if(target.get(0)==item.element.get(0))return j=i,that.element.off(item.get("triggerType"),"["+DATA_ATTR_NAME+"="+stampItem(item)+"]",item.get("_handler")),item.destroy(),!1}),j!==undefined&&this.items.splice(j,1),this},execute:function(callback){var that=this;this.trigger("formValidate",this.element);var complete=function(err){that.trigger("formValidated",that.element,Boolean(err)),callback&&callback(Boolean(err))};if(this.get("stopOnError")){var tasks={};$.each(this.items,function(i,item){tasks[i]=function(cb){item.execute(cb)}}),async.series(tasks,complete)}else async.forEach(this.items,function(item,cb){item.execute(cb)},complete);return this},destroy:function(){this.element.unbind("submit");var that=this;$.each(this.items,function(i,item){that.removeItem(item)});var j;$.each(validators,function(i,validator){if(validator==this)return j=i,!1}),validators.splice(j,1),Core.superclass.destroy.call(this)},query:function(selector){var target=$(selector);if(target.length==0||$(target,this.element).length==0)return null;var result=null;return $.each(this.items,function(i,item){if(target.get(0)==item.element.get(0))return result=item,!1}),result}}),DATA_ATTR_NAME="data-validator-set";module.exports=Core});