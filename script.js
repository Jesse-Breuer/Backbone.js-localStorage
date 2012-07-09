var Thing = Backbone.Model.extend({
     defaults: {
         title: 'blank'
     }
 });
 var ThingView = Backbone.View.extend({
     template: _.template('<b><button id="remove">X</button> <b><button id="edit">Edit</button> <%= title %></b>'),
     editTemplate: _.template('<input class="name" value="<%= name %>" /><button id="save">Save</button>'),
     events: {
         "click #remove": "deleteItem",
         "click #edit": "editItem",
         "click #save": "saveItem",
     },
     deleteItem: function () {
         console.log('deleted');
         this.model.destroy();
         this.remove();
     },
     editItem: function () {
         console.log('editing');
         this.$el.html(this.editTemplate(this.model.toJSON()));
     },
     saveItem: function () {
         console.log('saved');
         editTitle = $('input.name').val();
         console.log(editTitle);
         this.model.save({
             title: editTitle
         });
         this.$el.html(this.template(this.model.toJSON()));
     },
     render: function () {
         var attributes = this.model.toJSON();
         this.$el.append(this.template(attributes));
         return this;
     }
 });
 var ThingsList = Backbone.Collection.extend({
     model: Thing,
     localStorage: new Store("store-name"),
 });

 var thingsList = new ThingsList;
 var ThingsListView = Backbone.View.extend({
     el: $('body'),
     events: {
         'click #add': 'insertItem',
     },
     initialize: function () {
	thingsList.fetch();
    thingsList.toJSON();
         this.render();
         this.collection.on("add", this.renderThing, this);
     },
     insertItem: function (e) {
         newTitle = $('input').val();
         newThing = new Thing({
             title: newTitle
         });
         this.collection.add(newThing);
         newThing.save();
         console.log(this.collection.length);
     },
     render: function () {
         _.each(this.collection.models, function (items) {
             this.renderThing(items);
         }, this);
     },
     renderThing: function (items) {
         var thingView = new ThingView({
             model: items
         });
         this.$el.append(thingView.render().el);
     }
 });
 var thingsListView = new ThingsListView({
     collection: thingsList
 });