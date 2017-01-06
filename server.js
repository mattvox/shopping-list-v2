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
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id) {
            this.items.splice(i, 1);
            break;
        }
    }
  },
  editItem: function(id, name) {
      var item = {};
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id) {
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
    storage.deleteItem(request.params.id);
    
    response.json(storage.items);
})

app.put('/items/:id', jsonParser, function(request, response) {
    var item = storage.editItem(request.params.id, request.body.name);
    
    
    response.json(item);
})

app.listen(process.env.PORT || 8080, function() {
    console.log("Running...");
});