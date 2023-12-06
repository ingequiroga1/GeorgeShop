$(document).ready(function(){
    $("#miBusqueda").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#miTabla tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });