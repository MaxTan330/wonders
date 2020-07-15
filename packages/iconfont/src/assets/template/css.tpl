@font-face {
	font-family: '<%= fontName %>';
	<%= fontSrc %>;
}
.<%- fontName %>{
	font-family: '<%= fontName %>' !important;
	font-style: normal;
    font-size:42px;
	font-weight: normal !important;
	vertical-align: top;
}
<% _.each(items, function(items) { %>
.<%- fontName %>-<%= items.name %>:before {
    content : '\<%= items.unicode %>'
}
<% }) %>