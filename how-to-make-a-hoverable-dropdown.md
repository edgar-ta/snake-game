# How to make a Hoverable Dropdown
---
## Overview

To make a hoverable dropdown, it is necessary a parent element `P` that contains a text element (option/item)  
as well as a group of other options that remains hidden until the user hovers over `P`.

## Structure

The basic HTML skeleton for a hoverable dropdown is:

```html
<ul class="menu__ul menu">
	<li class="menu__li">
		<p class="menu__p">Option/Item</p>
		<!-- iterable part -->
		<ul class="menu__ul">
			<li class="menu__li">
				<p class="menu__p">Sub Option/Item</p>
			</li>
		</ul>
	</li>
</ul>
```

To make a more complex dropdown, simply nest the iterable part inside an `li`, after a `p` (or the text element you're  
using) or add more `li`'s containing text.

```html
<ul class="menu__ul menu">
	<li class="menu__li">
		<p class="menu__p">Option/Item</p>
		<ul class="menu__ul">
			<li class="menu__li">
				<p class="menu__p">Sub Option/Item 1</p>
				<ul class="menu__ul">
					<li class="menu__li">
							<p class="menu__p">Sub Sub Option/Item 1</p>
					</li>
					<li class="menu__li">
							<p class="menu__p">Sub Sub Option/Item 2</p>
					</li>
				</ul>
			</li>
			<li class="menu__li">
				<p class="menu__p">Sub Option/Item 2</p>
			</li>
			<li class="menu__li">
				<p class="menu__p">Sub Option/Item 3</p>
				<ul class="menu__ul">
					<li class="menu__li">
							<p class="menu__p">Sub Sub Option/Item 1</p>
					</li>
					<li class="menu__li">
							<p class="menu__p">Sub Sub Option/Item 2</p>
					</li>
				</ul>
			</li>
		</ul>
	</li>
</ul>
```

On the CSS hand:

```css
/** to position the ul's (groups of suboptions/items) after every
li (option/item) **/
.menu__li {
	position: relative;
}

.menu__ul {
	/** same as above **/
	position: absolute;

	/** actual positioning **/
	left: 100%;
	top: 0;

	/** hide the suboptions/items **/
	display: none;

	/** these properties hinder the usage of the dropdown **/
	margin: 0;
	padding: 0;

	/** to make the dropdown look prettier **/
	list-style: none;
}

/** disable the styling on the first ul 
(the one that serves as the whole menu);
don't forget to do the same with another
properties that could affect the behavior
of the menu, such as left: 100% **/
.menu {
	position: initial;

	/** could be any, actually, but i chose this display just
	so that the menu doesn't take up the whole horizontal space **/
	display: inline-block;
}

/** when hovered, the li reveals its group of suboptions/items **/
.menu__li:hover > .menu__ul {
	display: block;
}

/** these properties hinder the usage of the dropdown as well **/
.menu__p {
	margin: 0;
	padding: 0;
}
```