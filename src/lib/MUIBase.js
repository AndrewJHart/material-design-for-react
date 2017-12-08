import React from 'react';
let _mdc_injected = false;
/**
 * Our BASE CLass.
 * Inject MDC if required
 */
class MUIBase extends React.Component {
  constructor(props) {
    super(props);
    // now...do polyfills for IE
    this.doPolyFills();
    this.injectMui();
    if (!this._startPolyFill) {
      this._startPolyFill = true;
      window.setInterval(() => {
        console.log('done polyfill..');
        this.doPolyFills();
      }, 1000);
    }
  }

  /**
   * Inject after we are mounted
   */
  componentDidMount() {
    this.injectMui();

  }

  /**
   * Check if we need to inject.. and if so, do it
   */
  injectMui() {
    if (document.getElementById('muibase') !== null) {
      if (!window.mdc) {
        return new Promise((resolve, reject) => {
          this.waitForMDC(resolve);
        });
      }
    }

    // Check if mui instantiated
    return new Promise((resolve, reject) => {
      if (undefined === window.mdc) {
        this.doInject(
          'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js',
          'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css',
          'https://fonts.googleapis.com/icon?family=Material+Icons').then(() => {
            document.body.style.display = 'block';
            resolve();
            this.runCSSPolyFill();

          })
      } else {
        resolve();
      }
    }).catch((err) => {
      console.trace();
      reject(err);
    });

  }

  waitForMDC(resolve) {
    if (window.mdc) {
      resolve(true);
    } else {
      setTimeout(() => { this.waitForMDC(resolve) }, 1);
    }

  }

