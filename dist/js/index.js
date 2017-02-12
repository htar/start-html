/*------------------------------------------------------------------

[Table of contents]
1. BACKGROUND IMAGE
2. BACKGROUND IMAGE
3. BACKGROUND IMAGE

-------------------------------------------------------------------*/

;
(function($, window, document, undefined) {


    "use strict";
    /////////////////////////////////
    // BACKGROUND IMAGE
    ////////////////////////////////

    function wpc_add_img_bg(img_sel, parent_sel, img_height) {
        if (!img_sel) {
            console.info('no img selector');
            return false;
        }
        var $parent, $that;
        $(img_sel).each(function() {
            $that = $(this);
            $parent = $that.closest(parent_sel);
            $parent = $parent.length ? $parent : $that.parent();
            if (img_height) {
                $parent.css('background-image', 'url(' + this.src + ')');
                $that.css('visibility', 'hidden');
            } else {
                $parent.css('background-image', 'url(' + this.src + ')');
                $that.hide();
            }
        });
    }



    wpc_add_img_bg('.js-bg-img > img', '.js-bg-img');
    wpc_add_img_bg('.js-bg-img_with-height > img', '.js-bg-img_with-height', true); // BACKGROUND IMAGE with images height

    /////////////////////////////////
    // scroll
    ////////////////////////////////
    $(document).on('scroll', function() {

    });
    /////////////////////////////////
    // load
    ////////////////////////////////
    $(document).on('load', function() {

    });

    /////////////////////////////////
    // Resize
    ////////////////////////////////
    $(document).on('resize', function() {

    });

})(jQuery, window, document);