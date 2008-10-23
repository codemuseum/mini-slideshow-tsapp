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
        this.slidesEl = slideshowBox.getElementsBySelector('div.slides')[0];
        this.slideControlsEl = slideshowBox.getElementsBySelector('div.slide-controls')[0];
        this.screenEl = slideshowBox.getElementsBySelector('div.screen')[0];
        var creationCode = this._extractCreationCode(slideshowBox.getElementsBySelector('div.new-slide-code')[0]);
        var controlCreationCode = this._extractCreationCode(slideshowBox.getElementsBySelector('div.new-slide-control-code')[0]);
        this.newSlideControl = slideshowBox.getElementsBySelector('.add-slide')[0];
      
        var thisRef = this;
        this.slideEls = this.slidesEl.getElementsBySelector('div.slide');
        var controlEls = this.slideControlsEl.getElementsBySelector('a');
        this.slideCount = this.slideEls.size();
        this.slideEls.each(function(slide, index) { thisRef._observeSlide(slide, controlEls[index]); });
        this.newSlideControl.observe('click', 
          function(ev) { Event.stop(ev); thisRef._addSlide(creationCode, controlCreationCode); thisRef._makeSortable(); });
        this._makeSortable();
        slideshowBox.ancestors().detect(function(anc) { return anc.tagName == 'FORM' }).observe('submit', function(ev) { thisRef._saveOrder(); });
        
        // Go to marked slide to show
        controlEls.each(function(control) { if (control.hasClassName('showing')) { thisRef._showSlide(thisRef.controlToSlideMap.get(control.id), control)}});
      },
      // Returns creation code from element and removes element from DOM tree
      _extractCreationCode: function(el) {
        var creationCode = el.innerHTML;
        el.remove();
        return creationCode;
      },
      _addSlide: function(html, controlHtml) {
        var newEl=$(document.createElement('div'));
        newEl.update(html.replace(/_INDEX_/, this.slideCount));
        newEl = newEl.firstDescendant().remove();
        this.slidesEl.appendChild(newEl);
        var controlEl = $(document.createElement('div'));
        controlEl.update(controlHtml.replace(/_INDEX_/, this.slideCount));
        controlEl = controlEl.firstDescendant().remove();
        this.slideControlsEl.insertBefore(controlEl, this.newSlideControl);
        
        this._observeSlide(newEl, controlEl);
        this.slideCount++;
        this._showSlide(newEl, controlEl);
        newEl.getElementsBySelector('textarea')[0].focus();
      },
      _showSlide: function(slide, control) {
        this.screenEl.scrollLeft = slide.offsetLeft - this.screenEl.offsetLeft;
        if (this.activeSlideControl) this.activeSlideControl.removeClassName('showing');
        this.activeSlideControl = control;
        this.activeSlideControl.addClassName('showing');
      },
      _observeSlide: function(slide, control) {
        var thisRef = this;
        control.observe('click', function() { thisRef._showSlide(slide, control); });
        var remove = slide.getElementsBySelector('.remove')[0];
        remove.observe('click', function() { slide.remove(); control.remove(); thisRef.slideCount--; });
        var titleSelect = slide.getElementsBySelector('.title select')[0];
        titleSelect.observe('change', function() { thisRef._changeTitlePlacementClassName(slide, titleSelect);});
        TS.Assets.Selector.register(slide);
        TS.Pages.Selector.register(slide);
      },
      _changeTitlePlacementClassName: function(slide, titleSelect) {
        slide.classNames().each(function(className) { if (className.startsWith('title-placement-')) slide.removeClassName(className); });
        slide.addClassName('title-placement-'+titleSelect.options[titleSelect.selectedIndex].value);
      },
      _makeSortable: function() {  
        Sortable.create(this.slideControlsEl, { only:'control', tag:'a', constraint:'horizontal' });
      },
      _saveOrder: function() {
        var currentPosition = 0;
        var thisRef = this;
        this.slideControlsEl.getElementsBySelector('a.control').each(function(control) {
          thisRef.controlToSlideMap.get(control.id).getElementsBySelector('input.position-value')[0].value = currentPosition;
          currentPosition++;
        });
      }
    };
    showObject.init(slideshowEl);
    return showObject;
  }
}
MiniSlideshowEdit.init();