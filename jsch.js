"use strict";

// TODO:
/*
  
  more todos:
  - implement $ref
  - soft-validations in Element Class. That means validate and change the html class of the domroot, of invalid, but don't prevent
  
*/

(function(exports){
  var INVALIDCOLOR = "#ffaaaa";
  
  var createAddon = function(name){
    var elem = document.createElement("span");
    $(elem).addClass("input-group-addon").append(name);
    return elem;
  };
	var setAttributes = function(elem, opts){
		var hash;
		for (hash in opts) {
  		elem.setAttribute(hash, opts[hash]);
		}
	};
  var createEnum = function(title, enums, target){
    var root = document.createElement("div");
    var $root = $(root).addClass("input-group-btn");
    
    
    $root.append('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+title+' <span class="caret"></span></button>');
    
    var ul = document.createElement("ul");
    setAttributes(ul, {class:"dropdown-menu", role:"menu"});
    var $ul = $(ul);
    $root.append(ul);
    
    var i, tmpLi, tmpA;
    for(i=0; i<enums.length; i++) {
      tmpA = document.createElement("a");
      $(tmpA)
        .on("click", function(){target.value=$(this).text();})
        .text(enums[i]);
      tmpLi = document.createElement("li");
      tmpLi.appendChild(tmpA);
      ul.appendChild(tmpLi);
    }
    
    
    return root;
  };

  var createNull = function(doms, element){
    var btn = document.createElement("a");
    var $btn = $(btn);
    var content = document.createElement("div");
    
    $(content).addClass("tab-pane jsch-type jsch-type-null").append('<h4>Null</h4><p>This key is null...</p>');
    
    $btn.text("Null");
    if(!element.getJsonSchema().type || element.getJsonSchema().type.indexOf("null")>=0) {
    
      $(doms.typeList).append($(document.createElement("li")).append(btn));
    
      $btn.on("click", function(){
        $(doms.typeList).children().removeClass("active");
        $(btn.parentNode).addClass("active");
        element.domElements.type.value="null";
        
        $(doms.typeContent).children().hide().removeClass("active");
        $(content).show();
      });
    } else {
      $(doms.typeList).append($(document.createElement("li")).addClass("disabled").append(btn));
    }
    $(doms.typeContent).append(content);
  };
  var createString = function(doms, element){
    var elem = element.domElements.types.string;

    
    var btn = document.createElement("a");
    var content = document.createElement("div");
    
    $(content).addClass("tab-pane jsch-type jsch-type-string").append('<h4>String value</h4>');
    
    var inputGroup = document.createElement("div");
    inputGroup.setAttribute("class", "input-group");
    if(element.getJsonSchema().pattern) inputGroup.appendChild(createAddon("RegExpr"));
    if(element.getJsonSchema().minLength) inputGroup.appendChild(createAddon("n &ge; "+element.getJsonSchema().minLength));
    if(element.getJsonSchema().maxLength) inputGroup.appendChild(createAddon("n &le; "+element.getJsonSchema().maxLength));
    if(element.getJsonSchema().format) {
      switch (element.getJsonSchema().format) {
        case "email":
          inputGroup.appendChild(createAddon("@"));
          break;
        case "uri":
          inputGroup.appendChild(createAddon("proto://"));
          break;
        case "ipv4":
          inputGroup.appendChild(createAddon("ip"));
          break;
        case "date-time":
        case "hostname":
        case "ipv6":
        default:
          inputGroup.appendChild(createAddon(element.getJsonSchema().format));
      }
    }
    if(!element.getJsonSchema().format && !element.getJsonSchema().minLength && !element.getJsonSchema().maxLength && !element.getJsonSchema().pattern) {
      inputGroup.appendChild(createAddon("*"));
    }
    $(elem).addClass("form-control");
    inputGroup.appendChild(elem);
    
    $(content).append(inputGroup);
    
    var $btn = $(btn);
    $btn.text("String");
    if(!element.getJsonSchema().type || element.getJsonSchema().type.indexOf("string")>=0) {
    
      $(doms.typeList).append($(document.createElement("li")).append(btn));
    
      $btn.on("click", function(){
        $(doms.typeList).children().removeClass("active");
        $(btn.parentNode).addClass("active");
        element.domElements.type.value="string";
        
        $(doms.typeContent).children().hide().removeClass("active");
        $(content).show();
      });
    } else {
      $(doms.typeList).append($(document.createElement("li")).addClass("disabled").append(btn));
    }
    $(doms.typeContent).append(content);
  };
  var createNumber = function(doms, element){
    var elem = element.domElements.types.number;
    
    var btn = document.createElement("a");
    var content = document.createElement("div");
    
    $(content).addClass("tab-pane jsch-type jsch-type-number").append('<h4>Number value</h4>');
    
    var inputGroup = document.createElement("div");
    inputGroup.setAttribute("class", "input-group");
    
    if(element.getJsonSchema().multipleOf) inputGroup.appendChild(createAddon(element.getJsonSchema().multipleOf+" | x"));
    else if(element.getJsonSchema().type === "integer") inputGroup.appendChild(createAddon("1 | x"));
    
    if(element.getJsonSchema().minLength) {
      if(element.getJsonSchema().exclusiveMinimum) inputGroup.appendChild(createAddon("&gt; "+element.getJsonSchema().minLength));
      else inputGroup.appendChild(createAddon("&ge; "+element.getJsonSchema().minLength));
    }
    
    if(element.getJsonSchema().maxLength) {
      if(element.getJsonSchema().exclusiveMaximum) inputGroup.appendChild(createAddon("&lt; "+element.getJsonSchema().maxLength));
      else inputGroup.appendChild(createAddon("&le; "+element.getJsonSchema().maxLength));
    }
    if(!element.getJsonSchema().maxLength && !element.getJsonSchema().minLength && !element.getJsonSchema().multipleOf && element.getJsonSchema().type !== "integer") inputGroup.appendChild(createAddon("*"));
    $(elem).addClass("form-control");
    inputGroup.appendChild(elem);
    
    $(content).append(inputGroup);
    
    
    var $btn = $(btn);
    $btn.text("Number");
    if(!element.getJsonSchema().type || element.getJsonSchema().type.indexOf("number")>=0 || element.getJsonSchema().type.indexOf("integer")>=0) {
    
      $(doms.typeList).append($(document.createElement("li")).append(btn));
    
      $btn.on("click", function(){
        $(doms.typeList).children().removeClass("active");
        $(btn.parentNode).addClass("active");
        element.domElements.type.value="number";
        
        $(doms.typeContent).children().hide().removeClass("active");
        $(content).show();
      });
    } else {
      $(doms.typeList).append($(document.createElement("li")).addClass("disabled").append(btn));
    }
    $(doms.typeContent).append(content);
  };
  var createObject = function(doms, element){
    var findSubSchema = function(name){
      var oldSchema = element.getJsonSchema();
      if(oldSchema.properties && oldSchema.properties[name]) return oldSchema.properties[name];
      
      var hash;
      for(hash in oldSchema.patternProperties) {
        if((new RegExp(hash)).test(name)) return oldSchema.patternProperties[hash];
      }
      return {};
    };
    var validPropertyName = function(name){
      var oldSchema = element.getJsonSchema();
      if(oldSchema.additionalProperties !== false) return true;
      if(oldSchema.properties && oldSchema.properties[name]) return true;
      
      var hash;
      for(hash in oldSchema.patternProperties) {
        if((new RegExp(hash)).test(name)) return true;
      }
      return false;
    };
    
    var addSubElement = function(name, value){ // TODO: If patternProperties and not additionalProperties, test for validity first, before creating
      if(element.domElements.types.object.jschProperties[name]) return;
      if(!validPropertyName(name)) return; // TODO: alert(invalid)
      var subSchema = findSubSchema(name);
console.log(element.Jsch);
      var tmp = new Element({parent: element, value: value, Jsch:element.Jsch, jsonSchema: subSchema}); // TODO: remove value
      element.domElements.types.object.jschProperties[name] = tmp;
      var li = document.createElement("li");
      var title = document.createElement("h5");
      var removeBtn = document.createElement("button");
      $(removeBtn)
        .text("remove")
        .addClass("btn btn-danger")
        .on("click", function(){
          removeSubElement(name);
        });
      
      var hidden = document.createElement("span");
      $(hidden).text("collapsed").addClass("label label-default").hide();
      
      $(title).text(name).on("click", function(){$([tmp.domElements.root, hidden]).toggle()});
      $(li).append(title, removeBtn, hidden, tmp.domElements.root);
      
      $elem.append(li);
      
      
    };
    var removeSubElement = function(name){
      element.domElements.types.object.jschProperties[name].domElements.root.parentNode.parentNode.removeChild(element.domElements.types.object.jschProperties[name].domElements.root.parentNode);
      delete element.domElements.types.object.jschProperties[name];      
      
    };
    
    var elem = element.domElements.types.object;
    var $elem = $(elem);
    var btn = document.createElement("a");
    var content = document.createElement("div");
    
    $(content).addClass("tab-pane jsch-type jsch-type-object").append('<h4>Object Infos</h4>');
    
    $(content).append('<h4>Create new property</h4>');
    var inputGroup = document.createElement("div");
    inputGroup.setAttribute("class", "input-group");
    
    if(element.getJsonSchema().patternProperties) inputGroup.appendChild(createAddon("RegExpr"));
    var newKeyName = document.createElement("input");
    setAttributes(newKeyName, {type: "text", class:"form-control", placeholder: "new key name", alt: "The key-name for the new element"});
    
    
    var createKeyBtn = document.createElement("button");
    $(createKeyBtn)
      .text("create")
      .addClass("form-control")
      .on("click", function(){addSubElement(newKeyName.value)});
    
    if(element.getJsonSchema().properties) {
      var hash;
      var properties = [];
      for (hash in element.getJsonSchema().properties) {
        properties.push(hash);
      }
      inputGroup.appendChild(createEnum("predefined types", properties, newKeyName));
    }
    if(element.getJsonSchema().additionalProperties !== false) inputGroup.appendChild(createAddon("*"));
    if(element.getJsonSchema().additionalProperties === false && !element.getJsonSchema().patternProperties) $(newKeyName).attr("disabled", "disabled")
    inputGroup.appendChild(newKeyName);
    
    $(newKeyName).on("input", function(){
      if(validPropertyName(newKeyName.value)) newKeyName.style.backgroundColor = "";
      else newKeyName.style.backgroundColor = INVALIDCOLORß;
    });
    
    
    
    $(content).append([inputGroup, createKeyBtn, elem]);
    
    var $btn = $(btn);
    $btn.text("Object");
    if(!element.getJsonSchema().type || element.getJsonSchema().type.indexOf("object")>=0) {
    
      $(doms.typeList).append($(document.createElement("li")).append(btn));
    
      $btn.on("click", function(){
        $(doms.typeList).children().removeClass("active");
        $(btn.parentNode).addClass("active");
        element.domElements.type.value="object";
        
        $(doms.typeContent).children().hide().removeClass("active");
        $(content).show();
      });
    } else {
      $(doms.typeList).append($(document.createElement("li")).addClass("disabled").append(btn));
    }
    $(doms.typeContent).append(content);
  };
  
  
  var defaultView = function(elem) {
    var $root = $(elem.domElements.root);
    
    var schema = elem.getJsonSchema();
    
    elem.domElements.root.refresh = function(){
      var type = elem.domElements.type.value.toLowerCase();
      $root.find(".jsch-type").hide();
      $root.find(".jsch-type-"+type).show();
      
      // if(type === "object") { setValue to known properties, delete no longer existing properties and create new ones.}
      // if(type === "array") {}
    };
    
    var elements = {};
    $root.addClass("panel").addClass("panel-default");
    
    // Header
    var $header = $(elements.panelHeader = document.createElement("div")).addClass("panel-heading");
    
      // id
    $header.append($(document.createElement("h5")).attr("style", "float:right;").append($(elements.schemaId = document.createElement("span")).text(schema.id || "(none)")));
    
      // title
    elements.title = document.createElement('h3');
    if(schema.title) $header.append($(elements.title).text(schema.title));
    
      // description
    elements.description = document.createElement("p");
    if(schema.description) $header.append($(elements.description).text(schema.description));
    $(elements.schemaId = document.createElement("h5")).addClass("panel-heading");
    // TODO: Validations!
    
    $root.append($header);
    
    // Body
    var $body = $(elements.panelBody = document.createElement("div")).addClass("panel-body");
    $body.append($(elements.typeList = document.createElement("ul")).attr("role", "tablist").addClass("nav nav-tabs jsch-types"));
    $body.append($(elements.typeContent = document.createElement("div")).addClass("tab-content jsch-types-content"));
    
    createObject(elements, elem);
    createString(elements, elem);
    createNumber(elements, elem);
    createNull(elements, elem);
    
    $root.append($body);
    
    
    
  };
  
  var Element = function(opts){
  	//# Error handling
  	if(!opts.Jsch) throw new Error("Don't have a handle for the main Jsch controller");
  	var self = this;
  
  	//# private constants and variables
  	var schema = opts.jsonSchema || opts.Jsch.getJsonSchema();
  
  	//# private functions and objects
    
  	
  	
  	//# constructor
  	
  	// create DOM Elements
  	this.domElements = {
  		root: document.createElement("div"),
  		type: document.createElement("input"),
  		types: {
    		string: document.createElement("input"),
    		number: document.createElement("input"),
    		boolean: document.createElement("input"),
    		//null,
    		array: document.createElement("ol"),
    		object: document.createElement("ul")
  		}
  	};
  	// Configure DOM-Elements
  	setAttributes(this.domElements.root, {class: "jsch-element"}); // TODO: jsch-data-valid
  	setAttributes(this.domElements.types.string, {type: "text", class: "jsch-data jsch-data-string"}); // TODO: jsch-data-valid
  	setAttributes(this.domElements.types.number, {type: "number", class: "jsch-data jsch-data-number"}); // TODO: jsch-data-valid
  	setAttributes(this.domElements.types.boolean, {type: "checkbox", class: "jsch-data jsch-data-boolean"}); // TODO: jsch-data-valid
  	setAttributes(this.domElements.types.array, {class: "jsch-data jsch-data-array"}); // TODO: jsch-data-valid
  	this.domElements.types.array.jschItems = [];
  	setAttributes(this.domElements.types.object, {class: "jsch-data jsch-data-object"}); // TODO: jsch-data-valid
  	this.domElements.types.object.jschProperties = {};
  	setAttributes(this.domElements.type, {type:"hidden"}); // TODO: jsch-data-valid
  	
  	//if(this.schema.id)
  	
  	this.getValue = function(){
  	  if(!this.domElements.type.value) return;
  	  
  	  var val = this.domElements.type.value.toLowerCase();
  	  var rv;
  		switch(val) {
    		case "object":
    		  var obj = this.domElements.types.object.jschProperties;
    		  var tmp = {};
    		  for (rv in obj) {
      		  tmp[rv] = obj[rv].getValue();
    		  }
    		  return tmp;
    		case "array":
    		  return ["// TODO: implement Arrays"];
    		case "number":
    		  return parseFloat(this.domElements.types.number.value);
    		case "null":
    		  return null;
    		case "boolean":
    		  return this.domElements.types.boolean.checked;
    		default:
    		  return this.domElements.types[val] && this.domElements.types[val].value;
  		}
  	};
  	this.setValue = function(val){
  	  if(val === null) {
    	  this.domElements.type.value = "null";
    	  if(this.domElements.root.refresh) this.domElements.root.refresh();
    	  return 
  	  }
  	  var type = typeof val;
    	switch (type) {
      	case "string":
      	  this.domElements.types.string.value = val;
      	  this.domElements.type.value = "string";
      	  break;
      	case "number":
      	  this.domElements.types.number.value = val;
      	  this.domElements.type.value = "number";
      	  break;
      	case "boolean":
      	  this.domElements.types.number.checked = val;
      	  this.domElements.type.value = "boolean";
      	  break;
      	case "object":
    		  var obj = this.domElements.types.object.jschProperties;
    		  var hash;
    		  for(hash in val) {
      		  obj[hash] = new Element({parent:this, value: obj[hash], Jsch: self.Jsch});
    		  }
      	  this.domElements.type.value = "object";
      	  break;
    	}
    	if(this.domElements.root.refresh) this.domElements.root.refresh();
  	};
    this.Jsch = opts.Jsch;
  	this.setSchema = this.setJsonSchema = this.setJSONSchema = function(val){schema = val;};
  	this.getSchema = this.getJsonSchema = this.getJSONSchema = function(){return schema;};
  	
  	defaultView(this);
  	
  	
  	
  	 
  };

  var Jsch = function(opts){
  	//# Error handling
  	//if() throw new Error();
  
  	//# private constants and variables
  	var self = this;
  	var views = {};
  
  	//# private functions and objects
  	var jsonSchema = opts.jsonSchema || {};
  	
  
  	//# constructor
  	this.getJsonSchema = function(){return opts.jsonSchema || {};};
  	this.getData = function(){
    	return first.getData();
  	};
  	this.setData = function(data){
    	return first.setData(data);
  	};
  	
  	this.domElements = {
    	root: document.createElement("div")
  	};
  	$(this.domElements.root).addClass("jsch-root");
  	this.addView = function(id, renderFn){
    	
  	};
  	this.removeView = function(id, renderFn){
    	
  	};
  	this.renderView = function(id,  data ){};
  	
  	var first = new Element({Jsch: self});
  	opts.data = opts.data || null;
  	first.setValue(opts.data);
  	this.first = first;
  	$(this.domElements.root).append(first.domElements.root);
  	 
  };
  
  exports.Jsch = Jsch;
})(window);