  /**
   * Inject the MDC resources.
   * 
   * @todo Make it generic...with an array of resources etc...
   * 
   * @param {*} src 
   * @param {*} link1 
   * @param {*} link2 
   */
  doInject(src, link1, link2) {

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = false;
      script.src = src;
      script.id = 'muibase';
      script.addEventListener('load', resolve);
      script.addEventListener('error', () => reject('Error loading script.'));
      script.addEventListener('abort', () => reject('Script loading aborted.'));
      document.head.appendChild(script);

      const l1 = document.createElement('link');
      l1.rel = 'stylesheet';
      l1.href = link1;
      l1.id = 'muibaselink1';
      document.head.appendChild(l1);

      const l2 = document.createElement('link');
      l2.rel = 'stylesheet';
      l2.href = link2;
      l2.id = 'muibaselink2';
      document.head.appendChild(l2);

      // inject firefox link if needed
      let firefox = navigator.userAgent.search("Firefox");
      if (firefox > 0) {
        const l3 = document.createElement('link');
        l3.rel = 'stylesheet';
        l3.href = 'https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700&subset=latin,cyrillic';
        document.head.appendChild(l3);

      }
    });
  }

  doPolyFills() {
    // Polyfill for REMOVE which IE has trouble with
    (function (arr) {
      arr.forEach(function (item) {
        if (item.hasOwnProperty('remove')) {
          return;
        }
        Object.defineProperty(item, 'remove', {
          configurable: true,
          enumerable: true,
          writable: true,
          value: function remove() {
            if (this.parentNode !== null)
              this.parentNode.removeChild(this);
          }
        });
      });
    })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

  }

  runCSSPolyFill() {
    let cssVarPoly = {
      init: function () {
        // first lets see if the browser supports CSS variables
        // No version of IE supports window.CSS.supports, so if that isn't supported in the first place we know CSS variables is not supported
        // Edge supports supports, so check for actual variable support
        if (window.CSS && window.CSS.supports && window.CSS.supports('(--foo: red)')) {
          // this browser does support variables, abort
          console.log('your browser supports CSS variables, aborting and letting the native support handle things.');
          return;
        } else {
          // edge barfs on console statements if the console is not open... lame!
          console.log('no support for you! polyfill all (some of) the things!!');
          document.querySelector('body').classList.add('cssvars-polyfilled');
        }

        cssVarPoly.ratifiedVars = {};
        cssVarPoly.varsByBlock = {};
        cssVarPoly.oldCSS = {};

        // start things off
        cssVarPoly.findCSS();
        cssVarPoly.updateCSS();
      },

      // find all the css blocks, save off the content, and look for variables
      findCSS: function () {
        let styleBlocks = document.querySelectorAll('style:not(.inserted),link[type="text/css"]');

        // we need to track the order of the style/link elements when we save off the CSS, set a counter
        let counter = 1;

        // loop through all CSS blocks looking for CSS variables being set
        [].forEach.call(styleBlocks, function (block) {
          // console.log(block.nodeName);
          let theCSS;
          if (block.nodeName === 'STYLE') {
            // console.log("style");
            theCSS = block.innerHTML;
            cssVarPoly.findSetters(theCSS, counter);
          } else if (block.nodeName === 'LINK') {
            // console.log("link");
            cssVarPoly.getLink(block.getAttribute('href'), counter, function (counter, request) {
              cssVarPoly.findSetters(request.responseText, counter);
              cssVarPoly.oldCSS[counter] = request.responseText;
              cssVarPoly.updateCSS();
            });
            theCSS = '';
          }
          // save off the CSS to parse through again later. the value may be empty for links that are waiting for their ajax return, but this will maintain the order
          cssVarPoly.oldCSS[counter] = theCSS;
          counter++;
        });
      },

      // find all the "--variable: value" matches in a provided block of CSS and add them to the master list
      findSetters: function (theCSS, counter) {
        // console.log(theCSS);
        cssVarPoly.varsByBlock[counter] = theCSS.match(/(--.+:.+;)/g) || [];
      },

      // run through all the CSS blocks to update the variables and then inject on the page
      updateCSS: function () {
        // first lets loop through all the variables to make sure later vars trump earlier vars
        cssVarPoly.ratifySetters(cssVarPoly.varsByBlock);

        // loop through the css blocks (styles and links)
        for (let curCSSID in cssVarPoly.oldCSS) {
          // console.log("curCSS:",oldCSS[curCSSID]);
          let newCSS = cssVarPoly.replaceGetters(cssVarPoly.oldCSS[curCSSID], cssVarPoly.ratifiedVars);
          // put it back into the page
          // first check to see if this block exists already
          if (document.querySelector('#inserted' + curCSSID)) {
            // console.log("updating")
            document.querySelector('#inserted' + curCSSID).innerHTML = newCSS;
          } else {
            // console.log("adding");
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = newCSS;
            style.classList.add('inserted');
            style.id = 'inserted' + curCSSID;
            document.getElementsByTagName('head')[0].appendChild(style);
          }
        };
      },

      // parse a provided block of CSS looking for a provided list of variables and replace the --var-name with the correct value
      replaceGetters: function (curCSS, varList) {
        // console.log(varList);
        for (let theVar in varList) {
          // console.log(theVar);
          // match the variable with the actual variable name
          let getterRegex = new RegExp('var\\(\\s*' + theVar + '\\s*\\)', 'g');
          // console.log(getterRegex);
          // console.log(curCSS);
          curCSS = curCSS.replace(getterRegex, varList[theVar]);

          // now check for any getters that are left that have fallbacks
          let getterRegex2 = new RegExp('var\\(\\s*.+\\s*,\\s*(.+)\\)', 'g');
          // console.log(getterRegex);
          // console.log(curCSS);
          let matches = curCSS.match(getterRegex2);
          if (matches) {
            // console.log("matches",matches);
            matches.forEach(function (match) {
              // console.log(match.match(/var\(.+,\s*(.+)\)/))
              // find the fallback within the getter
              curCSS = curCSS.replace(match, match.match(/var\(.+,\s*(.+)\)/)[1]);
            });

          }

          // curCSS = curCSS.replace(getterRegex2,varList[theVar]);
        };
        // console.log(curCSS);
        return curCSS;
      },

      // determine the css variable name value pair and track the latest
      ratifySetters: function (varList) {
        // console.log("varList:",varList);
        // loop through each block in order, to maintain order specificity
        for (let curBlock in varList) {
          let curVars = varList[curBlock];
          // console.log("curVars:",curVars);
          // loop through each var in the block
          curVars.forEach(function (theVar) {
            // console.log(theVar);
            // split on the name value pair separator
            let matches = theVar.split(/:\s*/);
            // console.log(matches);
            // put it in an object based on the varName. Each time we do this it will override a previous use and so will always have the last set be the winner
            // 0 = the name, 1 = the value, strip off the ; if it is there
            cssVarPoly.ratifiedVars[matches[0]] = matches[1].replace(/;/, '');
          });
        };
        // console.log(ratifiedVars);
      },

      // get the CSS file (same domain for now)
      getLink: function (url, counter, success) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.overrideMimeType('text/css;');
        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
            // Success!
            // console.log(request.responseText);
            if (typeof success === 'function') {
              success(counter, request);
            }
          } else {
            // We reached our target server, but it returned an error
            console.warn('an error was returned from:', url);
          }
        };

        request.onerror = function () {
          // There was a connection error of some sort
          console.warn('we could not get anything from:', url);
        };

        request.send();
      }

    };

    cssVarPoly.init();
  }

  /**
   * Return style prop... Every component needs this
   * @param {*} props 
   */
  getStyle(props) {
    return undefined === this.props.style ? {} : this.props.style;
  }

  /**
   * Dummy render.. just return span.
   */
  render() {
    return (
      <span />
    )
  }
}

export default MUIBase;