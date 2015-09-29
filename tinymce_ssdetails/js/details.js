// add the class view
tinyMCEPopup.onInit.add(function () {
	tinyMCEPopup.dom.setHTML('DetailsClassView', renderClassListHTML());
	tinymce.init({
		selector: "#DetailsTextArea",
		theme: 'advanced',
		plugins: 'autoresize',
		width: '100%',
		height: 250,
		autoresize_min_height: 250,
		autoresize_max_height: 800,
	});
});


/**
 * populate the dropdown of span icons
 * @returns {String|html}
 */
function renderClassListHTML() {
	if (!tinyMCEPopup.getParam("details_icons_class")) {
		return "";
	}

	iconmap = tinyMCEPopup.getParam("details_icons_class").split("]");

	html = '<select id="IconName">';
	html += '<option value="">Select an icon...</option>';

	for (i = 0; i < iconmap.length; i++) {
		if (!iconmap[i]) {
			continue;
		}
		if (iconmap[i][0] == ',') {
			iconmap[i] = iconmap[i].substring(1);
		}
		iconvalues = iconmap[i].split(",");
		classname = iconvalues[0].substring(1);
		classvalue = iconvalues[1];

		html += '<option value="' + classname + '">' + classvalue + '</option>';
	}

	html += '</select>';
	return html;
}

var InsertDetailsDialog = {
	init: function () {
		// populate the summary title with your selection
		var defaultsummarytext = this.strip(tinyMCEPopup.editor.selection.getContent());
		this.selectedSummary = this.getClosest(tinyMCEPopup.editor.selection.getNode(), 'details');

		// editing an existing summary tag
		if (this.selectedSummary) {
			//defaultsummarytext = this.selectedSummary.getElementsByTagName("SUMMARY")[0].innerHTML;
			detailsclone = this.selectedSummary.cloneNode(true);

			rmsummary = detailsclone.getElementsByTagName("SUMMARY")[0];
			spans = rmsummary.getElementsByTagName("SPAN");

			// you have inserted an icon previously, select it by default
			if (spans.length > 0) {
				var selectedclass = spans[0].className;

				var trends = document.getElementById('IconName'), opts, i;

				for (i = 0; i < trends.length; i++) {
					opts = trends[i];
					if (opts.value == selectedclass) {
						document.getElementById('IconName').selectedIndex = i;
					}
				}

				spans[0].parentNode.removeChild(spans[0]);
			}
			defaultsummarytext = rmsummary.innerHTML;
			rmsummary.removeChild(rmsummary.childNodes[0]);

			tinyMCEPopup.editor.windowManager.setTitle(window, "Modify details tag");
			document.getElementById('DetailsTextArea').value = detailsclone.innerHTML;
		}
		document.getElementById('Summary').value = defaultsummarytext;
	},
	strip: function (html) {
		var tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || "";
	},
	getClosest: function (el, tag) {
		tag = tag.toUpperCase();
		do {
			if (el.nodeName === tag) {
				return el;
			}
		} while (el = el.parentNode);

		// not found :(
		return null;
	},
	insert: function () {
		var mycontent = tinyMCE.get('DetailsTextArea').getContent();
		var mysummary = document.getElementById('Summary').value;
		if (!mycontent) { // having nothing will make it hard to modify things
			mycontent = " .. ";
		}

		// if you selected an icon
		var e = document.getElementById("IconName");
		if (e && e.options[e.selectedIndex].value) {
			mysummary = '<span class="' + e.options[e.selectedIndex].value +
					'" aria-hidden="true">&nbsp;</span>' + mysummary;
		}

		if (this.selectedSummary) {
			// updating an existing summary tag
			contentcomplete = '<summary>' + mysummary + '</summary>' + mycontent;
			this.selectedSummary.innerHTML = contentcomplete;

			tinyMCEPopup.close();
		} else {
			// inserting a new tag
			contentcomplete = '<div><details><summary>' + mysummary + '</summary>' + mycontent + '</details></div>';
			tinyMCEPopup.editor.execCommand('mceInsertContent', false, contentcomplete);
			tinyMCEPopup.close();
		}
	}
}
tinyMCEPopup.onInit.add(InsertDetailsDialog.init, InsertDetailsDialog);