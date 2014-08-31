"use strict";

// TODO:
/*
  
  more todos:
  - implement $ref
  - soft-validations in Element Class. That means validate and change the html class of the domroot, of invalid, but don't prevent
  
*/

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
        
        element.revalidate();
        $(doms.typeContent).children().hide().removeClass("active");
        $(content).show();
      });
    } else {
      $(doms.typeList).append($(document.createElement("li")).addClass("disabled").append(btn));
    }
    $(doms.typeContent).append(content);
  };
  var createBoolean = function(doms, element){
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

    
    var btn = document.createElement("a");
    var content = document.createElement("div");
    
    $(content).addClass("tab-pane jsch-type jsch-type-string").append('<h4>String value</h4>');
    
    var inputGroup = document.createElement("div");
    inputGroup.setAttribute("class", "input-group");
    if(element.getJsonSchema().pattern) inputGroup.appendChild(createAddon("RegExpr", "string-pattern"));
    if(element.getJsonSchema().minLength) inputGroup.appendChild(createAddon("n &ge; "+element.getJsonSchema().minLength, "string-minLength"));
    if(element.getJsonSchema().maxLength) inputGroup.appendChild(createAddon("n &le; "+element.getJsonSchema().maxLength, "string-maxLength"));
    if(element.getJsonSchema().format) {
      switch (element.getJsonSchema().format) {
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
        
        element.revalidate();
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
    
    if(element.getJsonSchema().multipleOf) inputGroup.appendChild(createAddon(element.getJsonSchema().multipleOf+" | x", "number-multipleOf"));
    else if(element.getJsonSchema().type === "integer") inputGroup.appendChild(createAddon("1 | x", "number-multipleOf"));
    
    if(element.getJsonSchema().minimum) {
      if(element.getJsonSchema().exclusiveMinimum) inputGroup.appendChild(createAddon("&gt; "+element.getJsonSchema().minimum, "number-minimum"));
      else inputGroup.appendChild(createAddon("&ge; "+element.getJsonSchema().minimum, "number-minimum"));
    }
    
    if(element.getJsonSchema().maximum) {
      if(element.getJsonSchema().exclusiveMaximum) inputGroup.appendChild(createAddon("&lt; "+element.getJsonSchema().maximum, "number-maximum"));
      else inputGroup.appendChild(createAddon("&le; "+element.getJsonSchema().maximum, "number-maximum"));
    }
    if(!element.getJsonSchema().maximum && !element.getJsonSchema().minimum && !element.getJsonSchema().multipleOf && element.getJsonSchema().type !== "integer") inputGroup.appendChild(createAddon("*"));
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
        
        element.revalidate();
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
    
    var addSubElement = function(name, value){
      if(element.domElements.types.object.jschProperties[name]) return;
      if(!validPropertyName(name)) return;
      var subSchema = findSubSchema(name);
      if(subSchema.$ref) subSchema = Jsch.getSchemaFromDictionary(subSchema.$ref, element.getBase());
      if(value === undefined) value = subSchema.default;
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
      else newKeyName.style.backgroundColor = INVALIDCOLOR;
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
        
        element.revalidate();
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
    createBoolean(elements, elem);
    createNull(elements, elem);
    
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
              if(!hash in schema.properties) {
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
          else if(typeof schema.additionalProperties === "object") {
            console.warn("// TODO: Jsch has to handle a JSON schema as additionalProperties");
          }
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
        items: function(){ // TODO: 
          if(schema.additionalItems === false) {
            var val = self.domElements.types.array.jschItems;
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
        uniqueItems: function(){ // TODO: 
          if(schema.uniqueItems) {
            var val = self.domElements.types.array.jschItems;
            
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
        allOf: function(){ // TODO: test
          if(schema.allOf) {
            var i;
            for (i=0; i<schema.allOf.length; i++) {
              if((new Element({Jsch:self.Jsch, value: self.getValue(), jsonSchema: schema.allOf[i], parent: self.getParent(), parentBase: self.getBase() })).getStatus() !== "valid") return false;
            }
          }
          return true;
        },
        anyOf: function(){ // TODO: test
          if(schema.anyOf) {
            var i;
            for (i=0; i<schema.anyOf.length; i++) {
              if((new Element({Jsch:self.Jsch, value: self.getValue(), jsonSchema: schema.anyOf[i], parent: self.getParent(), parentBase: self.getBase() })).getStatus() === "valid") return true;
            }
            return false
          }
          return true;
        },
        oneOf: function(){ // TODO:  test
          if(schema.oneOf) {
            var i, n=0;
            for (i=0; i<schema.oneOf.length; i++) {
              if((new Element({Jsch:self.Jsch, value: self.getValue(), jsonSchema: schema.oneOf[i], parent: self.getParent(), parentBase: self.getBase() })).getStatus() === "valid") n++;
            }
            return n === 1;
          }
          return true;
        },
        not: function(){ // TODO: test 
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
      if(self.domElements.root.refresh) self.domElements.root.refresh();
      setTimeout(validate, 0); // let us validate in async mode...
    };
    
    $([self.domElements.types.string, self.domElements.types.number, self.domElements.types.boolean]).on("input", validate);
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
        refresh();
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
      refresh();
    };
    this.Jsch = opts.Jsch;
    this.setSchema = this.setJsonSchema = this.setJSONSchema = function(val){schema = val;};
    this.getSchema = this.getJsonSchema = this.getJSONSchema = function(){return schema;};
    this.revalidate = function(){validate();};
    this.getStatus = function(){
      if(!validate()) return "invalid"; 
      // enum: valid, invalid, sub-invalid
      // TODO: sub-invalid
      if(!checkSubValidity) return "sub-invalid";
      return "valid";
    };
    this.checkSubValidity = function() {
      var $root = $(self.domElements.root);
      if($root.find(".jsch-validation-invalid.jsch-element").length !== 0) {
        $root.addClass("jsch-validation-subinvalid");
      }
      else $root.removeClass("jsch-validation-subinvalid");
      
      var parent = self.getParent()
      if(parent) parent.checkSubValidity();
    }
    
    defaultView(this);
    
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
      return first.setValue(data);
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
      if(typeof path === "string") path = path.split("/");
      
      for (i=0; i<path.length; i++) {
        if(path[i]!== "") base = base[path[i]];
        if(!base) return base;
      }
      return base || {}; // TODO: Maybe throw errors with invalid schema name
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
  Jsch.addToDictionary({id:"http://json-schema.org/draft-04/schema#",$schema:"http://json-schema.org/draft-04/schema#",description:"Core schema meta-schema",definitions:{schemaArray:{type:"array",minItems:1,items:{$ref:"#"}},positiveInteger:{type:"integer",minimum:0},positiveIntegerDefault0:{allOf:[{$ref:"#/definitions/positiveInteger"},{"default":0}]},simpleTypes:{"enum":["array","boolean","integer","null","number","object","string"]},stringArray:{type:"array",items:{type:"string"},minItems:1,uniqueItems:true}},type:"object",properties:{id:{type:"string",format:"uri"},$schema:{type:"string",format:"uri"},title:{type:"string"},description:{type:"string"},"default":{},multipleOf:{type:"number",minimum:0,exclusiveMinimum:true},maximum:{type:"number"},exclusiveMaximum:{type:"boolean","default":false},minimum:{type:"number"},exclusiveMinimum:{type:"boolean","default":false},maxLength:{$ref:"#/definitions/positiveInteger"},minLength:{$ref:"#/definitions/positiveIntegerDefault0"},pattern:{type:"string",format:"regex"},additionalItems:{anyOf:[{type:"boolean"},{$ref:"#"}],"default":{}},items:{anyOf:[{$ref:"#"},{$ref:"#/definitions/schemaArray"}],"default":{}},maxItems:{$ref:"#/definitions/positiveInteger"},minItems:{$ref:"#/definitions/positiveIntegerDefault0"},uniqueItems:{type:"boolean","default":false},maxProperties:{$ref:"#/definitions/positiveInteger"},minProperties:{$ref:"#/definitions/positiveIntegerDefault0"},required:{$ref:"#/definitions/stringArray"},additionalProperties:{anyOf:[{type:"boolean"},{$ref:"#"}],"default":{}},definitions:{type:"object",additionalProperties:{$ref:"#"},"default":{}},properties:{type:"object",additionalProperties:{$ref:"#"},"default":{}},patternProperties:{type:"object",additionalProperties:{$ref:"#"},"default":{}},dependencies:{type:"object",additionalProperties:{anyOf:[{$ref:"#"},{$ref:"#/definitions/stringArray"}]}},"enum":{type:"array",minItems:1,uniqueItems:true},type:{anyOf:[{$ref:"#/definitions/simpleTypes"},{type:"array",items:{$ref:"#/definitions/simpleTypes"},minItems:1,uniqueItems:true}]},allOf:{$ref:"#/definitions/schemaArray"},anyOf:{$ref:"#/definitions/schemaArray"},oneOf:{$ref:"#/definitions/schemaArray"},not:{$ref:"#"}},dependencies:{exclusiveMaximum:["maximum"],exclusiveMinimum:["minimum"]},"default":{}})
  
  Jsch.addToDictionary({$schema:"http://json-schema.org/draft-04/hyper-schema#",id:"http://json-schema.org/draft-04/hyper-schema#",title:"JSON Hyper-Schema",allOf:[{$ref:"http://json-schema.org/draft-04/schema#"}],properties:{additionalItems:{anyOf:[{type:"boolean"},{$ref:"#"}]},additionalProperties:{anyOf:[{type:"boolean"},{$ref:"#"}]},dependencies:{additionalProperties:{anyOf:[{$ref:"#"},{type:"array"}]}},items:{anyOf:[{$ref:"#"},{$ref:"#/definitions/schemaArray"}]},definitions:{additionalProperties:{$ref:"#"}},patternProperties:{additionalProperties:{$ref:"#"}},properties:{additionalProperties:{$ref:"#"}},allOf:{$ref:"#/definitions/schemaArray"},anyOf:{$ref:"#/definitions/schemaArray"},oneOf:{$ref:"#/definitions/schemaArray"},not:{$ref:"#"},links:{type:"array",items:{$ref:"#/definitions/linkDescription"}},fragmentResolution:{type:"string"},media:{type:"object",properties:{type:{description:"A media type, as described in RFC 2046",type:"string"},binaryEncoding:{description:"A content encoding scheme, as described in RFC 2045",type:"string"}}},pathStart:{description:"Instances' URIs must start with this value for this schema to apply to them",type:"string",format:"uri"}},definitions:{schemaArray:{type:"array",items:{$ref:"#"}},linkDescription:{title:"Link Description Object",type:"object",required:["href","rel"],properties:{href:{description:"a URI template, as defined by RFC 6570, with the addition of the $, ( and ) characters for pre-processing",type:"string"},rel:{description:"relation to the target resource of the link",type:"string"},title:{description:"a title for the link",type:"string"},targetSchema:{description:"JSON Schema describing the link target",$ref:"#"},mediaType:{description:"media type (as defined by RFC 2046) describing the link target",type:"string"},method:{description:'method for requesting the target of the link (e.g. for HTTP this might be "GET" or "DELETE")',type:"string"},encType:{description:"The media type in which to submit data along with the request",type:"string","default":"application/json"},schema:{description:"Schema describing the data to submit along with the request",$ref:"#"}}}},links:[{rel:"self",href:"{+id}"},{rel:"full",href:"{+($ref)}"}]});
  
  exports.Jsch = Jsch;
})(window);