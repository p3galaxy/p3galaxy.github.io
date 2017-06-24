jQuery(document).ready(function($) {
    
        
        $('.contestItemMh').matchHeight();

        if ($(window).width() > 1000) {
           $('.colMh').matchHeight();
        }

        if ($(window).width() > 1100) {
           $('.contestMh').matchHeight();
        }

    $('.fire_popup').click(function(event){
        $('.add_inspiration, .vote_number').css('z-index', '90');
        $('.contest_item').css('z-index', 'inherit');
        $('.site-header.uk-active').css('z-index', '1');
    	event.preventDefault();
		$(this).next('.contest_item_popup_wrapp').fadeIn();
	});

	$('.contest_item_popup_close a').click(function(event){
        $('.add_inspiration, .vote_number').css('z-index', '99');
        $('.contest_item').css('z-index', '33');
        $('.site-header.uk-active').css('z-index', '980');
    	event.preventDefault();
		$(this).closest('.contest_item_popup_wrapp').fadeOut();
	});

    $(window).load(function() {
        // CONTEST BIG FOTO POSITION
        var itemWidth = $('.contest_item_big').width();
        var fotoWidth = $('.contest_item_big_foto').width();
        var widthDifference = (itemWidth-fotoWidth);

        $('.contest_item_big_foto').css('right', -widthDifference);
    });

    if ($(window).width() < 1000) {
       $('.merge_paragraphs p').each(function() {
        $('.merge_paragraphs p').contents().unwrap();
    });
    }

    if ($(window).width() < 700) {
       $('.merge_paragraphs_small p').each(function() {
        $('.merge_paragraphs_small p').contents().unwrap();
    });
    }

});

