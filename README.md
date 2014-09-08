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
  };

  // Create a new Jsch object
  jsch = new window.Jsch({jsonSchema: schema, data: "You can directly put content to the result json and display it"});

  // Append jsch-dom-root to an existing html-node to display...
  $("#jsch").append(jsch.domElements.root);
  
  // Get and set JSON data to a jsch
  $("#getJson").on("click", function(){
    document.getElementById("json").value = JSON.stringify(jsch.getData());
  });
  $("#setJson").on("click", function(){
    jsch.setData(JSON.parse(document.getElementById("json").value));
  });
  
});
    </script>
  </head>
  <body role="document">
    <div role="main">
      <div id="jsch"></div>
      
      <div id="control">
        <hr/>
        <textarea id="json" style="display: block; width: 100%; min-height: 300px;" placeholder="JSON Data"></textarea>
        <button id="getJson" class="btn">get</button>
        <button id="setJson" class="btn">set</button>
        
      </div>

    </div>
  </body>
</html>

```
