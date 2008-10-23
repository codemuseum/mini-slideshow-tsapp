var MiniSlideshow = {
  init: function() {
    $$('div.app-mini-slideshow .slides').each(function(galleryEl) {
      var dly = parseInt(galleryEl.className.substring(galleryEl.className.indexOf('delay-') + 'delay-'.length)) * 1000;
      var myGallery = new gallery(galleryEl, { timed: true, delay: dly });
    });
  }
}
MiniSlideshow.init();