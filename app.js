const cluster = require('cluster');
const Net = require('net');

const { logger } = require('./src/logger.js');
const { MAX_PUBLISH, IP_ADDR, TCP_PORT } = require('./src/config.json');

const servNo = process.argv[2];

// 각 미디어 서버 당 2개의 server.js와 stream.js 모듈 생성
var servers = [];
var streams = [];

if(cluster.isMaster) {
    cluster.setupMaster({
        exec: './src/stream.js'
    });

    for(let i = 0; i < MAX_PUBLISH; i++) {
        let workerEnv = {};
        // 미디어 서버의 채널을 설정
        // 터미널에서 입력받은 서버 번호(servNo)와 미디어 서버 당 송출 개수(MAX_PUBLISH)로 채널 산정(0~7)
        workerEnv["channel"] = i + servNo * MAX_PUBLISH;
        let stream = cluster.fork(workerEnv);
        stream.on('message', message => {
            logger.debug('stream message : ', message);
        })
        streams[i] = stream;
    }

    cluster.setupMaster({
        exec: './src/server.js'
    });

    for(let i = 0; i < MAX_PUBLISH; i++) {
        let workerEnv = {};
        workerEnv["channel"] = i + servNo * MAX_PUBLISH;
        let server = cluster.fork(workerEnv);
        server.on('message', message => {
            logger.debug('server message : ', JSON.stringify(message));
            switch(message.type) {
            case "video:start":
                streams[message.data.channel - servNo * MAX_PUBLISH].send(message);
                break;
            }
        })
        servers[i] = server;
    }
}


// API 서버와 통신
// TCP 소켓
// JSON 예 : { type: 'START', scenarioType: 'video_verify' }
const server = Net.createServer(socket => {
    socket.setNoDelay(true);
    logger.debug('socket connection : ', socket.remoteAddress);

    socket.on('data', data => {
        let cmd = JSON.parse(data);
        logger.debug('from web server : ', cmd);

        if(cmd.message == "START") {
            servers.forEach(server => {
                server.send({
                    type: 'start',
                    data: {
                        sceneType: cmd.scenarioType
                    }
                })
            })
        }
    })
    socket.on('error', e => {
        logger.error('socket connection error : ', e);
    })
    socket.on('close', () => {
        logger.info('socket close : ', socket.remoteAddress);
    })
}).listen(TCP_PORT, IP_ADDR, () => {
    logger.info(`listening on ${IP_ADDR}:${TCP_PORT}`);
})
