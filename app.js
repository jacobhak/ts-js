
Parse.initialize("P1PqGmsTeS4VgUcRdM7CWhnY5A7mQ62r0UMGecZm", "i1qxHTkX3yWmxQY7jZ8x2PY06oNg75VAtFqVvvCO");

var Router = ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// Non React functions are not used, they're only examples...

function newUser() {
  var user = new Parse.User();
  user.set("username", "jacobhak");
//  user.set("password", "put pass here");
  user.set("email", "jacobhakansson@gmail.com");
  

  user.set("phone", "0730299463");
  user.set("address", "Gustav III:s boulevard 4");
  user.set("postal_code", "16972");
  user.set("city", "Solna");
  user.set("country", "Sverige");
  
  user.signUp(null, {
    success: function(user) {
      // Hooray! Let them use the app now.
    },
    error: function(user, error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
    }
    
  });
}
function resetPassword() {
  Parse.User.requestPasswordReset("jacobhakansson@gmail.com", {
    success: function() {
      // Password reset request was sent successfully
    },
    error: function(error) {
      // Show the error message somewhere
      alert("Error: " + error.code + " " + error.message);
    }
  });
}
function getUserWithUsername(username) {
  var data;
  var query = new Parse.Query(Parse.User);
//  query.equalTo('username', username);
  query.find({
    success: function (user) {
      console.log(user);
      data = user;
    },
    error: function (object, error) {
      console.log(error);
    }
  });
}

//getUserWithUsername("jacobhak");

//resetPassword();

var MessageBox = React.createClass({
  render: function() {
    if (this.props.message === "") {
      return <div className="hidden"/>;
    } else {
      return <div className="errorAlert">{this.props.message}</div>;
    }
  }
});

var ImageContainer = React.createClass({
  render: function () {
    return <img src={this.props.imgUrl}/>;
  }
});

var GravatarContainer = React.createClass({
  render: function() {
    return <ImageContainer imgUrl={"http://gravatar.com/avatar/" + md5(this.props.userEmail)} />;
  }
});

var NewUserForm = React.createClass({
  getInitialState: function() {
    return {email: '', message: ""};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var user = new Parse.User();
    user.set("username", this.state.email);
    user.set("password", "" + Math.random());
    user.set("email", this.state.email);
    
    user.signUp(null, {
      success: function(user) {
	this.setState({message: "Drifvare tillagd"});
      }.bind(this),
      error: function(user, error) {
	this.setState({message: error.message});
      }.bind(this)
    }); 

  },
  handleChange: function () {
    this.setState({email: this.refs.emailField.getDOMNode().value});
  },
  render: function(){
    return (
	<div>
	Lägg till ny Drifvare
	<MessageBox message={this.state.message} />
	<form onSubmit= {this.handleSubmit}>
	<label htmlFor="email">E-mail</label>
	<input ref="emailField" type="email" name="email" value={this.state.email} onChange={this.handleChange}/>
	<button type="submit">Lägg till</button>
	</form>
	</div>
    );
  }
});

var NewUserGenericForm = React.createClass({
  submit: function(e) {
    e.preventDefault();
    var state = this.refs.form.state;
    var user = new Parse.User();
    user.set("username", state.email);
    user.set("password", "" + Math.random());
    user.set("email", state.email);
    
    user.signUp(null, {
      success: function(user) {
	this.setState({message: "Drifvare tillagd"});
      }.bind(this),
      error: function(user, error) {
	this.setState({message: error.message});
      }.bind(this)
    }); 
  },
  render: function() {
    return (
	<GenericForm ref='form' submit={this.submit} submitText="Lägg till">
	<label htmlFor="email">E-mail</label>
	<input ref="emailField" type="email" name="email"
      value={this.refs.form.state.email} onChange={this.refs.form.handleChange}/>
	</GenericForm>
    );
  }
});

var GenericForm = React.createClass({
  stateFromChildren: function() {
    var state = {};
    React.Children.forEach(this.props.children, function(child){
      if(child.props.name) {
	console.log(child.props.name);
	state[child.props.name] = child.value;
      }
    });
    return state;
  },
  getInitialState: function() {
    var state = this.stateFromChildren();
    state['message'] = '';
    return state;
  },
  handleChange: function () {
    this.setState(this.stateFromChildren());
    console.log(this.state);
  },
  render: function() {
    return (
	<div>
	<MessageBox message={this.state.message} />
	<form onSubmit={this.props.submit} >
	{this.props.children}
	<button type="submit">{this.props.submitText}</button>
	</form>
      </div>
    );
  }
});

