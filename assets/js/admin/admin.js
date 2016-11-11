$(document).ready(function() {
  $('#example').DataTable( {
    ajax:{
      "url": "/users/",
      "cache": true
    },
    "columns": [
      { "data": "email" },
      { "data": "firstName" },
      { "data": "lastName" }
    ]
  } );
} );
