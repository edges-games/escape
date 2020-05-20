'use strict';

module.exports = {
  load () {
    // execute when package loaded
  },

  unload () {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'open' () {
      // open entry panel registered in package.json
      Editor.Panel.open('escape.flag_panel');
    },
    'openAction' () {
      // open entry panel registered in package.json
      Editor.Panel.open('escape.action_panel');
    },
  },
};