(function () {
	tinymce.create('tinymce.plugins.ssdetails', {
		init: function (ed, url) {
			// Register commands
			ed.addCommand('mceInsertDetails', function () {
				ed.windowManager.open({
					file: url + '/details.htm',
					width: 750 + parseInt(ed.getLang('advanced.details_delta_width', 0)),
					height: 450 + parseInt(ed.getLang('advanced.details_delta_height', 0)),
					inline: true
				}, {
					plugin_url: url
				});
			});
			var closest = function (el, tag) {
				tag = tag.toUpperCase();
				do {
					if (el.nodeName === tag) {
						return el;
					}
				} while (el = el.parentNode);
				return null;
			};
			ed.addCommand('mceRemoveDetails', function () {
				var selectedDetails = closest(ed.selection.getNode(), 'details');
				if (selectedDetails) {
					// replacement span
					var mySpan = document.createElement("span");

					// try to remove the summary tag
					defaultsummarytext = selectedDetails.getElementsByTagName("SUMMARY")[0].innerHTML;
					rmsummary = selectedDetails.getElementsByTagName("SUMMARY")[0];
					if (rmsummary) {
						rmsummary.removeChild(rmsummary.childNodes[0]);
					}
					mySpan.innerHTML = defaultsummarytext + '<br/>' + selectedDetails.innerHTML;
					selectedDetails.parentNode.replaceChild(mySpan, selectedDetails);
				}
			});

			// Register buttons
			ed.addButton('ssdetails', {
				title: 'Insert an expandable details and summary element',
				cmd: 'mceInsertDetails',
				image: url + '/img/ssdetails.png'
			});
			// Register buttons
			ed.addButton('ssremovedetails', {
				title: 'Remote details tag',
				cmd: 'mceRemoveDetails',
				image: url + '/img/ssclose.png'
			});

			// Disable link button when no link is selected
			ed.onNodeChange.add(function (ed, cm, n, co) {
				cm.setDisabled('ssremovedetails', !closest(n, 'details'));
				cm.setActive('ssremovedetails', closest(n, 'details') );
			});

		},
		getInfo: function () {
			return {
				longname: 'ssdetails',
				author: 'Torleif West',
				authorurl: 'http://op.ac.nz/',
				infourl: 'https://github.com/otago/summarydetails',
				version: "1.0"
			};
		}
	});

	tinymce.PluginManager.add('ssdetails', tinymce.plugins.ssdetails);
})();