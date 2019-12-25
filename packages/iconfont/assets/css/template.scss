@font-face {
	font-family: "<%= fontName %>";
	src: url('../<%= fontName %>.eot<%= cacheBusterQueryString %>');
	src: url('../<%= fontName %>.eot?<%= cacheBuster %>#iefix') format('eot'),
		url('../<%= fontName %>.woff2<%= cacheBusterQueryString %>') format('woff2'),
		url('../<%= fontName %>.woff<%= cacheBusterQueryString %>') format('woff'),
		url('../<%= fontName %>.ttf<%= cacheBusterQueryString %>') format('truetype'),
		url('../<%= fontName %>.svg<%= cacheBusterQueryString %>#<%= fontName %>') format('svg');
}

.<%= cssClass %>:before {
	font-family: "<%= fontName %>";
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-style: normal;
	font-variant: normal;
	font-weight: normal;
	/* speak: none; only necessary if not using the private unicode range (firstGlyph option) */
	text-decoration: none;
	text-transform: none;
}

<% _.each(glyphs, function(glyph) { %>
.<%= cssClass %>-<%= glyph.fileName %>:before {
	content: "\<%= glyph.codePoint %>";
}
<% }); %>