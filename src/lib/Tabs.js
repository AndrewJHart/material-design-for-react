import React from 'react';
import MUIBase from './MUIBase';

class Tabs extends MUIBase {
  constructor(props) {
    super(props);

    this.state = {
      data: null
    }


  }

  componentDidMount() {
    this.injectMui().then(() => {
      setTimeout(() => {

        console.log('Will get selector: ' + '#' + this.props.id);
        var dynamicTabBar = window.dynamicTabBar = new mdc.tabs.MDCTabBar(document.querySelector('#' + this.props.id));
        //var dynamicTabBar = window.dynamicTabBar = new mdc.tabs.MDCTabBarScroller(document.querySelector('#' + this.props.id));
        console.log(dynamicTabBar);
        var panels = document.querySelector('#' + this.props.panelsId);
        console.log('panels is: ' + panels);
        console.log(panels);
        console.log(panels.children.length);
        for (var i = 0; i < panels.children.length; i++) {
          let panel = panels.children[i];
          if (!panel.classList.contains('active')) {
            panel.style.display = 'none';
          }

        }

        dynamicTabBar.tabs.forEach(function (tab) {
          tab.preventDefaultOnClick = true;
        });


        function updatePanel(self, index) {
          console.log(panels);
          console.log('qs... ' + panels.querySelector('.mdc-panel'));

          var activePanel = panels.querySelector('.mdc-panel.active');
          console.log('ap... ' + activePanel);
          if (activePanel) {
            activePanel.classList.remove('active');
            activePanel.style.display = 'none';
          }
          var newActivePanel = panels.querySelector('.mdc-panel:nth-child(' + (index + 1) + ')');
          console.log('nap... ' + newActivePanel);
          console.log(newActivePanel);
          if (newActivePanel) {
            newActivePanel.style.display = 'block';
            newActivePanel.classList.add('active');
          }
        }

        let self = this;
        dynamicTabBar.listen('MDCTabBar:change', function ({ detail: tabs }) {
          var nthChildIndex = tabs.activeTabIndex;
          console.log('child index..' + nthChildIndex);
          updatePanel(self, nthChildIndex);
          //updateDot(nthChildIndex);
        });

        // scrollable?
        if (this.props.scroll) {
          window.tabBarScroller = new mdc.tabs.MDCTabBarScroller(document.querySelector('#' + this.props.id));
          window.tabBarScroller.layout();
          window.tabBarScroller.tabBar.layout();
        }

        this.setState({ render: true });
      }, 200);
    }).catch((err) => {
      alert('injection error ' + err);
    });
  }



  render() {
    // <nav id="scrollable-tab-bar" className="mdc-tab-bar mdc-tab-bar-scroller__scroll-frame__tabs">
    let className = this.props.scroll ? 'mdc-tab-bar-scroller__scroll-frame__tabs' : 'mdc-tab-bar mdc-tab-bar--indicator-accent';
    let scrollPre = '';
    let scrollPost = '';
    let tabContent = <nav id={this.props.id} style={{ textAlign: 'left' }} className={className} role="tablist">
      {this.props.children}
      <span className="mdc-tab-bar__indicator"></span>
    </nav>;

    if (this.props.scroll) {
      className = 'mdc-tab-bar mdc-tab-bar-scroller__scroll-frame__tabs';
      // need extra divs for scrolling

      let scrollContent = <div id={this.props.id} className="mdc-tab-bar-scroller">
        <div className="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--back">
          <a className="mdc-tab-bar-scroller__indicator__inner material-icons" href="#" aria-label="scroll back button">
            navigate_before
              </a>
        </div>


        <div className="mdc-tab-bar-scroller__scroll-frame">
          <nav id={this.props.id} style={{ textAlign: 'left' }} className={className} role="tablist">
            {this.props.children}
            <span className="mdc-tab-bar__indicator"></span>
          </nav>
        </div>
        <div className="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--forward">
          <a className="mdc-tab-bar-scroller__indicator__inner material-icons" href="#" aria-label="scroll forward button">
            navigate_next
              </a>
        </div>
      </div>;

      tabContent = scrollContent;

    }

    return (
      <div>
        {tabContent}

      </div>

    )
  }

}

export default Tabs;

/*
<div id="tab-bar-scroller" className="mdc-tab-bar-scroller">
            <div className="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--back">
              <a className="mdc-tab-bar-scroller__indicator__inner material-icons" href="#" aria-label="scroll back button">
                navigate_before
              </a>
            </div>
            <div className="mdc-tab-bar-scroller__scroll-frame">
              <nav id="scrollable-tab-bar" className="mdc-tab-bar mdc-tab-bar-scroller__scroll-frame__tabs">
                <a className="mdc-tab mdc-tab--active" href="#one">Item One</a>
                <a className="mdc-tab" href="#two">Item Two</a>
                <a className="mdc-tab" href="#three">Item Three</a>
                <a className="mdc-tab" href="#four">Item Four</a>
                <a className="mdc-tab" href="#five">Item Five</a>
                <a className="mdc-tab" href="#six">Item Six</a>
                <a className="mdc-tab" href="#seven">Item Seven</a>
                <a className="mdc-tab" href="#eight">Item Eight</a>
                <a className="mdc-tab" href="#nine">Item Nine</a>
                <span className="mdc-tab-bar__indicator"></span>
              </nav>
            </div>
            <div className="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--forward">
              <a className="mdc-tab-bar-scroller__indicator__inner material-icons" href="#" aria-label="scroll forward button">
                navigate_next
              </a>
            </div>
          </div>



*/