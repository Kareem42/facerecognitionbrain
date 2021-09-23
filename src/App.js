import { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Signin from './Components/Sigin/Signin';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai';
import Logo from './Components/Logo/Logo';
import Register from './Components/Register/Register';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'ba126723a3da426d894f4cd4b68b8cb8'
});

const particleOptions = {
  particles: {
    number: { value: 100, density: { enable: true, value_area: 800 } }
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: { enable: true, mode: "grab" },
      resize: true
    },
    modes: {
      grab: { distance: 500, duration: 0.4 },
    },
    shape: {
      type: {type: "star"},
    } 
  },
  retina_detect: true
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event)=> {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict
    (Clarifai.FACE_DETECT_MODEL,
     this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response))
      .catch(err => console.log(err))
  )}

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
       <div className="App">
       <Particles className='particles'
              params={ particleOptions }
            />
       <Navigation isSignedIn={ isSignedIn } onRouteChange={ this.onRouteChange } />
       { route === 'home'
       ? <div> 
          <Logo />
          <Rank />
          <ImageLinkForm 
            onInputChange={ this.onInputChange } 
            onButtonSubmit={ this.onButtonSubmit } 
        />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
        : (
          route === 'signin' 
          ? <Signin onRouteChange={ this.onRouteChange } />
          : <Register onRouteChange={ this.onRouteChange } />
        )
       }

    </div>
  
    );
  }
}

export default App;
