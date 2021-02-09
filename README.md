2020 인공지능 식별추적시스템 - Media Server
=====
# 1. 설치
## 1.1. 사전 설치
    # homebrew
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

    # nodejs
    brew install nodejs

    # ffmpeg
    brew install ffmpeg

## 1.2. 설치
    # package
    npm install

    # npm으로 node-media-server가 설치 완료된 이후 첨부된 node-rtmp_session.js 파일을 node_modules\node-media-server 디렉토리에 붙여넣기

# 2. 실행
    node app.js [pc_number]
    # pc_number는 해당 pc의 번호를 의미하며, 채널 값을 설정하는 용도로 사용
 