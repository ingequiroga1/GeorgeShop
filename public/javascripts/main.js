$(function(){
    $('.btn_masCantidad').click( function(){
        var valor = $('#cantidad').val();
        valor = parseInt(valor) + 6;
        $('#cantidad').val(valor);
    });

    $('.btn_menosCantidad').click( function(){
        var valor = $('#cantidad').val();
        if (parseInt(valor) <= 6 )
            valor = 0
        else
            valor = parseInt(valor) - 6;
        $('#cantidad').val(valor);
    });

});
   