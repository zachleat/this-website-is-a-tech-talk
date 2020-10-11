class Slides {
	constructor() {
		this.addJsClass();
		this.showIframe();
		this.removeNestedNavigation();
	}
	
	addJsClass() {
		let slide = document.querySelector(".slide");
		if(slide) {
			slide.classList.add("animation");
			requestAnimationFrame(() => {
				slide.classList.add("animationend");
			});
		}
	}

	showIframe() {
		let iframe = document.querySelector("iframe[data-js]");
		if(iframe) {
			iframe.classList.add("slide-iframe-enabled");
		}
	}
	
	removeNestedNavigation() {
		let iframe = document.querySelector("iframe");
		if(iframe) {
			iframe.addEventListener("load", (e) => {
				try {
					let nav = e.target.contentDocument.querySelector("nav");
					if(nav) {
						nav.style.display = "none";
					}
				} catch(e) {}
			});
		}
	}

	getIndexHref() {
		let indexEl = document.getElementById("slide-nav-index");
		if(indexEl) {
			return indexEl.getAttribute("href")
		}
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
			let index = this.getIndexHref();
			location.href = index;
		}

		// ⌘ down
		if(event.metaKey && code === 40) {
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
