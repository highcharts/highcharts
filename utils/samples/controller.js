/* global $, controller, window */
var controller = { // eslint-disable-line no-unused-vars

    frames: function () {
        return {
            frameset: window.parent.document.querySelector('frameset'),
            contents: window.parent.document.getElementById('contents'),
            commits: window.parent.document.getElementById('commits-frame')
        };
    },

    toggleBisect: function () {
        var frames = this.frames(),
            frame = frames.commits,
            frameset = frames.frameset,
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
    },

    testStatus: {
        success: [],
        skipped: [],
        error: [],
        total: 0
    },

    updateStatus: function (path, status) {
        var testStatus = this.testStatus;

        if (path) {
            // Remove from others
            ['success', 'skipped', 'error'].forEach(function (coll) {
                if (coll !== status) {
                    var i = testStatus[coll].indexOf(path);
                    if (i !== -1) {
                        testStatus[coll].splice(i, 1);
                    }
                }
            });
            if (testStatus[status]) {
                if (testStatus[status].indexOf(path) === -1) {
                    testStatus[status].push(path);
                }
            }
        }

        this.frames().contents.contentDocument.getElementById('test-status')
            .innerHTML =
            'Success: ' + testStatus.success.length + ', ' +
            '<a href="javascript:controller&&controller.filter(\'error\')">Error: ' +
                testStatus.error.length + '</a> of ' +
            '<a href="javascript:controller&&controller.filter()">' +
                testStatus.total + '</a>';
    },

    /*
     * Update the contents to show only errors, or show all
     */
    filter: function (status) {
        var contentFrame = this.frames().contents,
            error = this.testStatus.error;

        contentFrame.contentWindow.samples.forEach(function (path, i) {
            var li = contentFrame.contentDocument.querySelector('li#li' + i);
            if (li) {

                if (status === 'error' && error.indexOf(path) === -1) {
                    li.style.display = 'none';
                } else {
                    li.style.display = '';
                }
            }
        });

        [].forEach.call(
            contentFrame.contentDocument.querySelectorAll('h2, h4'),
            function (h) {
                if (status === 'error') {
                    h.style.display = 'none';
                } else {
                    h.style.display = '';
                }
            }
        );
    }

};
