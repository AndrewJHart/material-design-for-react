import React from 'react';
import MUIBase from './MUIBase';

/**
 * TextField
 * 
 * Props:
 * id: idToBeUsed
 * placeholder=Placeholder (Hint text)
 * type = text | password
 * label = SomeValue
 * style={styleObject}
 */
class TextField extends MUIBase {
  constructor(props) {
    super(props);

    this.state = {
      data: null
    }


  }

  componentDidMount() {
    this.injectMui().then(() => {

      var tfRoot = document.querySelectorAll('.mdc-textfield');
      console.log(tfRoot.length);
      for (var i = 0; i < tfRoot.length; i++) {
        var tf = tfRoot[i];
        new mdc.textfield.MDCTextfield(tf);
      }

      //var helptext = document.querySelector('.mdc-textfield-helptext');
      //var tf = new mdc.textfield.MDCTextfield(helptext);

      //document.getElementById('required').addEventListener('change', function (evt) {
      //  var target = evt.target;
      //  helptext.querySelector('.mdc-textfield__input').required = target.checked;
      //});
      /*
    document.getElementById('use-helptext').addEventListener('change', function (evt) {
      var target = evt.target;
      tf.helptextElement = target.checked ? helptext : null;
      helptext.style.display = target.checked ? 'block' : 'none';
      document.getElementById('persistent-help-text').disabled = !target.checked;
      document.getElementById('helptext-as-validation').disabled = !target.checked;
    });
    document.getElementById('persistent-help-text').addEventListener('change', function (evt) {
      var target = evt.target;
      helptext.classList[target.checked ? 'add' : 'remove'](
        'mdc-textfield-helptext--persistent'
      );
    });
    document.getElementById('helptext-as-validation').addEventListener('change', function (evt) {
      var target = evt.target;
      helptext.classList[target.checked ? 'add' : 'remove'](
        'mdc-textfield-helptext--validation-msg'
      );
    });
    */

    }).catch((err) => {
      alert('injection error ' + err);
    });
  }

  onChange(event) {
    if ( this.props.onChange ) {
      this.props.onChange(event);
    }
  }
  render() {

    return (

      <div className="mdc-textfield">
        <input onChange={this.onChange.bind(this)} style={this.getStyle(this.props)} type={this.props.type} id={this.props.id} className="mdc-textfield__input" />
        <label className="mdc-textfield__label" htmlFor={this.props.id}>{this.props.placeholder}</label>
        <div className="mdc-textfield__bottom-line"></div>
      </div>

    )
  }

}

export default TextField;