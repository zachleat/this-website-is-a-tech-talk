# This web site is a tech talk

## Features

* `~` Use tilde to show all text on page without progressive play or animation.
* Scrolls with the text if it goes longer than a page

## Checklist before giving the talk

* Turn off scrollbars
* Turn off notifications (disable anything that will reveal browser)

## TODO content

* publish syntaxlighter npm package and consume it
* Add lighthouse decreasing animation on slide 8d
* Add more Levels throughout content (see Slide 3.7)

## TODO features

* Pause delay at specified indeces (or at end of typing config entries) (e.g. on /slides/7/ and especially on /slides/8/)
* Add markdown support
* scroll to offset on external iframe slide 9.3
	* scroll to offset per timer (filmstrip scrolls 1s of frames in 1s of time)
* CSS `zoom: 2` would allow custom zooms per slide
	* Automatic pause delay for non alphanumeric characters
* Cache images locally

### Bugs

* Multiple cursors and Show all (tilde) function
* Multiple cursors and ␡ character
* Autoplay and ␡ character (try with tilde)

### v2

* Type a word at a time
* Show a line at a time
* Optional: enter to autoplay to index (but also make it not possible to delete that code)
* Dom diffing for iframe srcdoc? DiffHTML morphdom, diff-dom, nanomorph
