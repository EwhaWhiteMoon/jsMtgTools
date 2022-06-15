## ScryNamu
[Scryfall](https://scryfall.com)의 카드 데이터를 [나무위키 매직 더 개더링 카드 템플릿](https://namu.wiki/w/%ED%85%9C%ED%94%8C%EB%A6%BF:%EB%A7%A4%EC%A7%81%20%EB%8D%94%20%EA%B0%9C%EB%8D%94%EB%A7%81/%EC%B9%B4%EB%93%9C)에 맞춰서 작성해 주는 Tampermonkey 스크립트입니다.

Tampermonkey가 설치된 브라우저가 필요합니다. 
현재 Firefox 최신 버전 기준으로 작동을 확인하고 있습니다. navigator.clipboard를 사용하기 때문에, IE에선 작동하지 않습니다.

### 사용법
[설치 링크](https://github.com/suyasuyazzang/jsMtgTools/raw/main/scrynamu.user.js)
스크립트 설치 후, scryfall의 **한글** 카드 정보 페이지에 들어가면 카드 이름 옆에 보라색 나무! 버튼을 클릭하시면 됩니다.
클립보드에 복사된 데이터를 붙여넣기해서 사용하세요.

### 버그 제보 및 기여
github를 통해서 많관부

### todo
양면 카드, 모험 카드 등 지원 추가 (귀찮으니까 누가 와서 해 주면 더 좋겠습니다)

## Known issues
- [x] 다색 정렬이 제대로 되지 않는 문제 (2022-06-15 완료)
