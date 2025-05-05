variable "region" {
  description = "The AWS region to create resources in."
}

variable "instance_id" {
  description = "The ID of the existing EC2 instance."
  type        = string
}

