const Nms = require('node-media-server');
const request = require('request-promise');
const moment = require('moment');

const { logger } = require('./logger.js');
const { get_total_test, get_media_info } = require('./parser.js');
const { HTTP_ADDRESS, HTTP_PORT, ONE_REQUEST, MANY_REQUEST, BEHAVIOR_REQUEST, BEHAVIOR_PERSON_REQUEST, WAITING_LINE } = require('./config.json');

const channel = Number(process.env["channel"]);
const RTMP_PORT = require('./config.json').MEDIA_PORT_BASE + channel;


logger.info(`MEDIA SERVER OPEN : ${channel}`);

var serverState;
var currentIdx;
var totalIdx;
var startTime;
var endFlag;
var sceneType;
var mediaName;
var playTime;
var urlPath;

process.on('message', message => {
    logger.debug(`message to server(${channel}) : ${JSON.stringify(message)}`);
    switch(message.type) {
    case 'start':
        init_values(message.data.sceneType);
        logger.info(`[${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}] server(${channel}) start`);

        if(message.data.sceneType == 'video_verify' && channel !== 0) {
            logger.info(`[${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}] This channel not host rtmp video : ${message.data.sceneType}`);
            return;
        }

        switch(message.data.sceneType) {
        case 'video_verify':
            urlPath = ONE_REQUEST;
            break;
        case 'video_identify':
            urlPath = MANY_REQUEST;
            break;
        case 'video_abnormal':
            urlPath = BEHAVIOR_REQUEST;
            break;
        case 'video_abnormal_person':
            urlPath = BEHAVIOR_PERSON_REQUEST;
            break;
        case 'video_waitingline':
            urlPath = WAITING_LINE;
            break;


        default:
            logger.debug(`Unknown Type : ${JSON.stringify(message.data)}`)
            break;
        }

        play_video();
        break;
    }
})

// NMS 구성
var config = {
    logType: 0,
    rtmp: {
        port: RTMP_PORT,
        chunk_size: 60000,
        gop_cache: false,
        ping: 10
    }
};

var nms = new Nms(config);
nms.run();

// NMS 이벤트 핸들러
nms.on('preConnect', (id, args) => {
    logger.info(`CONNECTION(${channel}) : ${nms.getSession(id).res.remoteAddress}`)
})
nms.on('prePublish', (id, StreamPath, args) => {
    logger.info(`prePublish(${channel}) : ${nms.getSession(id).res.remoteAddress}`)
})
nms.on('donePublish', (id, StreamPath, args) => {
    logger.info(`done Publish(${channel})`);
    refresh_timer();
})

function init_values(type) {
    serverState = 'ready';
    currentIdx = 0;
    totalIdx = 0;
    startTime = '';
    endFlag = false;
    sceneType = type;
    mediaName = '';
    playTime = 0;
    urlPath = '';
}

/**
 * 동영상 송출 시작
 */
function play_video() {
    startTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    totalIdx = get_total_test(sceneType, channel);
    logger.info(`CURRENT TEST(${channel}) : ${currentIdx}`)
    let res = get_media_info(sceneType, currentIdx, channel);
    mediaName = res;

    process.send({
        type: 'video:start',
        data: {
            channel: channel,
            file: sceneType + '/' + mediaName,
        }
    });
    logger.info(`Media Play(${channel}) : ${mediaName}`);
}

/**
 * 동영상 종료 후 대기시간 타이머
 * API 서버로 결과 데이터를 전송하는 send_finish() 함수 호출
 */
function refresh_timer() {
    currentIdx++;

    if(check_test_stop()) {
        logger.info(`MEDIA END(${channel}) : ${currentIdx} / ${totalIdx}`);
        send_finish(true);
        init_values(undefined);
    } else {
        logger.info(`MEDIA NEXT(${channel}) : ${currentIdx}`);
        send_finish(false);
    }

    setTimeout(() => {
        logger.info(`PREPAREING NEXT MEDIA(${channel})`);
        play_video();
    }, 15 * 1000);
}

function check_test_stop() {
    if(currentIdx < totalIdx) {
        return endFlag = false;
    } else {
        return endFlag = true;
    }
}

/**
 * API 서버로 결과 데이터 전달
 * @param {Boolean} flag
 * video_number : 직전에 종료된 영상의 test_id
 * send_time : 직전에 종료된 영상의 송출 시간
 * end_flag : 전체 테스트 종료 플래그
 * channel_id : 현재 송출중인 미디어 서버의 채널
 */
function send_finish(flag) {
    let dataBody = {
        video_number: currentIdx - 1,
        send_time: startTime,
        end_flag: flag,
        channel_id: channel
    };

    let opt = {
        method: 'POST',
        uri: 'http://' + HTTP_ADDRESS + ':' + HTTP_PORT + '/' + urlPath,
        body: dataBody,
        json: true,
        header: { 'Content-Type': 'application/json'}
    };

    request(opt) 
      .then(res => {
          logger.info(`HTTP REQUEST(${channel}) : ${JSON.stringify(opt)}`);
      })
      .catch(e => {
          logger.error(`HTTP BAD REQUEST(${channel}) : ${e}`);
      })
}
