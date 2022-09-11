variable "region" {
  type = string
}

variable "availability_zone_a" {
  type = string
}

variable "availability_zone_b" {
  type = string
}

variable "availability_zone_c" {
  type = string
}

variable "autoscaling_cooldown" {
  type = number
}

variable "autoscaling_min_size" {
  type = number
}

variable "autoscaling_max_size" {
  type = number
}

variable "ec2_instance_types" {
  type = string
}

variable "sqs_daemon_max_concurrent_connections" {
  type = number
}

variable "sqs_daemon_inactivity_timeout" {
  type = number
}

variable "sqs_daemon_visibility_timeout" {
  type = number
}

variable "sqs_daemon_max_retries" {
  type = number
}
