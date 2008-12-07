// Parses the slides form correctly for a slideshow editor.  
// Also requires PictureSelect to be included; and register each slide with picture select

var MiniSlideshowEdit = {
  init: function() {
    var slideshowEls = $$('div.app-mini-slideshow');
    this.slideshows = new Array();
    slideshowEls.each(function(show) {
      MiniSlideshowEdit.slideshows.push(MiniSlideshowEdit.slideshowInstance(show));
    });
  },
  
  slideshowInstance: function(slideshowEl) {
    var showObject = {
      init: function(slideshowBox) {
        this.slidesEl = slideshowBox.getElementsBySelector('div.slides-stage')[0];
        var creationCode = this._extractCreationCode(slideshowBox.getElementsBySelector('div.new-slide-code')[0]);
        this.newSlideControl = slideshowBox.getElementsBySelector('.add-slide')[0];
      
        var thisRef = this;
        this.slideEls = this.slidesEl.getElementsBySelector('div.slide');
        this.slideCount = this.slideEls.size();
        this.slideEls.each(function(slide, index) { thisRef._observeSlide(slide); });
        this.newSlideControl.observe('click', 
          function(ev) { Event.stop(ev); thisRef._addSlide(creationCode); thisRef._makeSortable(); });
        this._makeSortable();
        slideshowBox.ancestors().detect(function(anc) { return anc.tagName == 'FORM' }).observe('submit', function(ev) { thisRef._saveOrder(); });
        
      },
      // Returns creation code from element and removes element from DOM tree
      _extractCreationCode: function(el) {
        var creationCode = el.innerHTML;
        el.remove();
        return creationCode;
      },
      _addSlide: function(html) {
        var newEl=$(document.createElement('div'));
        newEl.update(html.replace(/_INDEX_/, this.slideCount));
        newEl = newEl.firstDescendant().remove();
        this.slidesEl.appendChild(newEl);
        
        this._observeSlide(newEl);
        this.slideCount++;
        this._showSlide(newEl);
        // newEl.getElementsBySelector('input')[0].focus();
        TS.Assets.Selector.selectAsset(newEl, ['pictures']);
      },
      _showSlide: function(slide) {},
      _observeSlide: function(slide) {
        var thisRef = this;
        var remove = slide.getElementsBySelector('.remove')[0];
        remove.observe('click', function() { slide.remove(); thisRef.slideCount--; });
        TS.Assets.Selector.register(slide.getElementsBySelector('.preview')[0]);
        TS.Assets.Selector.register(slide.getElementsBySelector('.link')[0]);
        // TS.Pages.Selector.register(slide);
      },
      _makeSortable: function() {  
        Sortable.create(this.slidesEl, { only:'slide', tag:'div', constraint:'vertical' });
      },
      _saveOrder: function() {
        var currentPosition = 0;
        this.slidesEl.getElementsBySelector('div.slide').each(function(slideEl) {
          slideEl.getElementsBySelector('input.position-value')[0].value = currentPosition;
          currentPosition++;
        });
      }
    };
    showObject.init(slideshowEl);
    return showObject;
  }
}
MiniSlideshowEdit.init();