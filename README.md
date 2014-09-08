# Jsch

## Description

A script to render JSON data connected to a JSON-Schema with bootstrap to show, edit or create data as json and validate it directly with a JSON-Schema.

## How to set up

You just have to add the `jsch.js` file as script resource to a html document that have also includes the follwing resources: 

### Requirements
* [JQuery](http://code.jquery.com/jquery-2.1.1.min.js)
* Bootstrap [JS files](http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js) and [CSS files](http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css)
* [underscore](http://underscorejs.org/underscore.js)

### Optional, but recommanded
You are able to add the jsch CSS files to see validations responsive on your webbrowser.

### Example
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Jsch eyample</title>
    
    <!-- Resources you have to insert --> 
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" title="Bootstrap CSS" media="screen"/>
    <link rel="stylesheet" href="jsch.css"/>
    
    <script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script src="http://underscorejs.org/underscore.js"></script>
    <script src="./jsch.js"></script>
    
    <!-- An example how to work with Jsch --> 
    <script type="text/javascript">
$(document).ready(function(){
  // Define a JSON-Schema
  var schema = {
    id: "http://atd-schubert.com/test",
    title: "Test JSON Schema",
    description: "A JSON schema to test Jsch",
    type: ["null", "string", "object", "number", "integer", "array"],
    minLength: 6,
    maxLength:12,
    maxProperties: 2,
    minProperties: 1,
    maxItems: 2,
    minItems: 1,
    //uniqueItems: true,
    minimum: 6,
    maximum:12,
    exclusiveMinimum: true,
    pattern: "^(Test |test )",
    additionalItems: false,
    items: [
      {type:"string"},
      {type:"object"},
      {default:"letzte..."}
    ],
    additionalProperties: false,
    patternProperties: {
      "^s_":{
        id:"http://atd-schubert.com/string",
        title:"Only string subnode as pattern",
        type:"string",
        default:"An empty string..."
      },
      "^i_":{
        id:"http://atd-schubert.com/number",
        title:"Only numbers subnode as pattern",
        type:"integer",
        default:123
      },
    },
    properties: {
      example: {
        title: "Example Schema",
        type: "object",
        properties: {
          firstName: {
            type: "string"
          },
          lastName: {
            type: "string"
          },
          age: {
            description: "Age in years",
            type: "integer",
            minimum: 0
          }
  
        },
        additionalProperties: false,
        required: ["firstName", "lastName"]
      },
      anything: {},
      email:{
        id:"http://atd-schubert.com/email",
        title: "E-Mail validation",
        description:"A validation with format email",
        format: "email",
        default: "ich@was.de",
        type:"string"
      },
      hostname:{
        id:"http://atd-schubert.com/hostname",
        title: "Hostname validation",
        description:"A validation with format hostname",
        format: "hostname",
        default: "atd-schubert.com",
        type:"string"
      },
      ipv4:{
        id:"http://atd-schubert.com/ipv4",
        title: "IP validation",
        description:"A validation with format ip",
        format: "ipv4",
        default: "192.168.1.1",
        type:"string"
      },
      ipv6:{
        id:"http://atd-schubert.com/ipv6",
        title: "IPv6 validation",
        description:"A validation with format ipv6",
        format: "ipv6",
        default: "2001:db8:0:0:0:0:2:1",
        type:"string"
      },
      jsonSchema: {
        $ref: "http://json-schema.org/draft-04/schema#"
      }
    }
  };
  
  // Create a new Jsch object
  jsch = new window.Jsch({jsonSchema: schema, data: "You can directly put content to the result json and display it"});
  
  // Append jsch-dom-root to an existing html-node to display...
  $("#out").append(jsch.domElements.root);
});
    </script>
  </head>
  <body role="document">
    <div role="main">
    <div id="out"></div>
      
    </div>
  </body>
</html>
```
