# Udacity FEND - P5 - Neighborhood map
## My London Map (my favourites and coworking spaces + the FTSE index updated in real time)
### by Benedetto Lo Giudice



##### A list of features and how I implemented them


###### Flashing the FTSE index field when it's updated
Source: http://jsfiddle.net/rniemeyer/s3QTU/
I wanted to try to use a pure knockouts solution - changing the css directly via knockouts at the viewmodel and view level. However I couldn't make it work, so eventually I surrendered to using jquery on the DOM directly.

###### Keeping the map centered and bound to the markers


###### Testing if the yahoo API update is working
I have been using this page to cross check: https://uk.finance.yahoo.com/q?s=%5EFTSE

###### Using GULP
1. to check the javascript code using jscs and jshint


