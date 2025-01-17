/**
 * The MIT License (MIT)
 * Copyright (c) 2023 Edwin Zarco
 * Copyright (c) 2019 alextrv
 * Copyright (c) 2015 erkserkserks
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// This content script runs in an isolated environment and cannot modify any
// javascript variables on the youtube page. Thus, we have to inject another
// script into the DOM.

// Set defaults for options stored in localStorage
const options = {
  'refined-h264ify-block_60fps': false,
  'refined-h264ify-block_h264': false,
  'refined-h264ify-block_vp8': true,
  'refined-h264ify-block_vp9': true,
  'refined-h264ify-block_av1': true,
  'refined-h264ify-disable_LN': false,
};

for (const [key, value] of Object.entries(options)) {
  if (!localStorage.hasOwnProperty(key)) {
    localStorage.setItem(key, value);
  }
}

// Cache chrome.storage.local options in localStorage.
chrome.storage.local.get({
  // Set defaults
  block_60fps: false,
  block_h264: false,
  block_vp8: true,
  block_vp9: true,
  block_av1: true,
  disable_LN: false,
}, function(options) {
  Object.entries(options).forEach(([key, value]) => {
    localStorage.setItem(`refined-h264ify-${key}`, value);
  });
});

// Inject the main script into the DOM
const injectScript = document.createElement('script');
injectScript.textContent = `(${inject.toString()})()`;
injectScript.onload = function() {
  // Remove <script> node after injectScript runs.
  this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(injectScript);

// Call useActualVolumeLevel() on document interactive state
document.addEventListener('readystatechange', () => {
  if (document.readyState === 'interactive') {
    const script = document.createElement('script');
    script.textContent = `(${useActualVolumeLevel.toString()})()`;
    document.body.appendChild(script);
  }
});
