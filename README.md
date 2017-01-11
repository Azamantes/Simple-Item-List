# Simple-Item-List
Simple item list.

<h3>Main goal:</h3>
Create a list of items (+ sort, filter).<br><br>
<h4>Functionality:</h4>
Each item on the list contains <b>(name, type, quantity, image, description)</b>.

You can add new types at any moment. *Before adding any new items*, <b>at least 1 type</b> has to exist in the system.

Update item :: click on its name and confirm your changes when you're done editing.

Update quantity :: click Plus/Minus :: adds/subtracts <b>1</b> (or input.value if specified).

Delete item :: click Delete.

To see magnified image :: click on minimized icon ;
Toggle item descriptions :: tick checkbox in the topbar.

Everything is stored in two files :: .bak for latest backup, .dat for live data.
All data is also synchronized with the <b>localStorage</b> in real-time.


<ul><h2>Used technologies</h2>
	<li>electron.io</li>
	<li>vue.js 2.0</li>
	<li>grunt.js</li>
	<li>ES6/HTML/CSS</li>
</ul>
