
Parse.initialize("P1PqGmsTeS4VgUcRdM7CWhnY5A7mQ62r0UMGecZm", "i1qxHTkX3yWmxQY7jZ8x2PY06oNg75VAtFqVvvCO");

var Router = ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var Drifveri = Parse.Object.extend('Drifveri');

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

var NewDrifveriForm = React.createClass({
  getInitialState: function () {
    return {
      year: '',
      archzero: '',
      skylt: '',
      message: ''
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var drifveri = new Drifveri();
    drifveri.set('year', this.state.year);
    drifveri.set('archzero', this.state.archzero);
    drifveri.set('skylt', this.state.skylt);
    drifveri.save(null, {
      success: function() {
	this.setState({message: "Drifveri tillagt"});
      }.bind(this),
      error: function(drifveri, error) {
	this.setState({message: error.message});
      }.bind(this)
    });
  },
  handleChange: function () {
    this.setState({
      year: this.refs.yearField.getDOMNode().value,
      archzero: this.refs.archzeroField.getDOMNode().value,
      skylt: this.refs.skyltField.getDOMNode().value
    });
  },
  render: function(){
    return (
	<div>
	Lägg till nytt Drifveri
	<MessageBox message={this.state.message} />
	<form onSubmit= {this.handleSubmit}>
	<label htmlFor="year">År</label>
	<input ref="yearField" name='year' type="text" value={this.state.year} onChange={this.handleChange}/>
	<label htmlFor="archzero">Ärken0llan</label>
	<input ref="archzeroField" name='archzero' type="text" value={this.state.archzero} onChange={this.handleChange}/>
	<label htmlFor="skylt">Ärken0llan</label>
	<input ref="skyltField" name='skylt' type="text" value={this.state.skylt} onChange={this.handleChange}/>
	<button type="submit">Lägg till</button>
	</form>
	</div>
    );
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
    if(Parse.User.current()) {
      return (
	<div>
	<RouteHandler />
	</div>
      );
    } else {
      return <p>Lol, du får inte se det här</p>;
    }
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

var DrifvareHandler = React.createClass({
  render: function() {
    return <RouteHandler />;
  }
});

var NewUserPage = React.createClass({
  render: function() {
    return (
	<div>
	<NewUserForm />
	<RouteHandler />
	</div>
    );
  }
});

var UserPage = React.createClass({
  mixins: [Router.State],
  getInitialState: function() {
    return {data: []};
  },
  loadUserFromServer: function() {
    var query = new Parse.Query(Parse.User);
    query.equalTo('username', this.getParams().email);
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
    this.loadUserFromServer();
  },
  componentWillReceiveProps: function () {
    this.loadUserFromServer();
  },
  render: function() {
    var nodes = this.state.data.map(function(user) {
      return (
          <User data={user}/>
      );
    });
    return (
	<div>
	{nodes}
	<RouteHandler />
	</div>
    );
  }
});

var NotFoundPage = React.createClass({
  render: function() {
    return <p>Nu har du gått vilse...</p>;
  }
});

var DrifveriPage = React.createClass({
  render: function() {
    return (
	<div>
	<RouteHandler />
	</div>
    );
  }
});

var routes = (
    <Route handler={App} path="/" >
    <DefaultRoute handler={DrifvarePage} />
    <Route name='login' handler={LoginPage} />
    <Route name="reset" handler={ResetPasswordPage} />
    <Route name="drifvare" path="drifvare" handler={DrifvareHandler}>
    <DefaultRoute handler={DrifvarePage}/>
    <Route name="newDrifvare" path='new' handler={NewUserPage}/>
    <Route name='specificDrifvare' path=':email' handler={UserPage} />
    </Route>
    <Route name="drifveri" handler={DrifveriPage}>
    <DefaultRoute handler={DrifveriPage} />
    <Route name="newDrifveri" path='new' handler={NewDrifveriForm} />
    </Route>
    <Router.NotFoundRoute handler={NotFoundPage} />
    </Route>
);

Router.run(routes, function (Handler) {
  React.render(
      <Handler />, document.getElementById('main')
  );
});
