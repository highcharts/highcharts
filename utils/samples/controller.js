
var controller = {
	toggleBisect: function () {
		var frameset = window.parent.document.querySelector('frameset'),
			frame = window.parent.document.getElementById('commits-frame'),
			checked;

		$(this).toggleClass('active');
		checked = $(this).hasClass('active');

		if (checked) {
			window.parent.commits = {};

			if (!frame) {
				frame = window.parent.document.createElement('frame');
				frame.setAttribute('id', 'commits-frame');
				frame.setAttribute('src', '/issue-by-commit/commits.php');
			} else {
				frame.contentWindow.location.reload();
			}

			frameset.setAttribute('cols', '400, *, 400');
			frameset.appendChild(frame);
		} else {
			frameset.setAttribute('cols', '400, *');
		}
	}
}