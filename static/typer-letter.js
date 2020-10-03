class Typer {
	constructor(slideEl) {
		this.slide = slideEl;
		this.paused = false;

		this.classes = {
			letter: "typer-letter",
			cursor: "typer-letter-cursor",
			cursorInitial: "typer-letter-cursor-initial",
			cursorEnabled: "typer-letter-use-cursor",
			typed: "typer-letter-typed",
			typedInitial: "typer-letter-typed-initial",
		};
		this.selectors = {
			typed: `.${this.classes.letter}.${this.classes.typed}:not(.${this.classes.typedInitial})`,
			notTyped: `.${this.classes.letter}:not(.${this.classes.typed})`
		};

		this.initializeCursors();
	}
	
	initializeCursors() {
		if(!this.hasCursor()) {
			let initialCursors = Array.from(document.querySelectorAll(`.${this.classes.cursorInitial}`));
			for(let cursor of initialCursors) {
				this.addCursor(cursor);
			}
		}
	}

	hasNext() {
		return !!document.querySelector(this.selectors.notTyped);
	}

	_getNextCharacters(characterCount = 1) {
		// TODO lol performance of this is probably not great
		let untypedCharactersAndCursors = Array.from(document.querySelectorAll(`${this.selectors.notTyped},.${this.classes.cursor}`));
		let results = [];
		let cursors = [];
		let countAfterCursor = 0;
		for(let char of untypedCharactersAndCursors) {
			if(char.classList.contains(this.classes.cursor)) {
				countAfterCursor = 0;
				cursors.push(char);
			} else {
				if(countAfterCursor < characterCount) {
					results.push(char);
				}
				countAfterCursor++;
			}
		}
		return {
			next: results,
			previousCursors: cursors
		};
	}
	
	hasPrevious() {
		return !!document.querySelector(this.selectors.typed);
	}

	_getPreviousCharacters(characterCount = 1) {
		// TODO lol performance of this is probably not great
		let typedCharactersAndCursors = Array.from(document.querySelectorAll(`${this.selectors.typed}:not(.${this.classes.typedInitial}),.${this.classes.cursor}:not(.${this.classes.typedInitial})`));
		typedCharactersAndCursors.reverse();

		let results = [];
		let cursors = [];
		let newCursors = [];
		let countAfterCursor = 0;
		for(let char of typedCharactersAndCursors) {
			if(char.classList.contains(this.classes.cursor)) {
				countAfterCursor = 0;
				cursors.push(char);
			}
			if(countAfterCursor < characterCount) {
				results.push(char);
			} else if(countAfterCursor === characterCount) {
				newCursors.push(char);
			}
			countAfterCursor++;
		}

		results.reverse();
		return {
			previous: results,
			newCursors: newCursors,
			previousCursors: cursors
		};
	}

	hasCursor() {
		return !!document.querySelector(`.${this.classes.cursor}`);
	}

	removeCursors(elArr) {
		for(let el of elArr) {
			el.classList.remove(this.classes.cursor);
		}
	}

	addCursor(el) {
		if(el) {
			el.classList.add(this.classes.cursor);
		}
	}

	next(characterCount = 1) {
		let obj = this._getNextCharacters(characterCount);

		if(obj.next.length) {
			this.removeCursors(obj.previousCursors);

			for(let el of obj.next) {
				el.classList.add(this.classes.typed);
				// fun mode
				// el.style.transform = `rotate(${Math.round(Math.random()*20) - 10}deg) scale(${Math.min(Math.random()+1, 1.5)})`;
				this.addCursor(el);
			}
			this.insertOutputHtml();
		}
	}
	
	previous() {
		let obj = this._getPreviousCharacters();
		this.removeCursors(obj.previousCursors);

		if(obj.previous.length) {
			for(let el of obj.previous) {
				el.classList.remove(this.classes.typed);
			}
			this.insertOutputHtml();
		}
		if(obj.newCursors.length) {
			for(let el of obj.newCursors) {
				this.addCursor(el);
			}
		} else {
			this.initializeCursors();
		}
	}

	// TODO ENTER key triggers the next autoplay
	// TODO autoplay only a set number of characters, starting from an index
	// TODO console autoplay should not update the browser preview
	autoplayNext() {
		// no cursor while it’s autoplaying
		this.toggleCursor(false);
		requestAnimationFrame(() => {
			this.next(1);
			if(this.hasNext()) {
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
