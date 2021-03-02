# This web site is a tech talk

* [Watch @zachleat give this talk](https://www.zachleat.com/web/this-website-is-a-tech-talk/)
* [Go through the slides yourself!](https://techtalk.zachleat.dev/) (Fair warning these are not touchscreen friendly)

## Keyboard commands

* `Any key` Reveal another character
* `Delete` (or `Backspace` on Windows) to hide a character
* `⌘←` Previous slide
* `⌘→` or `Enter` Next slide
* `⌘↑` Back to index
* `\`` Skip animation

## Features

* “Fake” live coding (a la https://hackertyper.com/)
	* Supports adding to boilerplate pre-populated code sample.
	* Multiple cursor entry points on the same slide, jumps between them automatically.
	* Multiple cursors!
	* Supports “fake” deleting characters
* Live preview of output in “Fake” browser
	* Multiple alignment modes (side-by-side, top/bottom)
	* Supports client-rendered Liquid syntax
* “Fake” browser can show:
	* Real web sites (via `<iframe>`)
	* “Fake” web sites (via image screenshots—more offline friendly)
* Show “Fake” terminal with “Fake” terminal output (progressively revealed).
	* Scrolls with the text if it goes longer than a page
* Benchmark and show Lighthouse scores for slide output (uses `<speedlify-score>`)

## Checklist before giving the talk

* [ ] Don’t use development mode (use `npm start` not `npm run dev`)
* [ ] Turn off notifications (disable anything that will reveal browser)
* [ ] Turn off scrollbars in Mac OS
