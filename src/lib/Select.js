import React from 'react';
import MUIBase from './MUIBase';

/**
 * Checkbox
 * 
 * Props:
 * 
 */

class Select extends MUIBase {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.injectMui().then(() => {
      var MDCSelect = mdc.select.MDCSelect;
      let selects = document.querySelectorAll('.mdc-select');
      for (let i = 0; i < selects.length; i++) {
        const select = new MDCSelect(selects[i]);
        select.listen('MDCSelect:change', () => {
          this.props.onClick(select.selectedIndex, select.value);
        });
      }



    });
  }

  //background-color: var(--mdc-theme-secondary,#ff4081);

  render() {

    this.props.options.map((option, index) => {
      console.log(option.label + ' ' + option.value + '' + option.enabled);
    });

    return (
      <div style={this.getStyle(this.props)} className='mdc-form-field'>
        <div style={this.getStyle(this.props)} id={this.props.id} className="mdc-select" role="listbox" tabIndex="0">
          <span className="mdc-select__selected-text">{this.props.title}</span>
          <div className="mdc-simple-menu mdc-select__menu">
            <ul className="mdc-list mdc-simple-menu__items">
              <li className="mdc-list-item" aria-disabled={true} role="option">{this.props.title}</li>
              {
                this.props.options.map((option, index) => {
                  return (<li key={index} tabIndex='0' 
                      aria-selected={option.selected}
                      className="mdc-list-item" role="option" aria-disabled={!option.enabled}>
                    {option.value}
                  </li>
                  )
                })
              }

            </ul>
          </div>
        </div>


      </div>

    )
  }

}

export default Select;

