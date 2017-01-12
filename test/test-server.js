var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {
    
// Successes
    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });

    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });
    
    it('should edit an item on PUT', function(done) {
        chai.request(app)
            .put('/items/1')
            .send({'name': 'Changed'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Changed');
                done();
        })
    });
    
    it('should delete an item on DELETE', function(done) {
        chai.request(app)
            .delete('/items/2')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                storage.items.should.be.a('array');
                storage.items.should.have.length(3);
                storage.items[2].should.be.a('object');
                storage.items[2].should.have.property('id');
                storage.items[2].should.have.property('name');
                storage.items[2].id.should.be.a('number');
                storage.items[2].name.should.be.a('string');
                storage.items[2].name.should.equal('Kale');
                done();
            });
    });
    
// Failures
    
    it('should FAIL POST without body data', function(done) {
        chai.request(app)
            .post('/items')
            .send({})
            .end(function(err, res) {
                res.should.have.status(400);
                done();
        })
    })
    
    it('should FAIL PUT if you send an empty body without name', function(done) {
        chai.request(app)
            .put('/items/1')
            .send({})
            .end(function(err, res) {
                res.should.have.status(403);
                done();
        });
    })
    
    it('should FAIL PUT if you try to edit item without an ID as endpoint', function(done) {
        chai.request(app)
            .put('/items/asdasd')
            .send({'name': 'Changed'})
            .end(function(err, res) {
                res.should.be.json;
                res.body.status.should.equal("Bad request");
                res.should.have.status(403);
                done();
        });
    })
    
    it('should FAIL DELETE if you try to delete an ID that does not exist', function(done) {
        chai.request(app)
            .delete('/items/2000')
            .end(function(err, res) {      
                res.should.be.json;
                res.body.status.should.equal("Item not found");
                res.should.have.status(404);
            
                done();
            });
    })
    
    it('should FAIL DELETE if you try to delete without an ID as endpoint', function(done) {
        chai.request(app)
            .delete('/items/asdasd')
            .end(function(err, res) {
                res.should.be.json;
                res.body.status.should.equal("Item not found");
                res.should.have.status(404);
                done();
        });
    })
});


//Stub the following tests:

//POST to an ID that exists?????
//POST with something other than valid JSON?????

//PUT without an ID in the endpoint?????
//PUT to an ID that doesn't exist?????

//PUT with different ID in the endpoint than the body
//PUT without body data
//PUT with something other than valid JSON