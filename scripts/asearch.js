jQuery(function($){
    var $button = $('#add-row'),
        $row = $('.Search-row').clone();
    
    $button.click(function(){
        $row.clone().insertBefore( $button );
    });
});