var ResetPasswordForm = React.createClass({
  getInitialState: function() {
    return {email: "", errorMessage: ""};
  },
  handleSubmit: function (e) {
    e.preventDefault();
    Parse.User.requestPasswordReset(this.state.email, {
      success: function() {
	this.setState({errorMessage: "Ett mail har skickats"});
      }.bind(this),
      error: function(error) {
	this.setState({errorMessage: error.message});
      }.bind(this)
    });
  },
  handleChange: function () {
    this.setState({email: this.refs.emailField.getDOMNode().value});
  },
  render: function () {
    return (
	<div>
	<h1>Återställ Lösenord</h1>
	<MessageBox message={this.state.errorMessage} />
	<form onSubmit={this.handleSubmit}>
	<label htmlFor="email">E-mail</label>
	<div className="row">
	<input ref="emailField" type="email" name="email" value={this.state.email} onChange={this.handleChange}/>
	</div>
	<button type="submit">Skicka</button>
	</form>
	</div>
    );
  }
});

var LoginForm = React.createClass({
  getInitialState: function () {
    return {username: "", password: "", errorMessage: ""};
  },
  handleLogin: function(e) {
    e.preventDefault();
    console.log("lol, got a click");
    console.log(this.state);
    Parse.User.logIn(this.state.username, this.state.password, {
      success: function(user) {
	console.log("logged in!");
	this.setState({errorMessage: ""});
      }.bind(this),
      error: function(user, error) {
	console.log("login error:");
	console.log(error);
	var message = error.message;
	this.setState({errorMessage: message});
      }.bind(this)
    });
  },
  handleChange: function () {
    this.setState({
      username: this.refs.emailField.getDOMNode().value,
      password: this.refs.passwordField.getDOMNode().value
    });
  },
  render: function() {
    return (
	<div>
	<h1>Logga in</h1>
	<MessageBox message={this.state.errorMessage} />
	<form onSubmit={this.handleLogin}>
	<label htmlFor="email">E-mail</label>
	<div className="row">
	<input ref="emailField" type="email" name="email" value={this.state.username} onChange={this.handleChange}/>
	</div>
	<div className="row">
	<label htmlFor="password">Lösenord</label>
	</div>
	<div className="row">
	<input ref="passwordField" type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
	</div>
	<button type="submit" >Logga in</button>
	</form>
	</div>
    );
  }
});
var UserBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadUsersFromServer: function() {
    var query = new Parse.Query(Parse.User);
    //  query.equalTo('username', username);
    query.find({
      success: function (user) {
	this.setState({data: user});
	console.log(this.state.data);
      }.bind(this),
      error: function (object, error) {
	console.log(error);
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadUsersFromServer();
  },
  render: function() {
    return (
      <div className="commentBox">
	Användare:
        <UserList data={this.state.data} />
	<GravatarContainer userEmail="jacobhakansson@gmail.com" />
	<NewUserGenericForm />
      </div>
    );
  }
});
var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});
var UserList = React.createClass({
  render: function() {
    var nodes = this.props.data.map(function(user) {
      return (
          <User data={user}/>
      );
    });
    return (
	<div className="commentList">
	{nodes}
	</div>
    );
  }
});
var User = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
        {this.props.data.get("username")}
        </h2>
        Phone: {this.props.data.get("phone")}
      </div>
    );
  }
});

var App = React.createClass({
  render: function() {
    return (
	<div>
	<RouteHandler />
	</div>
    );
  }
});

var LoginPage = React.createClass({
  render: function() {
    return (
	<div>
	<LoginForm />
	<RouteHandler />
	</div>
    );
  }
});

var ResetPasswordPage = React.createClass({
  render: function() {
    return (
	<div>
	<ResetPasswordForm />
	<RouteHandler />
	</div>
    );
  }
});

var DrifvarePage = React.createClass({
  render: function() {
    return (
      <div>
	<UserBox />
	<RouteHandler />
	</div>
    );
  }
});

var routes = (
    <Route handler={App} path="/" >
    <Route name='login' handler={LoginPage} />
    <Route name="reset" handler={ResetPasswordPage} />
    <Route name="drifvare" handler={DrifvarePage} />
    </Route>
);

Router.run(routes, function (Handler) {
  React.render(
      <Handler />, document.getElementById('main')
  );
});
