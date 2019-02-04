# Armorvox HTML5 Client

This exemplar code shows how an HTML5 client connects to an ArmorVox server using API v6 (POST requests, VXML responses).
It is intended to show how audio can be collected from the browser for enrolment and verification. It also shows the elementary ArmorVox API calls required to enrol and verify.

It is NOT intended to be a finished secure sign-in product! In particular, the ArmorVox server should be protected by a dedicated server-side middleware application that marshalls secure tokens and audio from the browser.

Components
* microphone.js - a class for requesting and handling audio from the browser
* armorvox.js - a class for communicating with V6 of ArmorVox API.
* widget.js - a set of methods to handle display of enrolment and verification process
* index.html - a page to enter ID and password. Determines if ID should be enrolled or verified
* enrol.html - a page to present enrolment process
* verify.html - a page to present verification process

The ID entered at index.html is passed to the enrol.html and verify.html as a request parameter. 

Installation Steps
* Download to a web-server such as Apache2/htdocs. 
* Inspect index.html, enrol.html, verify.html
* If necessary change the server location for Armorvox object
* Use the group to the one listed in your licence
* Point your browser at the page http://localhost/html/index.html?group=your_group
* Use Chrome, Edge, Firefox or Safari (macOS or iPhone), and on Android browser

Enrolment Steps
* Enter your phone number, and a dummy password. (Uncheck 'English' to disable phrase checking)
* Click next
* Allow mic on browser prompt
* Press and hold the mic-button while reading the digits on the screen
* Repeat until all items have completed

Enrol as many different people as you want (using the same browser). Each person must have a different phone number.

Verification Steps
* Enter your phone number, and a dummy password
* Click next
* Press and hold the mic-button while reading the digits on the screen

Delete Steps (this let's you re-enrol)
* Enter your phone number, and a 'delete' password
* Click next


