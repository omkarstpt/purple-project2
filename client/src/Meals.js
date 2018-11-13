import React, { Component } from 'react';
import logo from './logo.svg';
import Nav from './Nav.js'
import Post from './Posts.js'
import AddMeal from './AddMeal.js'

class Meals extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      author: '',
      name: '',
      description: '',
      number: '',
      location: '',
      id: 0
    };
    this.postToServer = this.postToServer.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.loadPostsFromServer();
    this.getMyLocation();
    const { author, text, name, description, number, updateId } = this.state;
    if (!this.pollInterval) {
      this.pollInterval = setInterval(this.loadPostsFromServer, 2000);
    }
  }

  componentWillUnmount() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = null;
  }

  loadPostsFromServer = () => {
    // fetch returns a promise. If you are not familiar with promises, see
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    fetch('/api/posts/')
      .then(data => data.json())
      .then((res) => {
        if (!res.success) this.setState({ error: res.error });
        else this.setState({ data: res.data });
      });
  }
  getMyLocation() {
    console.log("Loc");
    const location = window.navigator && window.navigator.geolocation
    console.log(location);
    if (location) {
      location.getCurrentPosition((position) => {
	//console.log(position.coords.longitude);
	var locationStr="";
        locationStr=locationStr.concat(position.coords.latitude,",",position.coords.longitude);
	this.setState({location: locationStr});
	console.log(locationStr);
        //this.setState({
        //  latitude: position.coords.latitude,
        //  longitude: position.coords.longitude,
        //})
      }, (error) => {
        this.setState({ latitude: 'err-latitude', longitude: 'err-longitude' })
      })
    }

  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  /* use to delete all posts */
  deletePosts = () => {
    fetch('/api/posts/', { method: 'DELETE' })
      .then(data => data.json())
      .then((res) => {
        if (!res.success) this.setState({ error: res.error });
        else this.setState({ data: res.data });
      });
  }

  postToServer() {
    const {author, name, number, description} = this.state;
    const data = [...this.state.data, {author, name, description, number}];
    this.setState({ data });
    fetch('/api/newfood/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({author, description, number:parseInt(number), name})
    }).then(res => res.json()).then((res) => {
      if (!res.success) console.log("holyy");
      else this.setState({author: '',description: '',number: '',name: '' });
    });
  }

  like(id) {
    console.log(id);
    console.log("hi")
    fetch('/api/newlike/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({author:'Abi', id})
    }).then(res => res.json()).then((res) => {
      if (!res.success) console.log("holyy");
    });
  }



  render() {
    return (
      <div>
        <Nav />
        <AddMeal handleChange={this.handleChange} postToServer={this.postToServer}/>
        <Post like={this.like} posts={this.state.data}/>
      </div>
    );
  }
}

export default Meals;
