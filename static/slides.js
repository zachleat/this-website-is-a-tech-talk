class Slides {
	constructor() {
	}
	
	getPreviousHref() {
		return document.getElementById("slide-nav-previous").getAttribute("href")
	}

	getNextHref() {
		return document.getElementById("slide-nav-next").getAttribute("href");
	}
	
	getPreviewHref() {
		return document.getElementById("slide-nav-preview").getAttribute("href");
	}

	onkeypress(code, event) {
		// ⌘ left arrow
		if(event.metaKey && code === 37) {
			let previous = this.getPreviousHref();
			if(previous) {
				location.href = previous;
			}
			event.preventDefault();
		}
		
		// ⌘ right arrow, enter
		if(event.metaKey && code === 39 || code === 13) {
			let next = this.getNextHref();
			if(next) {
				location.href = next;
			}
			event.preventDefault();
		}
		// ⌘ up
		if(event.metaKey && code === 38) {
			let preview = this.getPreviewHref();
			location.href = preview;
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
