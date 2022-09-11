terraform {
  backend "local" {
    path = ".workspace/terraform.tfstate"
  }
}

provider "aws" {
  region = var.region
}

### VPC

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  instance_tenancy     = "default"
  enable_dns_hostnames = true
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
}

resource "aws_default_route_table" "internet" {
  default_route_table_id = aws_vpc.main.default_route_table_id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
}

resource "aws_default_security_group" "main" {
  vpc_id = aws_vpc.main.id
}

resource "aws_security_group_rule" "ingress_all" {
  type              = "ingress"
  from_port         = 0
  to_port           = 65535
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_default_security_group.main.id
}

resource "aws_security_group_rule" "egress_all" {
  type              = "egress"
  from_port         = 0
  to_port           = 65535
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_default_security_group.main.id
}

resource "aws_subnet" "a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.0.0/24"
  map_public_ip_on_launch = true
  availability_zone       = var.availability_zone_a
}

resource "aws_subnet" "b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.10.0/24"
  map_public_ip_on_launch = true
  availability_zone       = var.availability_zone_b
}

resource "aws_subnet" "c" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.20.0/24"
  map_public_ip_on_launch = true
  availability_zone       = var.availability_zone_c
}

### DynamoDB ###

resource "aws_dynamodb_table" "beanstalk_tasks" {
  name           = "BeanstalkTasks"
  billing_mode   = "PAY_PER_REQUEST"
  stream_enabled = false
  hash_key       = "MessageId"
  range_key      = "Status"

  attribute {
    name = "MessageId"
    type = "S"
  }

  attribute {
    name = "Status"
    type = "S"
  }
}

### Permissions ###

resource "aws_iam_role" "main" {
  name = "app-test-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "AWSElasticBeanstalkWebTier" {
  role       = aws_iam_role.main.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

resource "aws_iam_role_policy_attachment" "AWSElasticBeanstalkWorkerTier" {
  role       = aws_iam_role.main.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier"
}

resource "aws_iam_role_policy_attachment" "AWSElasticBeanstalkMulticontainerDocker" {
  role       = aws_iam_role.main.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker"
}

resource "aws_iam_role_policy_attachment" "AmazonSSMManagedInstanceCore" {
  role       = aws_iam_role.main.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "AmazonDynamoDBFullAccess" {
  role       = aws_iam_role.main.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_iam_instance_profile" "main" {
  name = "beanstalk-test-profile"
  role = aws_iam_role.main.id

  depends_on = [
    aws_iam_role_policy_attachment.AWSElasticBeanstalkWebTier,
    aws_iam_role_policy_attachment.AWSElasticBeanstalkWorkerTier,
    aws_iam_role_policy_attachment.AWSElasticBeanstalkMulticontainerDocker,
    aws_iam_role_policy_attachment.AmazonSSMManagedInstanceCore,
    aws_iam_role_policy_attachment.AmazonDynamoDBFullAccess
  ]
}

### Elastic Beanstalk ###

resource "aws_key_pair" "beanstalk_worker_key" {
  key_name   = "beanstalk-worker-key"
  public_key = file("${path.module}/keys/id_rsa.pub")
}

resource "aws_elastic_beanstalk_application" "main" {
  name        = "long-running-app"
  description = "Processes long-running tasks with workers"
}

resource "aws_elastic_beanstalk_environment" "main" {
  name                = "long-running-environment"
  application         = aws_elastic_beanstalk_application.main.name
  solution_stack_name = "64bit Amazon Linux 2 v5.5.6 running Node.js 16"
  tier                = "Worker"

  // Settings
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.main.name
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "EC2KeyName"
    value     = aws_key_pair.beanstalk_worker_key.key_name
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = aws_vpc.main.id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = "${aws_subnet.a.id},${aws_subnet.b.id},${aws_subnet.c.id}"
  }

  // Environment
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "LoadBalanced"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    // TODO: Create dedicated role?
    value = "aws-elasticbeanstalk-service-role"
  }

  // Auto Scaling
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "Cooldown"
    value     = var.autoscaling_cooldown
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = var.autoscaling_min_size
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = var.autoscaling_max_size
  }

  // EC2
  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = var.ec2_instance_types
  }

  // Worker
  setting {
    namespace = "aws:elasticbeanstalk:sqsd"
    name      = "HttpConnections"
    value     = var.sqs_daemon_max_concurrent_connections
  }

  setting {
    namespace = "aws:elasticbeanstalk:sqsd"
    name      = "InactivityTimeout"
    value     = var.sqs_daemon_inactivity_timeout
  }

  setting {
    namespace = "aws:elasticbeanstalk:sqsd"
    name      = "VisibilityTimeout"
    value     = var.sqs_daemon_visibility_timeout
  }

  setting {
    namespace = "aws:elasticbeanstalk:sqsd"
    name      = "MaxRetries"
    value     = var.sqs_daemon_max_retries
  }

  // Application
  setting {
    namespace = "aws:elasticbeanstalk:application"
    name      = "Application Healthcheck URL"
    value     = "/health"
  }

  // Environment Properties
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "LONG_RUNNING_TASK_DURATION"
    value     = "60000"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DYNAMODB_REGION"
    value     = var.region
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DYNAMODB_TABLE_NAME"
    value     = "BeanstalkTasks"
  }

  // CloudWatch Logs
  setting {
    namespace = "aws:elasticbeanstalk:cloudwatch:logs"
    name      = "StreamLogs"
    value     = "true"
  }

  setting {
    namespace = "aws:elasticbeanstalk:cloudwatch:logs"
    name      = "DeleteOnTerminate"
    value     = "true"
  }

  // Health Check
  setting {
    namespace = "aws:elasticbeanstalk:cloudwatch:logs:health"
    name      = "HealthStreamingEnabled"
    value     = "true"
  }
}
