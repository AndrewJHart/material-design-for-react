import React from 'react';
import { Link } from 'react-router-dom';
import MUIBase from '../lib/MUIBase';
import Button from '../lib/Button'
import MainHeader from './MainHeader.jsx';
import List from '../lib/List';
import ListItem from '../lib/ListItem';
import Theme from '../lib/Theme';
import Typography from '../lib/Typography';


class Splash extends MUIBase {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.injectMui().then(() => {

    }).catch((err) => {
      alert('injection error ' + err);
    });
  }

  render() {
    return (
      <div style={{ backgroundSize: 'cover', height: '100vh', backgroundImage: 'url("images/16-9.jpg")' }}>
        <div style={{
          margin: '0 auto',
          padding: (window.innerHeight / 2 - 200) + 'px 0',
          textAlign: 'center'
        }}>
          <p><Typography font='display4'>React for Material Design</Typography></p>
          <p>
            <Typography font='display1' style={{color: 'lightgrey'}}>
              React components that implement Material Components for the WEB
            </Typography>
          </p>
          <p>
            <Typography font='display1'>
              <Button raised={true}
                onClick={(() => {
                window.location = '/welcome';

              })}
              style={{height: '2em', marginTop: '24px', fontSize: '1em', color: 'white'}}>GET STARTED</Button>
            </Typography>
            <div style={{color: 'lightGrey', textAlign: 'center', 
              position: 'absolute', width: '100%', bottom: '0px'}}>
              <Typography font='body1'>
                Site built with React for Material Design &copy; 2017
              </Typography>
            </div>
          </p>
        </div>
      </div>

    )
  }

}

export default Splash;