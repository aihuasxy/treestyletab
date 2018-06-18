/*
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
'use strict';

import {
  log as internalLogger,
  configs
} from './common.js';
import * as Constants from './constants.js';
import * as Tabs from './tabs.js';

// eslint-disable-next-line no-unused-vars
function log(...args) {
  if (configs.logFor['common/user-operation-blocker'])
    internalLogger(...args);
}

let gBlockingCount = 0;
let gBlockingThrobberCount = 0;

export function block(options = {}) {
  gBlockingCount++;
  document.documentElement.classList.add(Constants.kTABBAR_STATE_BLOCKING);
  if (options.throbber) {
    gBlockingThrobberCount++;
    document.documentElement.classList.add(Constants.kTABBAR_STATE_BLOCKING_WITH_THROBBER);
  }
}

export function blockIn(windowId, options = {}) {
  const window = Tabs.getWindow();
  if (window && window != windowId)
    return;

  if (!window) {
    browser.runtime.sendMessage({
      type:     Constants.kCOMMAND_BLOCK_USER_OPERATIONS,
      windowId: windowId,
      throbber: !!options.throbber
    });
    return;
  }
  block(options);
}

export function unblock(_aOptions = {}) {
  gBlockingThrobberCount--;
  if (gBlockingThrobberCount < 0)
    gBlockingThrobberCount = 0;
  if (gBlockingThrobberCount == 0)
    document.documentElement.classList.remove(Constants.kTABBAR_STATE_BLOCKING_WITH_THROBBER);

  gBlockingCount--;
  if (gBlockingCount < 0)
    gBlockingCount = 0;
  if (gBlockingCount == 0)
    document.documentElement.classList.remove(Constants.kTABBAR_STATE_BLOCKING);
}

export function unblockIn(windowId, options = {}) {
  const window = Tabs.getWindow();
  if (window && window != windowId)
    return;

  if (!window) {
    browser.runtime.sendMessage({
      type:     Constants.kCOMMAND_UNBLOCK_USER_OPERATIONS,
      windowId: windowId,
      throbber: !!options.throbber
    });
    return;
  }
  unblock(options);
}

