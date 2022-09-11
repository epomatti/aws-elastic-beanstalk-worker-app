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
  --message-body "Hello"
```

https://github.com/aws/aws-elastic-beanstalk-cli-setup

```sh
eb init
```

If everything went fine you should be ready to deploy:

```sh
eb deploy
```

> ⚠️ Use the `bash scripts/deploy.sh` script. For some reason `node_modules` is not being ignored by the `.ebignore` and is being sent corrupted, and when `node_modules` is present it doesn't trigger the automatic npm install managed by Beanstalk.


As always, ideally in your pipeline deploy only the production code:

```
npm install --only=prod
```

Send a single message:

```sh
aws sqs send-message \
  --queue-url $queue \
  --message-body "{ \"id\": \"yyy\" }"
```

Send a batch of messages:

```sh
aws sqs send-message-batch \
  --queue-url $queue \
  --entries file://test/send-message-batch-10.json
```

### Testing

```sh
bash scripts/recreate-dynamodb-table.sh
```

### Auto Scaling

https://jun711.github.io/aws/aws-elastic-beanstalk-worker-auto-scaling-by-queue-size/

### Things that

- Elastic Beanstalk is composed of multiple services and native features, so reading the documentation carefully an testing is essential to support a production application.
- The consumer may stop running
- How to deal with dead queue
- Beanstalk can use a custom AMI
- EB installs production dependencies ([ref](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/nodejs-platform-dependencies.html))

https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
https://docs.amazonaws.cn/en_us/elasticbeanstalk/latest/dg/create_deploy_nodejs_express.html
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.container.html
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/nodejs-configuration-procfile.html
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features-managing-env-tiers.html
https://docs.amazonaws.cn/en_us/elasticbeanstalk/latest/dg/nodejs-platform-shrinkwrap.html
