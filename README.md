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
