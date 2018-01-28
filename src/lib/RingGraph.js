import React from 'react';
import MUIBase from './MUIBase';

/**
 * Checkbox
 * 
 * Props:
 * 
 */

class RingGraph extends MUIBase {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.injectMui().then(() => {

      this.setState({ update: true });

    }).catch((err) => {
      alert('injection error ' + err);
    });
  }

  /**
   * Draw chart.  Found this here --> http://thecodeplayer.com/walkthrough/make-gauge-charts-using-canvas-and-javascript
   */
  componentDidUpdate() {

    let canvas = document.getElementById(this.props.id + '_canvas');
    let ctx = canvas.getContext("2d");
    //dimensions
    let W = canvas.width;
    let H = canvas.height;
    //Variables
    let degrees = 0;
    let new_degrees = 0;
    let difference = 0;
    let color = "#0072ce"; // ring fill
    let bgColour = "#000";
    let indeterminate;
    let lineWidth;
    let propsText;
    let propsValue;
    let textColour;
    let type;

    let theme = document.getElementById('reactMaterialTheme');
    if (theme !== null) {
      let inner = theme.innerHTML;
      let start = inner.indexOf('#');
      let end = start + 7;
      let primary = inner.substring(start, end);
      if (undefined === this.props.ringColor) {
        color = primary;
      } else {
        color = this.props.ringColor;
      }

      start = inner.indexOf('#', end);
      end = start + 7;
      let secondary = inner.substring(start, end);
      if (undefined === this.props.ringBackground) {
        bgColour = secondary;
      } else {
        bgColour = this.props.ringBackground;
      }

    }


    let text;
    let animation_loop, redraw_loop;

    function init() {
      //Clear the canvas everytime a chart is drawn
      ctx.clearRect(0, 0, W, H);

      //Background 360 degree arc
      ctx.beginPath();
      ctx.strokeStyle = bgColour;
      ctx.lineWidth = W / 10;
      if ( lineWidth ) {
        ctx.lineWidth = lineWidth;
      }

      //ctx.arc(W / 2, H / 2, 100, 0, Math.PI * 2, false); //you can see the arc now
      if (type !== 'singleFill') {
        ctx.arc(W / 2, H / 2, W / 3, 0, Math.PI * 2, false); //you can see the arc now
        ctx.stroke();
      }

      //gauge will be a simple arc
      //Angle in radians = angle in degrees * PI / 180
      var radians = degrees * Math.PI / 180;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = W / 10;
      if ( lineWidth ) {
        ctx.lineWidth = lineWidth;
      }
      //The arc starts from the rightmost end. If we deduct 90 degrees from the angles
      //the arc will start from the topmost end
      ctx.arc(W / 2, H / 2, W / 3, 0 - 90 * Math.PI / 180, radians - 90 * Math.PI / 180, false);
      //you can see the arc now
      ctx.stroke();

      //Lets add the text
      ctx.fillStyle = textColour;
      ctx.font = W / 6 + 'px helvetica';
      text = undefined !== propsText ? propsText : propsValue + '%';
      //text = propsValue + "%";
      //Lets center the text
      //deducting half of text width from position x
      let text_width = ctx.measureText(text).width;
      //adding manual value to position y since the height of the text cannot
      //be measured easily. There are hacks but we will keep it manual for now.
      ctx.fillText(text, W / 2 - text_width / 2, H / 2 + 10);
    }

    function draw(value, propsValue) {
      //Cancel any movement animation if a new chart is requested
      if (typeof animation_loop != undefined) clearInterval(animation_loop);
      //This will animate the gauge to new positions
      animate_to(value);
    }

    //function to make the chart move to new degrees
    function animate_to(value) {
      degrees = value;
      init();
    }

    indeterminate = this.props.indeterminate;
    lineWidth = this.props.lineWidth;
    propsText = this.props.text;
    propsValue = this.props.value;
    textColour = (undefined === this.props.ringTextColor ? '#000' : this.props.ringTextColor);
    type = this.props.type;

    if (indeterminate) {

      let progress = 0;
      let iteration = 1;
      let timer = window.setInterval(() => {
        progress++;
        propsValue = progress;
        console.log('progress is now: ' + progress);
        draw(360 * progress / 100);
        if (progress === 100) {
          progress = 0;
          iteration++;

          if (iteration % 2 === 0) {
            let temp = bgColour;
            bgColour = color;
            color = temp;
          } else {
            let temp = color;
            color = bgColour;
            bgColour = temp;
          }
          //window.clearInterval(timer);
          //document.body.style.backgroundColor = 'white';
        }
      }, 20);
      return;
    }
    draw(360 * this.props.value / 100);

  }

  indeterminate() {

    let progress = 0;
    let timer = window.setInterval(() => {
      progress++;
      console.log('progress is now: ' + progress);
      draw(360 * progress / 100);
      if (progress === 100) {
        window.clearInterval(timer);
        document.body.style.backgroundColor = 'white';
      }
    }, 20);
  }

  render() {
    let className = '';

    if (undefined !== this.props.color) {
      className += ' ' + (this.props.color === 'secondary' ? 'mdc-linear-progress--accent' : '');
    }


    return (
      <div id={this.props.id} style={this.getStyle(this.props)} className={className}>

        <canvas id={this.props.id + '_canvas'}
          width={undefined === this.props.width ? 300 : this.props.width}
          height={undefined === this.props.height ? 300 : this.props.height}
        />

      </div>
    )
  }
}

export default RingGraph;

