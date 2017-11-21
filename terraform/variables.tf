variable "aws_region" {}
variable "environment" {}
variable "instance_type" {}

variable "vpc" {}
variable "subnets" {}

variable "key_name" {}

variable "cadvisor_url" { default = "https://github.com/google/cadvisor/releases/download/v0.22.0/cadvisor" }
variable "cadvisor_port" { default = "4914" }