"use strict";

(function(exports){
  var INVALIDCOLOR = "#ffaaaa";
  
  var createAddon = function(name, className){
    var elem = document.createElement("span");
    var $elem = $(elem);
    $elem.addClass("input-group-addon").append(name);
    if(className) $elem.addClass("jsch-validation-out-"+className)
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
  var createTab = function(name, disabled, doms, element){
    var btn = document.createElement("a");
    var $btn = $(btn);
    $btn.text(name);
    if(disabled) {
      $(doms.typeList).append($(document.createElement("li")).addClass("disabled").append(btn))
    } else {
      $(doms.typeList).append($(document.createElement("li")).append(btn));
    
      $btn.on("click", function(){
        $(doms.typeList).children().removeClass("active");
        $(btn.parentNode).addClass("active");
        element.domElements.type.value=name.toLowerCase();
        
        element.revalidate();
        $(doms.typeContent).children().hide().removeClass("active");
        $(content).show();
      });

    }
    
    var content = document.createElement("div");
    $(content).addClass("tab-pane jsch-type jsch-type-"+name.toLowerCase());
    
    $(doms.typeContent).append(content);
    
    return {btn: btn, content:content};
  };
  var addProperty = function(element, name){
    if(!element.domElements.types.object.jschProperties[name]) return;
    
    var removeSubElement = function(name){
      element.domElements.types.object.jschProperties[name].domElements.root.parentNode.parentNode.removeChild(element.domElements.types.object.jschProperties[name].domElements.root.parentNode);
      delete element.domElements.types.object.jschProperties[name];
      element.revalidate();
    };
    var $elem = $(element.domElements.types.object);
    
    var tmp = element.domElements.types.object.jschProperties[name]; // TODO find a better name for this var
    
    var li = document.createElement("li");
    var inputGroup = document.createElement("div");
    inputGroup.setAttribute("class", "input-group");
    
    var title = document.createElement("input");
    var $title = $(title);
    setAttributes(title, {
      type:"text",
      disabled:"disabled",
      class:"form-control"
    });
    title.value = name;
    
    var removeBtn = createAddon("remove");
    $(removeBtn)
      //.text("remove")
      .addClass("label-danger")
      .on("click", function(){
        removeSubElement(name);
      });
    
    var collapseBtn = createAddon("collapse");
    var $collapseBtn = $(collapseBtn);
    
    $collapseBtn.on("click", function(){
      if($collapseBtn.text() === "collapse") {
        $collapseBtn.text("expand");
        $(tmp.domElements.root).hide();
      } else {
        $collapseBtn.text("collapse");
        $(tmp.domElements.root).show();
      }
    })
    
    $(inputGroup).append(title, collapseBtn, removeBtn);
    $(li).append(inputGroup, tmp.domElements.root);
    
    $elem.append(li);
    element.revalidate();
  };
  var refreshItems = function(element){
    var arr = element.domElements.types.array.jschItems;
    var $elem = $(element.domElements.types.object);
    var i;
    
    $elem.children().remove();
    
    for(i=0; i<arr.length; i++) {
      addItem(element, i);
    }
  };
  var addItem = function(element, item){
    if(!element.domElements.types.array.jschItems[item]) return;
    
    var removeSubElement = function(i){
      element.domElements.types.array.jschItems[i].domElements.root.parentNode.parentNode.removeChild(element.domElements.types.array.jschItems[i].domElements.root.parentNode);
      element.domElements.types.jschItems.splice(i, 1);
      element.revalidate();
    };
    var $elem = $(element.domElements.types.array);
    
    var tmp = element.domElements.types.array.jschItems[item]; // TODO find a better name for this var
    
    var li = document.createElement("li");
      
    var inputGroup = document.createElement("div");
    inputGroup.setAttribute("class", "input-group");
    
    var removeBtn = createAddon("remove");
    $(removeBtn)
      //.text("remove")
      .addClass("label-danger")
      .on("click", function(){
        removeSubElement(tmp);
      });
    
    var collapseBtn = createAddon("collapse");
    var $collapseBtn = $(collapseBtn);
    
    $collapseBtn.on("click", function(){
      if($collapseBtn.text() === "collapse") {
        $collapseBtn.text("expand");
        $(tmp.domElements.root).hide();
      } else {
        $collapseBtn.text("collapse");
        $(tmp.domElements.root).show();
      }
    });
    
    var moveUpBtn = createAddon("&#8593;");
    var moveDownBtn = createAddon("&#8595;");
    
    var $moveUpBtn = $(moveUpBtn);
    var $moveDownBtn = $(moveDownBtn);
    
    $moveUpBtn.on("click", function(){
      console.log("// TODO: up...");
    });
    $moveDownBtn.on("click", function(){
      console.log("// TODO: down...");
    });
    
    $(inputGroup).append(collapseBtn, moveUpBtn, moveDownBtn, removeBtn);
    
    
    $(li).append(inputGroup, tmp.domElements.root);
    
    $elem.append(li);
    element.revalidate();
  };

  var createNull = function(doms, element){
    var tab = createTab("Null", !(!element.getJsonSchema().type || element.getJsonSchema().type.indexOf("null")>=0), doms, element);
    $(tab.content).append('<h4>Null</h4><p>This key is null...</p>');
  };
  var createBoolean = function(doms, element){
    var tab = createTab("Boolean", !(!element.getJsonSchema().type || element.getJsonSchema().type.indexOf("boolean")>=0), doms, element);
    $(tab.content).append('<h4>Boolean value</h4>', element.domElements.types.boolean);
    
    return;
    var elem = element.domElements.types.boolean;
    var btn = document.createElement("a");
    var $btn = $(btn);
    var content = document.createElement("div");
    
    $(content).addClass("tab-pane jsch-type jsch-type-boolean").append('<h4>Boolean value</h4>', elem);
    
    $btn.text("Boolean");
    if(!element.getJsonSchema().type || element.getJsonSchema().type.indexOf("boolean")>=0) {
    
      $(doms.typeList).append($(document.createElement("li")).append(btn));
    
      $btn.on("click", function(){
        $(doms.typeList).children().removeClass("active");
        $(btn.parentNode).addClass("active");
        element.domElements.type.value="boolean";
        
        element.revalidate();
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
    var schema = element.getJsonSchema();
    var tab = createTab("String", !(!schema.type || schema.type.indexOf("string")>=0), doms, element);
    
    var content = tab.content;
    
    $(content).append('<h4>String value</h4>');
    
    var inputGroup = document.createElement("div");
    inputGroup.setAttribute("class", "input-group");
    if(schema.pattern) inputGroup.appendChild(createAddon("RegExpr", "string-pattern"));
    if(schema.minLength) inputGroup.appendChild(createAddon("n &ge; "+element.getJsonSchema().minLength, "string-minLength"));
    if(schema.maxLength) inputGroup.appendChild(createAddon("n &le; "+element.getJsonSchema().maxLength, "string-maxLength"));
    if(schema.format) {
      switch (schema.format) {
        case "email":
          inputGroup.appendChild(createAddon("@", "string-format"));
          break;
        case "uri":
          inputGroup.appendChild(createAddon("proto://", "string-format"));
          break;
        case "ipv4":
          inputGroup.appendChild(createAddon("ip", "string-format"));
          break;
        case "date-time":
        case "hostname":
        case "ipv6":
        default:
          inputGroup.appendChild(createAddon(element.getJsonSchema().format, "string-format"));
      }
    }
    if(!schema.format && !schema.minLength && !schema.maxLength && !schema.pattern) {
      inputGroup.appendChild(createAddon("*"));
    }
    $(elem).addClass("form-control");
    inputGroup.appendChild(elem);
    
    $(content).append(inputGroup);
  };
  var createNumber = function(doms, element){
    var elem = element.domElements.types.number;
    var schema = element.getJsonSchema();
    var tab = createTab("Number", !(!schema.type || schema.type.indexOf("number")>=0), doms, element);
    
    var content = tab.content;
    
    $(content).append('<h4>Number value</h4>');
    
    var inputGroup = document.createElement("div");
    inputGroup.setAttribute("class", "input-group");
    
    if(schema.multipleOf) inputGroup.appendChild(createAddon(schema.multipleOf+" | x", "number-multipleOf"));
    else if(schema.type === "integer") inputGroup.appendChild(createAddon("1 | x", "number-multipleOf"));
    
    if(schema.minimum) {
      if(schema.exclusiveMinimum) inputGroup.appendChild(createAddon("&gt; "+schema.minimum, "number-minimum"));
      else inputGroup.appendChild(createAddon("&ge; "+schema.minimum, "number-minimum"));
    }
    
    if(schema.maximum) {
      if(schema.exclusiveMaximum) inputGroup.appendChild(createAddon("&lt; "+schema.maximum, "number-maximum"));
      else inputGroup.appendChild(createAddon("&le; "+schema.maximum, "number-maximum"));
    }
    if(!schema.maximum && !schema.minimum && !schema.multipleOf && schema.type !== "integer") inputGroup.appendChild(createAddon("*"));
    $(elem).addClass("form-control");
    inputGroup.appendChild(elem);
    
    $(content).append(inputGroup);
    
  };
  var createObject = function(doms, element){
    var elem = element.domElements.types.object;
    var $elem = $(elem);
    var schema = element.getJsonSchema();
    
    var validPropertyName = function(name){
      var oldSchema = element.getJsonSchema();
      if(oldSchema.additionalProperties !== false) return true;
      if(oldSchema.properties && oldSchema.properties[name]) return true;
      
      var hash;
      for(hash in oldSchema.patternProperties) {
        hash = new RegExp(hash);
        if(hash.test(name)) return true;
      }
      return false;
    };
    var addSubElement = function(name, value){
      if(element.domElements.types.object.jschProperties[name]) return;
      if(!validPropertyName(name)) return;
      
      var subSchema = element.getSubSchema(name);
      if(subSchema.$ref) subSchema = Jsch.getSchemaFromDictionary(subSchema.$ref, element.getBase());
      if(value === undefined) value = subSchema.default;
      
      element.domElements.types.object.jschProperties[name] = new Element({parent: element, value: value, Jsch:element.Jsch, jsonSchema: subSchema});
      
      addProperty(element, name);
      
      return;      
    };
    
    var tab = createTab("Object", !(!schema.type || schema.type.indexOf("object")>=0), doms, element);
    var content = tab.content;
    var $content = $(content);
    
    var inputGroup = document.createElement("div");
    inputGroup.setAttribute("class", "input-group");
    if(schema.maxProperties) inputGroup.appendChild(createAddon("n &le; "+schema.maxProperties, "object-maxProperties"));
    if(schema.minProperties) inputGroup.appendChild(createAddon("n &ge; "+schema.minProperties, "object-minProperties"));
    if(schema.required) inputGroup.appendChild(createAddon("required", "object-required"));
    if(schema.properties || schema.patternProperties) inputGroup.appendChild(createAddon("properties", "object-properties"));
    
    if(inputGroup.hasChildNodes()) {
      $(content).append('<h4>Object validations</h4>', inputGroup);
    }
    
    
    $content.append('<h4>Create new property</h4>');
    inputGroup = document.createElement("div");
    inputGroup.setAttribute("class", "input-group");
    
    if(schema.patternProperties) inputGroup.appendChild(createAddon("RegExpr"));
    var newKeyName = document.createElement("input");
    setAttributes(newKeyName, {type: "text", class:"form-control", placeholder: "new key name", alt: "The key-name for the new element"});
    
    
    var createKeyBtn = document.createElement("button");
    $(createKeyBtn)
      .text("create")
      .addClass("form-control")
      .on("click", function(){addSubElement(newKeyName.value)});
    
    if(schema.properties) {
      var hash;
      var properties = [];
      for (hash in schema.properties) {
        properties.push(hash);
      }
      inputGroup.appendChild(createEnum("predefined types", properties, newKeyName));
    }
    if(schema.additionalProperties !== false) inputGroup.appendChild(createAddon("*"));
    if(schema.additionalProperties === false && !schema.patternProperties) $(newKeyName).attr("disabled", "disabled");
    inputGroup.appendChild(newKeyName);
    
    $(newKeyName).on("input", function(){
      if(validPropertyName(newKeyName.value)) newKeyName.style.backgroundColor = "";
      else newKeyName.style.backgroundColor = INVALIDCOLOR;
    });
    
    $content.append(inputGroup, createKeyBtn, elem);
  };
  var createArray = function(doms, element){
    var addSubElement = function(value){
      var subSchema = element.getSubSchema(element.getValue().length);
      if(subSchema.$ref) subSchema = Jsch.getSchemaFromDictionary(subSchema.$ref, element.getBase());
      if(value === undefined) value = subSchema.default;
      addItem(element, (element.domElements.types.array.jschItems.push(new Element({parent: element, value: value, Jsch:element.Jsch, jsonSchema: subSchema})))-1);   
    };
    
    var elem = element.domElements.types.array;
    
    var schema = element.getJsonSchema();
    var tab = createTab("Array", !(!schema.type || schema.type.indexOf("array")>=0), doms, element);
    
    var content = tab.content;
    
    var $elem = $(elem);
    var inputGroup;
    var schema = element.getJsonSchema();
    
    var $content = $(content);
    inputGroup = document.createElement("div");
    inputGroup.setAttribute("class", "input-group");
    if(schema.minItems) inputGroup.appendChild(createAddon("n &ge; "+schema.minItems, "array-minItems"));
    if(schema.maxItems) inputGroup.appendChild(createAddon("n &le; "+schema.maxItems, "array-maxItems"));
    if(schema.uniqueItems) inputGroup.appendChild(createAddon("unique", "array-uniqueItems"));
    if(schema.items) inputGroup.appendChild(createAddon("structure", "array-items"));
    
    if(inputGroup.hasChildNodes()) {
      $(content).append('<h4>Array validations</h4>', inputGroup);
    }
    
    $content.append('<h4>Append new property</h4>');
    
    var createItemBtn = document.createElement("button");
    $(createItemBtn)
      .text("append")
      .addClass("form-control")
      .on("click", function(){addSubElement()});
      
    $content.append(createItemBtn, elem);
  };
  
  var defaultView = function(elem) {
    var $root = $(elem.domElements.root);
    
    var schema = elem.getJsonSchema();
    
    elem.domElements.root.refresh = function(){
      var type = elem.domElements.type.value.toLowerCase();
      $root.find(".jsch-type").hide();
      $root.find(".jsch-type-"+type).show();
      
      $root.find(".jsch-types li").each(function(){
        if(this.firstChild.firstChild.nodeValue.toLowerCase() === type) $(this).addClass("active");
        else $(this).removeClass("active");
      });
      $root.find(".jsch-type-"+type).show();
      
      if(type === "object") {
        var obj = elem.domElements.types.object;
        $(obj).children().remove();
        var properties = obj.jschProperties;
        var hash;
        
        for (hash in properties) {
          addProperty(elem, hash);
        }
        
      }
      if(type === "array") {
        // TODO: test this // something like: addItem(value) in a for-loop
        var obj = elem.domElements.types.array;
        $(obj).children().remove();
        var items = obj.jschItems;
        var i;
        
        refreshItems(elem);
      }
    };
    
    var elements = {};
    $root.addClass("panel").addClass("panel-default");
    
    // Header
    var $header = $(elements.panelHeader = document.createElement("div")).addClass("panel-heading");
    
      // id
    $header.append($(document.createElement("h5")).attr("style", "float:right;").append($(elements.schemaId = document.createElement("span")).text(schema.id || ""))); // "(none)" // TODO: get absolute+relative url
    
      // title
    elements.title = document.createElement('h3');
    if(schema.title) $header.append($(elements.title).text(schema.title));
    
    // description
    elements.description = document.createElement("p");
    if(schema.description) $header.append($(elements.description).text(schema.description));
    $(elements.schemaId = document.createElement("h5")).addClass("panel-heading");
    
    // validations
    elements.validationInputGroup = document.createElement("div");
    elements.validationInputGroup.setAttribute("class", "input-group");
    
    var $inputGroup = $(elements.validationInputGroup);
    
    if("type" in schema) $inputGroup.append(createAddon("type", "any-type"));
    if("enum" in schema) $inputGroup.append(createAddon("enum", "any-enum"));
    if("allOf" in schema) $inputGroup.append(createAddon("allOf", "any-allOf"));
    if("anyOf" in schema) $inputGroup.append(createAddon("anyOf", "any-anyOf"));
    if("oneOf" in schema) $inputGroup.append(createAddon("oneOf", "any-oneOf"));
    if("not" in schema) $inputGroup.append(createAddon("not", "any-not"));
    
    if(elements.validationInputGroup.hasChildNodes()) {
      $header.append("<h4>Validations</h4>", $inputGroup);
    }
    
    $root.append($header);
    
    // Body
    var $body = $(elements.panelBody = document.createElement("div")).addClass("panel-body");
    $body.append($(elements.typeList = document.createElement("ul")).attr("role", "tablist").addClass("nav nav-tabs jsch-types"));
    $body.append($(elements.typeContent = document.createElement("div")).addClass("tab-content jsch-types-content"));
    
    createObject(elements, elem);
    createArray(elements, elem);
    createString(elements, elem);
    createNumber(elements, elem);
    createBoolean(elements, elem);
    createNull(elements, elem);
    
    elem.domElements.root.refresh();
    
    $root.append($body);
  };
  
  var Element = function(opts){
    //# Error handling
    if(!opts.Jsch) throw new Error("Don't have a handle for the main Jsch controller");
    var self = this;
  
    //# private constants and variables
    var schema = opts.jsonSchema || opts.Jsch.getJsonSchema();
    
    this.getParent = function(){
      if(opts && opts.parent) return opts.parent;
      return;
    };
    this.getBase = function(){
      if(schema.id) return schema.id;
      if(opts && opts.parentBase) {
        return Jsch.getSchemaFromDictionary(opts.parentBase);
      }
      var parent = self.getParent();
      if(parent) return parent.getBase();
    };
    
    if(schema.$ref) schema = Jsch.getSchemaFromDictionary(schema.$ref, self.getBase());
  
    //# private functions and objects
    
    
    
    //# constructor
    
    // create DOM Elements
    this.domElements = {
      root: document.createElement("div"),
      type: document.createElement("input"),
      types: {
        string: document.createElement("textarea"), // not only an input because you should able to make new lines in strings
        number: document.createElement("input"),
        boolean: document.createElement("input"),
        //null,
        array: document.createElement("ol"),
        object: document.createElement("ul")
      }
    };
    // Configure DOM-Elements
    setAttributes(this.domElements.root, {class: "jsch-element"});
    setAttributes(this.domElements.types.string, {type: "text", class: "jsch-data jsch-data-string"});
    setAttributes(this.domElements.types.number, {type: "number", class: "jsch-data jsch-data-number"});
    setAttributes(this.domElements.types.boolean, {type: "checkbox", class: "jsch-data jsch-data-boolean"});
    setAttributes(this.domElements.types.array, {class: "jsch-data jsch-data-array"});
    this.domElements.types.array.jschItems = [];
    setAttributes(this.domElements.types.object, {class: "jsch-data jsch-data-object"});
    this.domElements.types.object.jschProperties = {};
    setAttributes(this.domElements.type, {type:"hidden"});
    
    // validations
    this.validations = {
      number: {
        multipleOf: function(){
          if(schema.multipleOf || schema.type && schema.type.indexOf("integer")>=0) {
            var val = parseFloat(self.domElements.types.number.value);
            var mo = schema.multipleOf || 1;
            while (mo<1) {
              mo*10;
              val*10;
            }
            return (val % mo === 0);
          }
          return true;
        },
        minimum: function(){
          if(schema.minimum) {
            var val = parseFloat(self.domElements.types.number.value);
            if(schema.exclusiveMinimum) return val>schema.minimum;
            else return val>=schema.minimum;
          }
          return true;
        },
        maximum: function(){
          if(schema.maximum) {
            var val = parseFloat(self.domElements.types.number.value);
            if(schema.exclusiveMaximum) return val<schema.maximum;
            else return val<=schema.maximum;
          }
          return true;
        }
      },
      string: {
        pattern: function(){
          if(schema.pattern) {
            var val = self.domElements.types.string.value;
            return (new RegExp(schema.pattern)).test(val);
          }
          return true;
        },
        minLength: function(){
          if(schema.minLength) {
            var val = self.domElements.types.string.value;
            return val.length>=schema.minLength;
          }
          return true;
        },
        maxLength: function(){
          if(schema.maxLength) {
            var val = self.domElements.types.string.value;
            return val.length<=schema.maxLength;
          }
          return true;
        },
        format: function(){
          if(schema.format) {
            var val = self.domElements.types.string.value;
            switch (schema.format) {
              case "email":
                return /^[a-z0-9]+([\.\-_]?[a-z0-9]+)*@[a-z0-9]+([\.\-_]?[a-z0-9]+)*$/i.test(val);
              case "uri":
                return /^[a-z][a-z0-9]*:[a-z0-9\.\-\_\/]*$/i.test(val);
              case "ipv4":
                return /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}$/.test(val);
              case "date-time":
                return /^[0-9]{1,4}\-(1[0-2]|0[1-9])\-(3[0-1]|[12][0-9]|0[1-9])T(2[0-4]|[0-1][0-9]):(60|[0-5][0-9]):(60|[0-5][0-9])\.[0-9]{3}Z$/.test(val);
              case "hostname":
                return /^[a-z0-9]+([\.\-_]?[a-z0-9]+)*$/i.test(val);
              case "ipv6":
                return /^([0-9a-f]{0,4}:){7}[0-9a-f]{0,4}$/i.test(val);
            }
          }
          return true;
        },
      },
      object: {
        maxProperties: function(){
          if(schema.maxProperties) {
            var val = self.domElements.types.object.jschProperties;
            var hash;
            var i=0;
            for (hash in val) {
              i++;
            }
            return schema.maxProperties >= i;
          }
          return true;
        },
        minProperties: function(){
          if(schema.minProperties) {
            var val = self.domElements.types.object.jschProperties;
            var hash;
            var i=0;
            for (hash in val) {
              i++;
            }
            return schema.minProperties <= i;
          }
          return true;
        },
        required: function(){
          if(schema.required) {
            var val = self.domElements.types.object.jschProperties;
            var isEverythingRequired = true;
            var i;
            for (i=0; i<schema.required.length; i++) {
              if(!(schema.required[i] in val)) {
                isEverythingRequired = false;
                break;
              }
            }
            return isEverythingRequired;
          }
          return true;
        },
        properties: function(){ // patternProperties, additional properties
          var val = self.domElements.types.object.jschProperties;
          if(schema.additionalProperties === false) {
            var i, hash;
            
            var patternRegExps = [];
            var oneOfThem = true;
            
            if(schema.patternProperties) {
              try {
                for (i=0; i<schema.patternProperties.length; i++) {
                  patternRegExps.push( new RegExp(schema.patternProperties[i]));
                }
              } catch (e) {console.error(e);};
            }
            
            
            for (hash in val) {
              if(schema && schema.properties && !(hash in schema.properties)) {
                oneOfThem = false;
                for(i=0; i<patternRegExps; i++) {
                  if(patternRegExps[i].test(hash)) {
                    oneOfThem = true;
                    break;
                  }
                }
                return oneOfThem;
              }
            }
          }
          //else if(typeof schema.additionalProperties === "object") {
            // There is nothing todo, because this is already validated by a subschema
          //}
          return true;
        },
        dependencies: function(){
          if(schema.dependencies) {
            var val = self.domElements.types.object.jschProperties;
            var hash, i;
            for (hash in schema.dependencies) {
              if(hash in val) {
                for (i=0; i<schema.dependencies[hash]; i++) {
                  if(!val[schema.dependencies[hash][i]]) return false;
                }
              }
            }
          }
          return true;
        }
      },
      array: {
        items: function(){
          if(schema.additionalItems === false) {
            var val = self.domElements.types.array.jschItems;
            //if(val.length !== schema.items.length) return false;
            var i;
            
            if(Array.prototype.isPrototypeOf(schema.items)) {
              for(i=0; i<val.length; i++) {
                val[i].setJSONSchema(schema.items[i]);
                if(val[i].getStatus()!=="valid") return false;
              }
            } else if (typeof schema.items === "object"){
              var tmp = new Element({Jsch:self.Jsch, value: self.getValue(), jsonSchema: schema.items, parent: self.getParent(), parentBase: self.getBase()});
              if(tmp.getStatus() !== "valid") return false;
            }
            

          }
          return true;
        },
        maxItems: function(){
          if("maxItems" in schema) {
            var val = self.domElements.types.array.jschItems;
            return val.length <= schema.maxItems;
          }
          return true;
        },
        minItems: function(){
          if("minItems" in schema) {
            var val = self.domElements.types.array.jschItems;
            return val.length >= schema.minItems;
          }
          return true;
        },
        uniqueItems: function(){
          if(schema.uniqueItems) {
            var val = self.getValue();
            if(Array.prototype.isPrototypeOf(val)) {
              return val.length === _.uniq(val).length;
            }
          }
          return true;
        }
      },
      any: {
        type: function(){
          var val = self.domElements.type.value;
          if(schema.type) {
            return schema.type.indexOf(val) >=0;
          }
          return true;
        },
        enum: function(){
          if(schema.enum) {
            var i;
            var val = self.getValue();
            var oneOfThem = false;
            for(i=0; i<schema.enum.length; i++) {
              if(_.isEqual(schema.enum[i], val)) {
                oneOfThem = true;
                break;
              }
            }
            return oneOfThem;
          }
          return true;
        },
        allOf: function(){
          if(schema.allOf) {
            var i;
            for (i=0; i<schema.allOf.length; i++) {
              if((new Element({Jsch:self.Jsch, value: self.getValue(), jsonSchema: schema.allOf[i], parent: self.getParent(), parentBase: self.getBase() })).getStatus() !== "valid") return false;
            }
          }
          return true;
        },
        anyOf: function(){
          if(schema.anyOf) {
            var i;
            for (i=0; i<schema.anyOf.length; i++) {
              var tmp = new Element({Jsch:self.Jsch, value: self.getValue(), jsonSchema: schema.anyOf[i], parent: self.getParent(), parentBase: self.getBase()});
              if(tmp.getStatus() === "valid") return true;
            }
            return false
          }
          return true;
        },
        oneOf: function(){
          if(schema.oneOf) {
            var i, n=0;
            for (i=0; i<schema.oneOf.length; i++) {
              if((new Element({Jsch:self.Jsch, value: self.getValue(), jsonSchema: schema.oneOf[i], parent: self.getParent(), parentBase: self.getBase() })).getStatus() === "valid") n++;
            }
            return n === 1;
          }
          return true;
        },
        not: function(){
          if(schema.not) {
            var i;
            for (i=0; i<schema.not.length; i++) {
              if((new Element({Jsch:self.Jsch, value: self.getValue(), jsonSchema: schema.not[i], parent: self.getParent(), parentBase: self.getBase() })).getStatus() === "valid") return false;
            }
          }
          return true;
        } //, Definitions are more a feature than a validation...
        //definitions: function(){
        //  return true;
        //}
      }
      
    };
    
    var runValidations = function(type){
      var validations = self.validations[type]; if(!validations) return true; // unnknown type
      var hash;
      var isEverythingValid = true;
      var $root = $(self.domElements.root);
      for (hash in validations) {
        if(validations[hash]()) $root.removeClass("jsch-validation-"+type+"-"+hash+"-invalid").addClass("jsch-validation-"+type+"-"+hash+"-valid");
        else {
          $root.removeClass("jsch-validation-"+type+"-"+hash+"-valid").addClass("jsch-validation-"+type+"-"+hash+"-invalid");
          isEverythingValid = false;
        }
      }
      return isEverythingValid;
    };
    
    var validate = function(){
      var isWholeElementValid = runValidations(self.domElements.type.value.toLowerCase());
      
      if (!runValidations("any")) isWholeElementValid = false;
      
      if(isWholeElementValid) $(self.domElements.root).removeClass("jsch-validation-invalid").addClass("jsch-validation-valid");
      else $(self.domElements.root).removeClass("jsch-validation-valid").addClass("jsch-validation-invalid");
      
      var parent = self.getParent();
      self.checkSubValidity();
      
      return isWholeElementValid;      
    };
    var refresh = function(){
      numRefreshes++;
      if(self.domElements.root.refresh) self.domElements.root.refresh();
      setTimeout(function(){validate(); numRefreshes--; if(numRefreshes===0) onJschInit=false;}, 0); // let us validate in async mode...
    };
    
    $([self.domElements.types.string, self.domElements.types.number, self.domElements.types.boolean]).on("change", validate);
    $([self.domElements.types.object, self.domElements.types.array]).on("DOMSubtreeModified", validate);
    
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
          var arr = this.domElements.types.array.jschItems;
          var tmp = [];
          for(rv=0; rv<arr.length; rv++) {
            tmp.push(arr[rv].getValue());
          }
          return tmp;
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
        refresh();
        return 
      }
      var type = typeof val;
      if(type === "object" && Array.prototype.isPrototypeOf(val)) type = "array";
      
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
          var obj = this.domElements.types.object.jschProperties = {};
          var hash;
          for(hash in val) {
            obj[hash] = new Element({parent:self, Jsch: self.Jsch, jsonSchema: self.getSubSchema(hash), value: val[hash]});
          }
          this.domElements.type.value = "object";
          break;
        case "array":
          var arr = this.domElements.types.array.jschItems = [];
          var i;
          for(i=0; i<val.length; i++) {
            arr.push(new Element({parent:this, Jsch: self.Jsch, jsonSchema: self.getSubSchema(i), value: val[i]}));
          }
          this.domElements.type.value = "array";
          break;
      }
      refresh();
    };
    this.Jsch = opts.Jsch;
    this.setSchema = this.setJsonSchema = this.setJSONSchema = function(val){schema = val;};
    this.getSchema = this.getJsonSchema = this.getJSONSchema = function(){return schema;};
    this.getSubSchema = function(name){
      if(typeof name === "string") {
        if(schema.properties && schema.properties[name]) return schema.properties[name];
        
        var hash;
        for(hash in schema.patternProperties) {
          if((new RegExp(hash)).test(name)) return schema.patternProperties[hash];
        }
        if(typeof schema.additionalProperties === "object") return schema.additionalProperties;
      }
      if(typeof name === "number") {
        if(schema.items && schema.items[name]) return schema.items[name];
        
        if(typeof schema.additionalItems === "object") return schema.additionalItems;
      }
      return {type:"null", title:"Invalid Subschema", description:"Jsch can't find a valid subschema..."};
    };
    this.revalidate = function(){validate();};
    this.getStatus = function(){
      if(!validate()) return "invalid";
      if(!self.checkSubValidity()) return "sub-invalid";
      return "valid";
    };
    this.checkSubValidity = function() {
      var parent = self.getParent();
      var bool = true;
      var $root = $(self.domElements.root);
      if(self.domElements.type.value !== "array" && self.domElements.type.value !== "object") bool = true;
      else if($root.find(".jsch-validation-invalid.jsch-element").length !== 0) bool = false;
      
      if(self.domElements.type.value === "array" && !self.validations.array.uniqueItems() || !runValidations("any")) {
        //setTimeout(validate, 1000);
        console.log("// TODO: solve this a little bit nicer");
      }
      
      if(bool) $root.removeClass("jsch-validation-subinvalid");
      else $root.addClass("jsch-validation-subinvalid");      
      if(parent && !onJschInit) parent.checkSubValidity();
      return bool;
    };
    
    Jsch.render(this);
    
    if(opts && "value" in opts) this.setValue(opts.value);
  };

  var Jsch = function(opts){
    //# Error handling
    //if() throw new Error();
  
    //# private constants and variables
    var self = this;
    var views = {};
  
    //# private functions and objects
    var jsonSchema = opts.jsonSchema || {};
    Jsch.addToDictionary(jsonSchema);
    
  
    //# constructor
    this.getJsonSchema = function(){return opts.jsonSchema || {};};
    this.getData = function(){
      return first.getValue();
    };
    this.setData = function(data){
      onJschInit = true;
      var rg = first.setValue(data);
      return rg;
    };
    
    this.domElements = {
      root: document.createElement("div")
    };
    $(this.domElements.root).addClass("jsch-root");
    
    this.send = function(args){
      args.enctype = args.enctype || opts.enctype || "application/json"; //application/x-www-form-urlencoded
      args.success = args.success || function(){};
      args.parameter = args.parameter || opts.parameter || "json"; // only for enctype urlencoded
      args.url = args.url || opts.url;
      // it's better to set method stricly to POST // args.method = args.method || opts.method || "POST"; // You can't get
      if(!args.url) throw new Error("You have to set an url ");
      
      if(args.enctype.toLowerCase() === "application/x-www-form-urlencoded") {
        var data = {};
        data[args.parameter] = JSON.stringify(this.getData());
      } else {
        var data = JSON.stringify(this.getData());
      }
      
      $.ajax({
        url: args.url,
        data: data,
        type: "POST",
        contentType: args.enctype,
        success: args.success
      });
    };
    
    var first = new Element({Jsch: self});
    opts.data = opts.data || null;
    first.setValue(opts.data);
    this.first = first;
    $(this.domElements.root).append(first.domElements.root);
     
  };
  Jsch.views = {};
  var onJschInit=false;
  var numRefreshes=0;
  Jsch.render = function(elem){
    var id = elem.getSchema().id;
    if(id in Jsch.views) Jsch.views[id](elem);
    else defaultView(elem);
  };
  Jsch.addView = function(id, fn){
    Jsch.views[id] = fn; 
  };
  Jsch.dictionary = {};
  Jsch.addToDictionary = function(schema){
    if(schema.id) {
      if(schema.id.substr(-1)!== "#") schema.id += "#";
      Jsch.dictionary[schema.id] = schema;
    }
    // crawling sub schemas
    if(schema.definitions) {
      var hash;
      for (hash in schema.definitions) {
        Jsch.addToDictionary(schema.definitions[hash]);
      }
    }
    if(schema.properties) {
      var hash;
      for (hash in schema.properties) {
        Jsch.addToDictionary(schema.properties[hash]);
      }
    }
    if(schema.patternProperties) {
      var hash;
      for (hash in schema.patternProperties) {
        Jsch.addToDictionary(schema.patternProperties[hash]);
      }
    }
    if(schema.additionalProperties) {
      var hash;
      for (hash in schema.additionalProperties) {
        Jsch.addToDictionary(schema.additionalProperties[hash]);
      }
    }
    if(schema.items) {
      var hash;
      for (hash in schema.patternProperties) {
        Jsch.addToDictionary(schema.patternProperties[hash]);
      }
    }
    if(schema.allOf) {
      var i;
      for (i=0; i<schema.allOf.length; i++) {
        Jsch.addToDictionary(schema.allOf[i]);
      }
    }
    if(schema.anyOf) {
      var i;
      for (i=0; i<schema.anyOf.length; i++) {
        Jsch.addToDictionary(schema.anyOf[i]);
      }
    }
    if(schema.oneOf) {
      var i;
      for (i=0; i<schema.oneOf.length; i++) {
        Jsch.addToDictionary(schema.oneOf[i]);
      }
    }
    if(schema.not) {
      var i;
      for (i=0; i<schema.not.length; i++) {
        Jsch.addToDictionary(schema.not[i]);
      }
    }
  };
  Jsch.getSchemaFromDictionary = function(url, base){
    var resolve = function(base, path){
      var i;
      var id = base.id+path;
      if(typeof path === "string") path = path.split("/");
      
      for (i=0; i<path.length; i++) {
        if(path[i]!== "") base = base[path[i]];
      }
      base = base || {};
      if(!("id" in base)) base.id = id;
      return base; // TODO: Maybe throw errors with invalid schema name
    };
    if(url.substr(0, 1) === "#") {
      if(!base) throw new Error("Can't resolve relative schema without base");
      var path = url.split("#")[1] || "";
      return resolve(base, path);
    }
    if(url.substr(0, 1) === "/") {
      if(!base) throw new Error("Can't resolve relative schema without base");
      
      var path = url.split("#")[1] || "";
      return resolve(base, path);
    }
    
    if(/^(https?|s?ftp):\/\//.test(url)) {
      var mainSchema = Jsch.dictionary[url.split("#")[0]+"#"];
      var path = url.split("#")[1] || "";
      return resolve(mainSchema, path);
      
    }
    return false;
  };
  
  // Add the default JSON-Schema and hyper schema for JSON-Schemas
  Jsch.addToDictionary({id:"http://json-schema.org/draft-04/schema#",$schema:"http://json-schema.org/draft-04/schema#",description:"Core schema meta-schema",definitions:{schemaArray:{type:"array",minItems:1,items:{$ref:"#"}},positiveInteger:{type:"integer",minimum:0},positiveIntegerDefault0:{allOf:[{$ref:"#/definitions/positiveInteger"},{"default":0}]},simpleTypes:{"enum":["array","boolean","integer","null","number","object","string"]},stringArray:{type:"array",items:{type:"string"},minItems:1,uniqueItems:true}},type:"object",properties:{id:{type:"string",format:"uri"},$schema:{type:"string",format:"uri"},title:{type:"string"},description:{type:"string"},"default":{},multipleOf:{type:"number",minimum:0,exclusiveMinimum:true},maximum:{type:"number"},exclusiveMaximum:{type:"boolean","default":false},minimum:{type:"number"},exclusiveMinimum:{type:"boolean","default":false},maxLength:{$ref:"#/definitions/positiveInteger"},minLength:{$ref:"#/definitions/positiveIntegerDefault0"},pattern:{type:"string",format:"regex"},additionalItems:{anyOf:[{type:"boolean"},{$ref:"#"}],"default":{}},items:{anyOf:[{$ref:"#"},{$ref:"#/definitions/schemaArray"}],"default":{}},maxItems:{$ref:"#/definitions/positiveInteger"},minItems:{$ref:"#/definitions/positiveIntegerDefault0"},uniqueItems:{type:"boolean","default":false},maxProperties:{$ref:"#/definitions/positiveInteger"},minProperties:{$ref:"#/definitions/positiveIntegerDefault0"},required:{$ref:"#/definitions/stringArray"},additionalProperties:{anyOf:[{type:"boolean"},{$ref:"#"}],"default":{}},definitions:{type:"object",additionalProperties:{$ref:"#"},"default":{}},properties:{type:"object",additionalProperties:{$ref:"#"},"default":{}},patternProperties:{type:"object",additionalProperties:{$ref:"#"},"default":{}},dependencies:{type:"object",additionalProperties:{anyOf:[{$ref:"#"},{$ref:"#/definitions/stringArray"}]}},"enum":{type:"array",minItems:1,uniqueItems:true},type:{anyOf:[{$ref:"#/definitions/simpleTypes"},{type:"array",items:{$ref:"#/definitions/simpleTypes"},minItems:1,uniqueItems:true}]},allOf:{$ref:"#/definitions/schemaArray"},anyOf:{$ref:"#/definitions/schemaArray"},oneOf:{$ref:"#/definitions/schemaArray"},not:{$ref:"#"}},dependencies:{exclusiveMaximum:["maximum"],exclusiveMinimum:["minimum"]},"default":{}})
  
  Jsch.addToDictionary({$schema:"http://json-schema.org/draft-04/hyper-schema#",id:"http://json-schema.org/draft-04/hyper-schema#",title:"JSON Hyper-Schema",allOf:[{$ref:"http://json-schema.org/draft-04/schema#"}],properties:{additionalItems:{anyOf:[{type:"boolean"},{$ref:"#"}]},additionalProperties:{anyOf:[{type:"boolean"},{$ref:"#"}]},dependencies:{additionalProperties:{anyOf:[{$ref:"#"},{type:"array"}]}},items:{anyOf:[{$ref:"#"},{$ref:"#/definitions/schemaArray"}]},definitions:{additionalProperties:{$ref:"#"}},patternProperties:{additionalProperties:{$ref:"#"}},properties:{additionalProperties:{$ref:"#"}},allOf:{$ref:"#/definitions/schemaArray"},anyOf:{$ref:"#/definitions/schemaArray"},oneOf:{$ref:"#/definitions/schemaArray"},not:{$ref:"#"},links:{type:"array",items:{$ref:"#/definitions/linkDescription"}},fragmentResolution:{type:"string"},media:{type:"object",properties:{type:{description:"A media type, as described in RFC 2046",type:"string"},binaryEncoding:{description:"A content encoding scheme, as described in RFC 2045",type:"string"}}},pathStart:{description:"Instances' URIs must start with this value for this schema to apply to them",type:"string",format:"uri"}},definitions:{schemaArray:{type:"array",items:{$ref:"#"}},linkDescription:{title:"Link Description Object",type:"object",required:["href","rel"],properties:{href:{description:"a URI template, as defined by RFC 6570, with the addition of the $, ( and ) characters for pre-processing",type:"string"},rel:{description:"relation to the target resource of the link",type:"string"},title:{description:"a title for the link",type:"string"},targetSchema:{description:"JSON Schema describing the link target",$ref:"#"},mediaType:{description:"media type (as defined by RFC 2046) describing the link target",type:"string"},method:{description:'method for requesting the target of the link (e.g. for HTTP this might be "GET" or "DELETE")',type:"string"},encType:{description:"The media type in which to submit data along with the request",type:"string","default":"application/json"},schema:{description:"Schema describing the data to submit along with the request",$ref:"#"}}}},links:[{rel:"self",href:"{+id}"},{rel:"full",href:"{+($ref)}"}]});
  
  exports.Jsch = Jsch;
})(window || exports);