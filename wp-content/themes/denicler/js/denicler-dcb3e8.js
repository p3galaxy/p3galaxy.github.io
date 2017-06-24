jQuery(function ($) {

    AJAX_URL = '/wp-admin/admin-ajax.php?action=';

    $('#loginPopup .cd-popup-close').click(function (e) {
        e.preventDefault();
        $(this).parent().parent().removeClass('is-visible');
    });

    $('#primary-menu a').click(function () {

        if ('#' == $(this).attr('href').substring(1, 2)) {
            $('.menu-toggle').click();
        }

    });

    $('.btn-add-inspiration2').click(function(event){

        event.preventDefault();
        $('#addInspirationPopup').addClass('is-visible');
        $('.add_inspiration').css('z-index', '999');

    });


    function resetForm()
    {
        $('label span:first', $('#file-2').parent()).text('Zdjęcie');
        $('label span:first', $('#file-1').parent()).text('Dodaj zdjęcie (wielkość max 2MB)');

        input = $('#file-1');
        input.replaceWith(input.val('').clone(true));

        input = $('#file-2');
        input.replaceWith(input.val('').clone(true));

        jQuery('form input[name^=addPlace], form textarea[name^=addPlace]').val('');
        jQuery('form input[name^=addInspiration], form textarea[name^=addInspiration]').val('');

        $.each(jQuery('form input[name^=addInspiration]'), function(){
            if ($(this).attr('data-base-value')) {
                $(this).val($(this).attr('data-base-value'));
            }
        });

        $('.form-status-text').text('');
        $('#addPlaceForm').show();
        $('#addInspirationForm').show();
    }

    $('.cd-popup-close').click(function(e){
        resetForm();
    });

    $(document).ready(function(){

        if ('#section-7-active' == window.location.hash) {
            $('.btn-add-inspiration:first').click();
        }

        $('.btn-add-inspiration-second, li.btn-add-inspiration-second a').click(function(){
            $('.add_inspiration .btn-add-inspiration').click();
        });

        //trigger na scrollu jezeli wracamy na strone po zalogowaniu przez fb
        //zeby pozaycja byla taka jak przed kliknieciem
        if ( $.cookie("fb_login_scroll") !== null ) {
            $(document).scrollTop( $.cookie("fb_login_scroll") );
            $.cookie("fb_login_scroll", null );

            //trigger na popupie ktory ma sie pojawic po zalogowaniu przez fb
            //zeby po powrocie z logowania zachowac akcje ktora byla rozpoczeta
            if ( $.cookie("fb_login_action2") !== null ) {
                $('.' + $.cookie("fb_login_action2")).click();
                $.cookie("fb_login_action2", null);
            }
        }

    });

    /*************************************************************************************************
     * VOTING
     *************************************************************************************************/

    //Add vote if user not logged and click on vote button

    // $(document).on('click', '.wp_ulike_btn', function(e){
    //
    //     if ($.inArray(String($(this).attr('data-ulike-id')), inspirationsWithDisabledVoting) >= 0) {
    //
    //         alert('To jest przykładowa inspiracja, nie można na nią głosować.');
    //         e.stopPropagation();
    //     }
    // });

    $('div.wpulike .counter a.user-tooltip').click(function () {
        $('i.theChampFacebookLogin').click();
    });

    $('.theChampFacebookLogin').click(function(e){

    });

    $('.js-vote-trigger').click(function (e) {

        e.preventDefault();
        var elementId = $(this).attr('data-element-id');

        if (!$('a[data-ulike-id=' + elementId + ']').length) {

            $('a.image.user-tooltip:first').click();

        } else {

            $('a[data-ulike-id=' + elementId + ']').click();
            $('.wpulike-heart [data-ulike-id=' + elementId + ']').click();

            if ($(this).parent().hasClass('contest_item_popup_vote')) {
                $('.contest_item_popup_close a').click();
            }

        }

    });

    $('div.wpulike a').click(function (e) {

        if (typeof $(this).attr('data-original-title') != "undefined") {
            if ($(this).attr('data-original-title') != '') {
                var isLogged = parseInt($('body').attr('data-is-logged'));

                if (!isLogged) {
                    showLoginPopup();
                }
            }
        }

    });

    /*************************************************************************************************
     * COLLECTION COUNTDOWN
     *************************************************************************************************/

    if ($('.collection-countdown').length) {

        $.each($('.collection-countdown'), function () {

            var dateStringAsArray = $(this).attr('data-start-date').split('-');
            var dateEndText = $(this).attr('data-end-text');

            var now = new Date();

            var dateTo = new Date(
                parseInt(dateStringAsArray[0]),
                parseInt(dateStringAsArray[1]) - 1,
                parseInt(dateStringAsArray[2]),
                parseInt(dateStringAsArray[3]),
                parseInt(dateStringAsArray[4]),
                parseInt(dateStringAsArray[5])
            );

            $(this).countdown({until: dateTo});

            if (dateTo - now <= 0) {
                $(this).html(dateEndText);
            }

        });
    }

    /*************************************************************************************************
     * FORMS
     *************************************************************************************************/

    $('.js-login-required').click(function (e) {

        var isLogged = parseInt($('body').attr('data-is-logged'));

        if (!isLogged) {
            showLoginPopup();

            if ($(this).hasClass('btn-map')) {
                $.cookie("fb_login_action2", 'btn-map.btn-add' );
            }

            if ($(this).hasClass('btn-add-inspiration')) {
                $.cookie("fb_login_action2", 'btn-add-inspiration' );
            }

            // Set a cookie that holds the scroll position.
            $.cookie("fb_login_scroll", $(document).scrollTop() );
        }

    });

    function addInspirationCallback(data, form) {

        if ('success' == data.responseStatus.type) {
            form.hide();

            $('.addNextInspirationButton').remove();
            addNextInspirationButton = $('<a href="" class="addNextInspirationButton">DODAJ KOLEJNĄ PRACĘ</a>');

            addNextInspirationButton.click(function(e){
                e.preventDefault();
                resetForm();
                $(this).remove();
            });

            form.after(addNextInspirationButton);

        }
    }

    function addPlaceCallback(data, form) {

        if ('success' == data.responseStatus.type) {
            form.hide();

            $('.addNextPlaceButton').remove();
            addNextPlaceButton = $('<a href="" class="addNextPlaceButton">DODAJ KOLEJNE MIEJSCE</a>');

            addNextPlaceButton.click(function(e){
                e.preventDefault();
                resetForm();
                $(this).remove();
            });

            form.after(addNextPlaceButton);
        }

    }

    function checkProductAuthenticity(data, form) {
        //alert('c');

        form.next($('.cd-popup')).addClass('is-visible');
        $('#checkAuthenticityContainer').html(data.authenticityHtml);

        if (data.isAuthenticity == '1') {
            $('h1', form.next($('.cd-popup'))).text('Gratulacje!');
        } else {
            $('h1', form.next($('.cd-popup'))).text('#Deni Selected');
        }
    }

    function showLoginPopup() {
        $('.cd-popup').removeClass('is-visible');
        $('#loginPopup').addClass('is-visible');
    }

    function emptyAjaxFormCallback(data, form) {
        console.log('::: emptyAjaxFormCallback');
    }

    function updateFormStatus(data, parentElement) {
        var formStatusElement = $('.form-status-text', parentElement);

        formStatusElement.removeClass('status-success');
        formStatusElement.removeClass('status-error');

        if (typeof data.responseStatus == "undefined") {

            formStatusElement.addClass('status-error');
            formStatusElement.text('Wystąpił nieoczekiwany błąd, przepraszamy za utrudnienia.');

        } else {
            if ('success' == data.responseStatus.type) {

                formStatusElement.addClass('status-success');
            }

            if ('error' == data.responseStatus.type) {
                formStatusElement.addClass('status-error');
            }

            formStatusElement.text(data.responseStatus.text);
        }

        $('input[type=submit]', parentElement).attr('disabled', false);
    }

    function loadingFormStatus(parentElement) {
        $('input[type=submit]', parentElement).attr('disabled', true);
        var formStatusElement = $('.form-status-text', parentElement);

        formStatusElement.removeClass('status-success');
        formStatusElement.removeClass('status-error');
        formStatusElement.html('<img src="/wp-content/themes/denicler/images/form-loader.gif" style="margin: 0 5px -7px 0;" /> <span>Ładowanie, proszę czekać...</span>');

    }

    /**
     * Ajax form
     */

    $("form.ajax-form").submit(function () {

        var form = $(this);
        var formContainer = $(this).parent();

        var formdata = false;

        if (window.FormData) {
            formdata = new FormData(form[0]);
        }

        var formAction = AJAX_URL + form.attr('action');

        loadingFormStatus(formContainer);

        $.ajax({
            type: 'POST',
            url: formAction,
            data: formdata ? formdata : form.serialize(),
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                // Callback code

                switch (data.callbackName) {
                    case 'addInspirationCallback':
                        addInspirationCallback(data, form);
                        break;
                    case 'addPlaceCallback':
                        addPlaceCallback(data, form);
                        break;
                    case 'checkProductAuthenticity':
                        checkProductAuthenticity(data, form);
                        break;
                    default:
                        emptyAjaxFormCallback(data, form);
                }

                updateFormStatus(data, formContainer);

                return false;
            }
        });

        return false;
    });

    /*************************************************************************************************
     * HOMEPAGE MAP
     *************************************************************************************************/

    var map = null;

    $(document).ready(function () {

        $('.acf-map').each(function () {

            // create map
            map = new_map($(this));
        });

    });

    //map point type filters

    $('.btn-map.btn-deni').click(function () {

        $('.btn-map').removeClass('active-btn-map');

        $(this).addClass('active-btn-map');

        markerCluster.clearMarkers();
        $.each(map.markers, function () {

            marker = $(this)[0];
            pointType = marker.pointType;

            if (pointType == 'deni') {
                marker.setVisible(true);
                markerCluster.addMarker(marker);
            } else {
                marker.setVisible(false);
            }

        });

    });

    $('.btn-map.btn-user').click(function () {

        $('.btn-map').removeClass('active-btn-map');

        $(this).addClass('active-btn-map');

        markerCluster.clearMarkers();
        $.each(map.markers, function () {

            marker = $(this)[0];
            pointType = marker.pointType;

            if (pointType == 'user') {
                marker.setVisible(true);
                markerCluster.addMarker(marker);
            } else {
                marker.setVisible(false);
            }

        });

    });

    /*************************************************************************************************
     * CHECK AUTHENTICITY FORM
     *************************************************************************************************/

    $('.js_checkProductAuthenticityButton').click(function (e) {
        e.preventDefault();
        $('#checkProductAuthenticityForm').submit();
    });

});
