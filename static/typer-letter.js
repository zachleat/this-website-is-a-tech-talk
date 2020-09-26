class Typer {
  constructor(slideEl) {
    this.slide = slideEl;
    this.paused = false;
    this.queue = [];

    this.classes = {
      letter: "typer-letter",
      cursor: "typer-letter-cursor",
      cursorFirst: "typer-letter-cursor-first",
      cursorEnabled: "typer-letter-use-cursor",
      typed: "typer-letter-typed",
      typedInitial: "typer-letter-typed-initial",
    };
    this.selectors = {
      notTyped: `.${this.classes.letter}:not(.${this.classes.typed})`
    };

    let alreadyTyped = document.querySelectorAll(`.${this.classes.typed}:not(.${this.classes.typedInitial})`);
    if(alreadyTyped.length) {
      for(let letter of alreadyTyped) {
        this.queue.push(letter);
      }
    }

    if(!this.hasCursor()) {
      this.addCursor();
    }
  }

  _getNext() {
    return document.querySelector(this.selectors.notTyped);
  }

  _getNextCharacters(characterCount = 1) {
    return Array.from(document.querySelectorAll(this.selectors.notTyped)).slice(0, characterCount);
  }

  hasCursor() {
    return !!document.querySelector(`.${this.classes.cursor}`);
  }

  addCursor(el) {
    if(!el) {
      el = this._getNext();
    }

    let previous = document.querySelector(`.${this.classes.cursor}`);
    if(previous) {
      previous.classList.remove(this.classes.cursor, this.classes.cursorFirst);
    }
    if(el) {
      el.classList.add(this.classes.cursor);

      if(!this.queue.length) {
        el.classList.add(this.classes.cursorFirst);
      }
    }
  }

  next(characterCount = 1) {
    let elements = this._getNextCharacters(characterCount);
    if(elements.length) {
      for(let el of elements) {
        el.classList.add(this.classes.typed);
        // fun mode
        // el.style.transform = `rotate(${Math.round(Math.random()*20) - 10}deg) scale(${Math.min(Math.random()+1, 1.5)})`;
        this.queue.push(el);
      }
      this.insertOutputHtml();
    }
    this.addCursor(elements[elements.length - 1]);
  }
  
  previous() {
    if(this.queue.length) {
      let el = this.queue.pop();
      el.classList.remove(this.classes.typed);
      this.insertOutputHtml();
    }
    this.addCursor(this.queue[this.queue.length - 1]);
  }

  // TODO ENTER key triggers the next autoplay
  // TODO autoplay only a set number of characters, starting from an index
  // TODO console autoplay should not update the browser preview
  autoplayNext() {
    // no cursor while it’s autoplaying
    this.toggleCursor(false);
    requestAnimationFrame(() => {
      this.next(1);
      if(this._getNext()) {
        this.autoplayNext();
      } else {
        this.toggleCursor(true);
      }
    })
  }

  toggleCursor(state) {
    document.documentElement.classList.toggle(this.classes.cursorEnabled, state);
  }

  onkeypress(code, event) {
    if( code === 32 ) { //space
      event.preventDefault();
      return;
    }
    if( code >= 37 && code <= 40 || // arrows
      code === 9 || // tab
      event.altKey ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ) {
      return;
    }

    if( code === 8 ) {
      if(event) {
        event.preventDefault();
      }
      this.previous();
    } else if( !this.paused ) {
      this.next();
    }
  }

  insertOutputHtml() {
    // throttle it
    requestAnimationFrame(() => {
      let pre = this.slide.querySelector(":scope pre");
      let cloned = pre.cloneNode(true);
      let untypedLetters = cloned.querySelectorAll(this.selectors.notTyped);
      for(let letter of untypedLetters) {
        letter.remove();
      }
  
      let iframe = document.querySelector("iframe");
      iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(cloned.textContent);
    })
  }
}

;(function() {
  let slideEl = document.querySelector(".slide");
  let typer = new Typer(slideEl);
  if(slideEl.classList.contains("slide-autoplay")) {
    setTimeout(() => {
      typer.autoplayNext();
    }, 150);
  } else {
    typer.toggleCursor(true);
    typer.insertOutputHtml();
  }

  document.addEventListener("keydown", function(e) {
    var which = e.which || e.keyCode || e.charCode;
    typer.onkeypress(which, e);
  });
})();
