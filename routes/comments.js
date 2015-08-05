var express = require('express');
var router  = express.Router();
var model = require('../models/comments.js');

router.get('/', function(req, res, next) {
    if(!req.query.article_id) {
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({"validation": "no article_id in query params!"}));
        return false;
    }

    var limit = 10;
    var offset = 0;

    if(req.query.limit) {
        console.log(req.query.limit);
        limit = Number(req.query.limit);
    }

    if(req.query.offset)
        offset = Number(req.query.offset);

    var userId = req.user.id;

    model.list({
        articleId: req.query.article_id,
        limit: limit,
        offset: offset
    }, function(result) {
        model.formatNestedProfile(result, userId, function(result) {
            res.json(result);
        })
    })

});

router.post('/', function(req, res, next){

    if(!req.body.text) {
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({"validation": "text cannot be empty!"}));
        return false;
    }

    model.create({
        article_id: req.body.article_id,
        currentUserId: req.user.id,
        text: req.body.text
    }, function(result) {
        model.view(result.insertId, function(result){
            model.formatNestedProfile(result, req.user.id, function(result) {
                res.json(result[0]);
            })

        });

    })
});

router.put('/:id', function(req, res, next) {

    model.view(Number(req.params.id), function(result) {

        if(!result[0]) {
            res.status(404);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({"Comment": "Not found!"}));
            return false;
        }

        if(result[0].user_id != req.user.id) {
            res.status(403);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({"Error": "You have no permission to edit this object!"}));
            return false;
        }

        var text = '';
        if(!req.body.text)
            text = result[0].text;
        else
            text = req.body.text;

        model.modify({
            id: Number(req.params.id),
            text: text
        }, function(result) {
            model.view(req.params.id, function(result) {
                model.formatNestedProfile(result, req.user.id, function(result) {
                    res.json(result[0]);
                })
            })
        })

    });
});

router.delete('/:id', function(req, res, next) {
    model.view(req.params.id, function(result){
        if(!result[0]) {
            res.status(404);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({"Comment": "Not found!"}));
            return false;
        }

        if(result[0].user_id != req.user.id) {
            res.status(403);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({"Error": "You have no permission to edit this object!"}));
            return false;
        }

        model.delete(req.params.id, function(result) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({"Success": "Comment deleted successfully!"}));
        })
    });
});

module.exports = router;