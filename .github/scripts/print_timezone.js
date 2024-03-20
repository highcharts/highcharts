module.exports.timezone = function() {
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
};
