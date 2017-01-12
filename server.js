var express = require('express');
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  },
  deleteItem: function(id) {
//    console.log('delete running...');
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id) {
//            console.log(this.items[i].name + " deleted!");
            this.items.splice(i, 1);
            return true;
        }
    }
    return false;
  },
  editItem: function(id, name) {
    var item = {};
//      console.log('name', name);
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id && name != "" && name != undefined) {
            this.items[i].name = name;
            item = this.items[i];
            break;
        }
    }
    return item;
  }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(request, response) {        
    if (storage.deleteItem(request.params.id)) {
        response.status(200).json(storage.items);
    } else {
//        console.log('failure');
//        return response.sendStatus(404);
        response.status(404).json({status: "Item not found"});
    }
})

app.put('/items/:id', jsonParser, function(request, response) {
    var item = storage.editItem(request.params.id, request.body.name);
//    console.log(item, 'item');
    
    if (item.hasOwnProperty('name')) {
        response.status(200).json(item);
    } else {
        response.status(403).json({status: "Bad request"});
    }
    
    
//    If the request is incorrectly formed (bad body, missing id), the request should fail gracefully
//    If a non-existent ID is supplied, your endpoint should create a new item using the ID supplied.
//    Remember that you're passing the ID in the request.params and the request.body, so you should check that they match as well.
})

app.listen(process.env.PORT || 8080, function() {
    console.log("Running...");
});

exports.app = app;
exports.storage = storage;