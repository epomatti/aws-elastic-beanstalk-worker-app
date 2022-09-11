# AWS Elastic Beanstalk Worker Environment

Architecture for worker-type applications for long-running tasks using Beanstalk. This configuration scales based on queue size and is highly-available across multiple availability zones.

<img src=".docs/beanstalk-worker.drawio.png" />

Get to know Beanstalk Worker by reading the [documentation](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features-managing-env-tiers.html).

## Cloud Deployment

Create TF config file:

```sh
touch infra/.auto.tfvars
```

Set the environment according to your preferences:

```hcl
region = "us-east-2"

availability_zone_a = "us-east-2a"
availability_zone_b = "us-east-2b"
availability_zone_c = "us-east-2c"

autoscaling_cooldown = 500
autoscaling_min_size = 1
autoscaling_max_size = 2

ec2_instance_types = "t2.micro"

sqs_daemon_max_concurrent_connections = 1
sqs_daemon_inactivity_timeout         = 499
sqs_daemon_visibility_timeout         = 500
sqs_daemon_max_retries                = 3
```

Create the infrastructure:

```sh
terraform -chdir="infra" init
terraform -chdir="infra" apply -auto-approve
```

Get the queue URL and set it as a variable:

```sh
export queue="https://sqs.<region>.amazonaws.com/<account>/<name>"
```

Enter the application directory:

```sh
cd worker
```

Deploy the application:

```sh
bash deploy.sh
```

Test it by sending messages to the queue:

```sh
# This will send 3 batches of 10 messages each = 30 messages in total
bash scripts/send-sqs-batch.sh 3
```

If everything worked accordingly the worker nodes should start processing the messages.

### Application Deployment

Enter the app directory:

```sh
cd worker
```

Create the `.env`:

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

## Local Development

```sh
LONG_RUNNING_TASK_DURATION=0
PORT=8080
DYNAMODB_REGION="us-east-2"
DYNAMODB_TABLE_NAME="BeanstalkTasks"
```

### Testing

```sh
export queue="https://sqs.<region>.amazonaws.com/<account>/<name>"
```

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
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/platforms-linux-extend.html
https://stackoverflow.com/a/49759065/3231778