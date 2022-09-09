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

https://github.com/aws/aws-elastic-beanstalk-cli-setup

```sh
eb init
```

If everything went fine you should be ready to deploy:

```sh
eb deploy
```

### Things that

- The consumer may stop running
- How to deal with dead queue
- Beanstalk can use a custom AMI