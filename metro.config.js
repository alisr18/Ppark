const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');

module.exports = {
    resolver: {
        blacklistRE: exclusionList([path.resolve(__dirname, 'functions')]),
    },
};
