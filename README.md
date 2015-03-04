# Udacity FEND - P5 - Neighborhood map
## My London Map (my favourites and coworking spaces + the FTSE index updated in real time)
### by Benedetto Lo Giudice

###### To execute locally
git clone git@github.com:bennythejudge/neighborhood-map-udacity-p5.git
cd neighborhood-map-udacity-p5/
gulp serve
(this will launch automatically your default browser)
Using Google Chrome, open http://localhost:3000

###### Flashing the FTSE index field when it's updated
Source: http://jsfiddle.net/rniemeyer/s3QTU/
I wanted to try to use a pure knockouts solution - changing the css directly via knockouts at the viewmodel and view level. However I couldn't make it work, so eventually I surrendered to using jquery on the DOM directly.

###### Testing if the yahoo API update is working
I have been using this page to cross check: https://uk.finance.yahoo.com/q?s=%5EFTSE

###### Using GULP
List of tasks
- 'jshint'
- 'jscs'
- 'serve'
- 'minify-js'
- 'minify-html'
- 'minify-css'
- 'build': minify the javascript, the html and css and places the minified files in /dist, dist/js and dist/css

