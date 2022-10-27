# 1. 동영상 디렉토리
> 동영상 디렉토리는 평가 항목에 따라 나뉨  
> * video_verify : 1:1 평가용 동영상 디렉토리  
> * video_identify : 1:N 평가용 동영상 디렉토리  
> * video_behavior : 이상행동 평가용 동영상 디렉토리  
> * video_behavior_person : 이상행동 및 행위자 인식 평가용 동영상 디렉토리    
> * video_waitingline : 대기열 혼잡도 동영상 디랙토리

# 2. 엑셀 파일
> 엑셀 파일에서 실제 사용되는 시트는 아래 4개임  
> * video_verify : 실제 1:1 평가용 동영상 리스트  
> * video_identify : 실제 1:N 평가용 동영상 리스트  
> * video_behaivor : 실제 이상행동 평가용 동영상 리스트  
> * video_behavior_person : 실제 이상행동 및 행위자 인식 평가용 동영상 리스트
> * video_waitingline : 실제 대기열 혼잡도 평가용 동영상 리스트

> 그 외 시트는 참고용  
> * code : 파일명에 작성된 코드와 이름을 매칭시키기 위해 작성  
> * images : 수집된 전체 등록용 이미지 파일 리스트  
> * enroll : 실제 평가에 사용될 등록용 이미지 파일 리스트  
> * verify : 전체 1:1 평가용 동영상 리스트  
> * identify : 전체 1:N 평가용 동영상 리스트  
> * behavior : 전체 이상행동 평가용 동영상 리스트  
> * behavior-person : 전체 이상행동 및 행위자 인식 평가용 동영상 리스트    
> * waitngline : 전체 대기열 혼잡도 평가용 동영상 리스트

# 3. 기타
> 사전 프로토콜 테스트를 진행하게 되면 편의에 따라 resources_protocoltest 디렉토리를 생성하여 관리