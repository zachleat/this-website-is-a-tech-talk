class Slides {
  constructor() {
  }
  
  getPreviousHref() {
    return document.getElementById("slide-nav-previous").getAttribute("href")
  }

  getNextHref() {
    return document.getElementById("slide-nav-next").getAttribute("href");
  }

  onkeypress(code, event) {
    if(event.metaKey && code === 37) {
      let previous = this.getPreviousHref();
      if(previous) {
        location.href = previous;
      }
      event.preventDefault();
    }
    if(event.metaKey && code === 39 || code === 13) {
      let next = this.getNextHref();
      if(next) {
        location.href = next;
      }
      event.preventDefault();
    }
  }
}

;(function() {
  let slides = new Slides();

  document.addEventListener("keydown", function(e) {
    var which = e.which || e.keyCode || e.charCode;
    slides.onkeypress(which, e);
  });
})();
