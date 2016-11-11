$(document).ready(function() {
  $('#example').DataTable( {
    ajax:{
      "url": "/users/",
      "cache": true
    },
    "columns": [
      { "data": "username" },
      { "data": "firstName" },
      { "data": "lastName" }
    ]
  } );
} );
