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


As always, ideally in your pipeline deploy only the production code:

```
npm install --only=prod
```

### Things that

- The consumer may stop running
- How to deal with dead queue
- Beanstalk can use a custom AMI

https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
https://docs.amazonaws.cn/en_us/elasticbeanstalk/latest/dg/create_deploy_nodejs_express.html
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.container.html
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/nodejs-configuration-procfile.html
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features-managing-env-tiers.html
https://docs.amazonaws.cn/en_us/elasticbeanstalk/latest/dg/nodejs-platform-shrinkwrap.html
