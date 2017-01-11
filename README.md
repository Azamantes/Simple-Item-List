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
	<li>select type :: show only items of the given type</li>
	<li>type into search input :: show items whose names contains the input.value (case-sensitive)</li>
	<li>add item/type</li>
	<li>tick descriptions :: on/off</li>
	<li>sort items by clickin on column names <b>(name, amount, type)</b></li>
	<li>click on item's name :: update item's information and confirm your changes afterwards</li>
	<li>change item's quantity (+/-) 1 or input.value (if specified)</li>
	<li>remove item</li>
	<li>see magnified image</li>
</ul>


<h2>Used technologies</h2>
<ul>
	<li>electron.io</li>
	<li>vue.js 2.0</li>
	<li>grunt.js</li>
	<li>ES6/HTML/CSS</li>
</ul>
