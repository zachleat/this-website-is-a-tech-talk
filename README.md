# This web site is a tech talk

## Features

* `~` Use tilde to show all text on page without progressive play or animation.

## TODO content

* Add lighthouse decreasing animation on slide 8d

## TODO features

* Pause delay at specified indeces (or at end of typing config entries) (e.g. on /slides/7/ and especially on /slides/8/)
* Add markdown support
* CSS `zoom: 2` would allow custom zooms per slide
	* Automatic pause delay for non alphanumeric characters
* Cache images locally

### Bugs

* Multiple cursors and Show all (tilde) function
* Multiple cursors and ␡ character
* Autoplay and ␡ character (try with tilde)

### v2

* Dom diffing for iframe srcdoc? DiffHTML morphdom, diff-dom, nanomorph
* Type a word at a time
* Show a line at a time
* Make it scroll with the text if it goes longer than a page
* Optional: enter to autoplay to index (but also make it not possible to delete that code)
