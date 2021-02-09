const xlsx = require('xlsx')

const { logger } = require('./logger.js');

var wb = xlsx.readFile('./resources/test.xlsx');
var verifySheet = wb.Sheets["video_verify"];
var identifySheet = wb.Sheets["video_identify"];
var behaviorSheet = wb.Sheets["video_behavior"];
var behaviorPersonSheet = wb.Sheets["video_behavior_person"];

var verify = xlsx.utils.sheet_to_json(verifySheet);
var identify = xlsx.utils.sheet_to_json(identifySheet);
var behavior = xlsx.utils.sheet_to_json(behaviorSheet);
var behaviorPerson = xlsx.utils.sheet_to_json(behaviorPersonSheet);

function get_total_test(type, channel) {
    switch(type) {
    case 'video_verify':
        logger.info(`TOTAL TEST(${type}) : ${verify.length}`)
        return verify.length;
    case 'video_identify':
        logger.info(`TOTAL TEST(${type}) : ${identify.length}`)
        return identify.length;
    case 'video_abnormal':
        logger.info(`TOTAL TEST(${type}) : ${behavior.length}`)
        return behavior.length;
    case 'video_abnormal_person':
        logger.info(`TOTAL TEST(${type}) : ${behaviorPerson.length}`)
        return behaviorPerson.length;
    }
}

function get_media_info(type, test_id, channel) {
    switch(type) {
    case 'video_verify':
        if(channel == 0) {
            return verify[test_id].media;
        }
    case 'video_identify':
        if(channel == 0) {
            return identify[test_id].channel_0
        } else if(channel == 1) {
            return identify[test_id].channel_1
        } else if(channel == 2) {
            return identify[test_id].channel_2
        } else if(channel == 3) {
            return identify[test_id].channel_3
        } else if(channel == 4) {
            return identify[test_id].channel_4
        } else if(channel == 5) {
            return identify[test_id].channel_5
        } else if(channel == 6) {
            return identify[test_id].channel_6
        } else if(channel == 7) {
            return identify[test_id].channel_7
        }
    case 'video_abnormal':
        if(channel == 0) {
            return behavior[test_id].channel_0
        } else if(channel == 1) {
            return behavior[test_id].channel_1
        } else if(channel == 2) {
            return behavior[test_id].channel_2
        } else if(channel == 3) {
            return behavior[test_id].channel_3
        } else if(channel == 4) {
            return behavior[test_id].channel_4
        } else if(channel == 5) {
            return behavior[test_id].channel_5
        } else if(channel == 6) {
            return behavior[test_id].channel_6
        } else if(channel == 7) {
            return behavior[test_id].channel_7
        }
    case 'video_abnormal_person':
        if(channel == 0) {
            return behaviorPerson[test_id].channel_0
        } else if(channel == 1) {
            return behaviorPerson[test_id].channel_1
        } else if(channel == 2) {
            return behaviorPerson[test_id].channel_2
        } else if(channel == 3) {
            return behaviorPerson[test_id].channel_3
        } else if(channel == 4) {
            return behaviorPerson[test_id].channel_4
        } else if(channel == 5) {
            return behaviorPerson[test_id].channel_5
        } else if(channel == 6) {
            return behaviorPerson[test_id].channel_6
        } else if(channel == 7) {
            return behaviorPerson[test_id].channel_7
        }
    }
}

module.exports = {
    get_total_test,
    get_media_info
}