@font-face {
	font-family: '<%= fontName %>';
	src: <%= fontSrc %>;
}
.<%- fontName %>{
	font-family: '<%= fontName %>' !important;
	font-style: normal;
    font-size:42px;
	font-weight: normal !important;
	vertical-align: top;
}
<% _.each(items, function(items) { %>
.<%= items.name %>:before {
    content : '\<%= items.unicode %>'
}
<% }) %>