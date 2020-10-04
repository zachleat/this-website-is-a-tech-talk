class Typer {
	constructor(slideEl) {
		this.slide = slideEl;
		this.paused = false;

		this.classes = {
			letter: "typer-letter",
			cursor: "typer-letter-cursor",
			cursorInitial: "typer-letter-cursor-initial",
			cursorEnabled: "typer-letter-cursor-enabled",
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

	_getPreviousCharacters() {
		let characterCount = 1;
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
	
	pauseFor(timeout = 100, afterCallback = () => {}) {
		this.paused = true;
		setTimeout(() => {
			this.paused = false;
			afterCallback();
		}, timeout)
	}

	next(characterCount) {
		let usingMultipleCursors = this.slide.classList.contains("slide-cursors-multiple");
		let obj = this._getNextCharacters(characterCount);

		if(obj.next.length) {
			this.removeCursors(obj.previousCursors);

			let count = 0;
			for(let el of obj.next) {
				// Special character for hardcoded deletes
				if(el.innerHTML === "␡") {
					let deletedChar = el.previousElementSibling;
					el.remove();

					this.pauseFor(800, () => {
						deletedChar.remove();
					});
				}

				el.classList.add(this.classes.typed);

				// fun mode
				// el.style.transform = `rotate(${Math.round(Math.random()*20) - 10}deg) scale(${Math.min(Math.random()+1, 1.5)})`;
				
				// important if characterCount > 1 (don’t want to add cursors to all characters)
				if(usingMultipleCursors || count === obj.next.length - 1) {
					this.addCursor(el);
				}
				count++;
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

	autoplayNext(autoplaySpeed = 1) {
		// no cursor while it’s autoplaying
		this.toggleCursor(false);
		requestAnimationFrame(() => {
			this.next(autoplaySpeed);
			if(this.hasNext()) {
				this.autoplayNext(autoplaySpeed);
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
		let pre = this.slide.querySelector(":scope pre");
		let iframe = document.querySelector("iframe");
		if(pre && iframe) {
			// throttle it
			requestAnimationFrame(() => {
				let cloned = pre.cloneNode(true);
				let untypedLetters = cloned.querySelectorAll(this.selectors.notTyped);
				for(let letter of untypedLetters) {
					letter.remove();
				}
				
				iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(cloned.textContent);
			});
		}
	}
}

;(function() {
	let slideEl = document.querySelector(".slide");
	let typer = new Typer(slideEl);
	if(slideEl.classList.contains("slide-autoplay")) {
		setTimeout(() => {
			typer.autoplayNext(slideEl.getAttribute("data-slide-autoplay-speed"));
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
