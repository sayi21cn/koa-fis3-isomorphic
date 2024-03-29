const parse = require('co-body');
const render = require('../lib/views');
const todos = require('../models/todos');
const pages = require('../lib/pages');

const dataMock = require('../mock/indexPage');

/**
 * Item List.
 */
exports.indexPage = function*() {
    var results = yield todos.find({});
    var data = dataMock.result;

    this.body = yield pages('index', { 
            pageMenu: data.pageMenu,
            keywords: data.keywords,
            banner2: data.banner2,
            banner3: data.banner3,
            slider: data.slider,
            tabRecmend: data.tabs.recmendList,
            tabMore: data.tabs.moreList,
            panel3: data.panel3
        });
};


/**
 * Form for creating new todo item.
 */
exports.add = function*() {
    this.body = yield render('new');
};

/**
 * Form for editing a todo item.
 */
exports.edit = function*(id) {
    var result = yield todos.findById(id);
    console.log(JSON.stringify(result));
    if (!result) {
        this.throw(404, 'invalid todo id');
    }
    this.body = yield render('edit', { todo: result });
};

/**
 * Show details of a todo item.
 */
exports.show = function*(id) {
    var result = yield todos.findById(id);
    if (!result) {
        this.throw(404, 'invalid todo id');
    }
    this.body = yield render('show', { todo: result });
};

/**
 * Delete a todo item
 */
exports.remove = function*(id) {
    yield todos.remove({ "_id": id });
    this.redirect('/');
};

/**
 * Create a todo item in the data store
 */
exports.create = function*() {
    var input = yield parse(this);
    console.log(input);
    var d = new Date();
    yield todos.insert({
        name: input.name,
        description: input.description,
        created_on: d,
        updated_on: d
    });
    this.redirect('/');
};

/**
 * Update an existing todo item.
 */
exports.update = function*() {
    var input = yield parse(this);
    console.log(input);
    yield todos.updateById(input.id, {
        name: input.name,
        description: input.description,
        created_on: new Date(input.created_on),
        updated_on: new Date()
    });
    this.redirect('/');
};
