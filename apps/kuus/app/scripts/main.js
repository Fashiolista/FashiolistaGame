require.config({
  shim: {
  },

  paths: {
    jquery: 'vendor/jquery.min',
	doT: 'vendor/doT.js',
	timeago: 'vendor/jquery.timeago.js',
    fittext: 'vendor/jquery.fittext.js',
    dropdown: 'vendor/bootstrap/bootstrap-dropdown.js',
    collapse: 'vendor/bootstrap/bootstrap-collapse.js'
  }
});
 
require(['app'], function(app) {
  // use app here
  console.log(app);
});