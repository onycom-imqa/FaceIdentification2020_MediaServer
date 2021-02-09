const exec = require('child_process').exec;

const { logger } = require('./logger.js');

const { MEDIA_PUBLISH_ADDR, MEDIA_PORT_BASE } = require('./config.json');

const channel = Number(process.env["channel"]);
const RTMP_PORT = channel + MEDIA_PORT_BASE;
const STREAM_URL = `rtmp://${MEDIA_PUBLISH_ADDR}:${RTMP_PORT}/live/${channel}`;

process.on('message', message => {
    switch(message.type) {
    case 'video:start':
        start_publish(message.data);
        
        break;
    }
})

/**
 * child process exec로 ffmpeg 송출 시작
 * @param {Object}} data 
 * JSON 예 : { 'type': 'video_identify', 'file': 'test.flv' }
 */
function start_publish(data) {
    logger.info(`START STREAM(${channel}) : ${JSON.stringify(data)}`)
    let cmd = `echo "1234" | sudo -S ffmpeg -i ./resources/${data.file} -r 30 -c:v libx264 -preset fast -b:v 2M -maxrate 2M -bufsize 1M -tune zerolatency -f flv ${STREAM_URL}`;

    exec(cmd, (err, stdout, stderr) => {
        if(err) {
            logger.error(`STREAM ERROR(${channel}) : ${data.file}`);
            logger.error(`${stderr}`);
        } else {
            logger.info(`End of publish(${channel}) : ${data.file}`)
            logger.info(`${stdout}`)
        }
    })
}