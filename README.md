# aws-image-processor

```sh
touch .auto.tfvars
```



```sh
touch .env
```

```sh
aws sqs send-message \
  --queue-url $queue \
  --message-body "file://tests/message-body.json"
```