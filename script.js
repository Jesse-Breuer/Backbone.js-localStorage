var Thing = Backbone.Model.extend({
     defaults: {
         title: 'blank'
     }
 });
 var ThingView = Backbone.View.extend({
     template: _.template('<b><button id="remove">X</button> <b><button id="edit">Edit</button> <%= title %></b>'),//template for normal display
     editTemplate: _.template('<input class="name" value="<%= name %>" /><button id="save">Save</button>'),//template for edit mode
     events: {
         "click #remove": "deleteItem",
         "click #edit": "editItem",
         "click #save": "saveItem",
     },

     deleteItem: function () {
         this.model.destroy();
         this.remove();
     },

     editItem: function () {
         this.$el.html(this.editTemplate(this.model.toJSON())); //switch to edit template which has an inout field
     },

     saveItem: function () {
         editTitle = $('input.name').val(); //use value entered in edit template's input field
         this.model.save({
             title: editTitle //assign title to value entered
         });
         this.$el.html(this.template(this.model.toJSON()));//show normal display template with new value
     },
     render: function () {
         var attributes = this.model.toJSON();
         this.$el.append(this.template(attributes));//render with normal display mode template
         return this;
     }
 });
 var ThingsList = Backbone.Collection.extend({
     model: Thing,
     localStorage: new Store("store-name"), //initialize local storage
 });

 var thingsList = new ThingsList; //initialize

 var ThingsListView = Backbone.View.extend({ //collectionView
     el: $('body'),
     events: {
         'click #add': 'insertItem',
     },

    initialize: function () {
	thingsList.fetch();
    thingsList.toJSON(); //fetch collection and put in json format
         this.render(); //render collection
         this.collection.on("add", this.renderThing, this); //watch for add event and call renderThing
     },
     insertItem: function (e) {
         newTitle = $('input').val(); //set the title to the value entered into the form field
         newThing = new Thing({
             title: newTitle
         });
         this.collection.add(newThing); //add new item to collection
         newThing.save();
         console.log(this.collection.length);
     },
     //render is for the whole collection. renderThing is for an individual item, used when adding.
     render: function () {
         _.each(this.collection.models, function (items) {
             this.renderThing(items);// render uses renderThing on each item
         }, this);
     },
     renderThing: function (items) {//render the individual item
         var thingView = new ThingView({
             model: items
         });
         this.$el.append(thingView.render().el);//append to collection using modelView
     }
 });
 var thingsListView = new ThingsListView({ //initialize collectioView
     collection: thingsList
 });