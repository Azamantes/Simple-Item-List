# Simple-Item-List

<h2>Main goal:</h2>
Create a list of items (+ sort, filter).

<h2>Functionality:</h2>
Each item on the list contains <b>(name, type, quantity, image, description)</b>.
Everything is stored in two files :: .bak for latest backup, .dat for live data.
All data is also synchronized with the <b>localStorage</b> in real-time.
You can add new types at any moment. *Before adding any new items*, <b>at least 1 type</b> has to exist in the system.

<h2>Actions:</h2>
<ul>
	<li>click name :: update item's information and confirm your changes afterwards</li>
	<li>click 'plus/minus' :: add/subtract <b>1</b> (or input.value if specified) to/from item's quantity</li>
	<li>click 'delete' :: remove the given item</li>
	<li>click on minimized icon :: see magnified image</li>
	<li>click column name :: sort by the given column <b>(name, amount, type)</b></li>
	<li>tick checkbox in the topbar :: toggle item descriptions</li>
</ul>


<h2>Used technologies</h2>
<ul>
	<li>electron.io</li>
	<li>vue.js 2.0</li>
	<li>grunt.js</li>
	<li>ES6/HTML/CSS</li>
</ul>
