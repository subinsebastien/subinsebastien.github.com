$(document).ready(function(){
    var i18n = $.i18n();

    function loadpage() {
        var obj = $(this),
            language = $(this).data("language") || "en";
        i18n.locale = language;
        $("#homepage").html(_.template($('#template-homepage').html()));
        console.log(language);
        $('.language').on('click', loadpage);
    }
    loadpage();
} );
