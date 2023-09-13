## seoul-protest-reminder

## Requirements

- nodejs & yarn
- serverless

  ```bash
      npm install serverless -g

      serverless config credentials --provider aws --key "ACCESS_KEY_ID" --secret "AWS_SECRET_ACCESS_KEY"
  ```

## 배포준비

1. serverless.com 에 로그인 합니다

```bash
    serverless login
```

2. build & deploy

```bash
    yarn deploy # deploy
```

## 개발환경

1. 로컬에서 테스트

```bash
    yarn dev # local test
```

## 참고

- mongodb 를 사용한 이유.
  - atlas mongodb 에서 무료로 클러스터를 사용할 수 있기 때문
- email 을 사용하는 이유
  - 알림을 보내는 가장 쉬운 방법이라고 생각
