(function(){

//ユーザーのmodelを表現
var User = Backbone.Model.extend({
	defaults: {
		number: 1,
		name: 'hogehuga',
		age: 20
	},
	validate: function(attrs) {
		if (_.isEmpty(attrs.name)) {
			return 'please enter your name';
		}
		if (_.isEmpty(attrs.age)) {
			return 'please enter your age';
		}
	},
	initialize: function() {
		this.on('invalid', function(model, error) {
			$('#error').html(error);
		})
	}
});

var Users = Backbone.Collection.extend({model: User});

// ユーザーviewを表現
var UserView = Backbone.View.extend({
	tagName: 'p',
	template: _.template($('#user-template').html()),
	render: function() {
		console.log("---------- UserView render");
		var template = this.template(this.model.toJSON());
		this.$el.html(template);
		return this;
	}
});

// ユーザー一覧viewを表現
var UsersView = Backbone.View.extend({
	tagName: 'p',
	initialize: function() {
		console.log("-------- UsersView initialize");
		this.collection.on('add', this.addNew, this);
	},
	addNew: function(user) {
		console.log("-------- UsersView addNew");
		var userView = new UserView({model: user});
		// 入力内容のクリア
		$('#name').val('').focus();
		$('#age').val('');
		this.$el.append(userView.render().el);
	},
	render: function() {
		console.log("-------- UsersView render");
		this.collection.each(function(task) {
			var userView = new UserView({model: user});
			this.$el.append(userView.render().el);
		}, this);
		return this;
	}
});

// ユーザー登録viewを表現
var AddUserView = Backbone.View.extend({
	el: $('div.main'),
	events: {
		'click .register': 'register'
	},
	register: function(e) {
		e.preventDefault();
		var user = new User();
		if (user.set({name: $('#name').val(), age: $('#age').val()}, {validate: true})) {
			this.collection.add(user);
			$('#error').empty();
		}
	}
});

var users = new Users();
var usersView = new UsersView({collection: users});
var addUserView = new AddUserView({collection: users});

$('#userList').html(usersView.render().el);



}());
