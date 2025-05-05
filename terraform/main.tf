terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region # Region where the instance is located
}

data "aws_instance" "existing_instance" {
  instance_id = var.instance_id # Instance ID
}

resource "null_resource" "deploy_nest_app" {
  connection {
    type        = "ssh"
    host        = data.aws_instance.existing_instance.public_ip
    user        = "ubuntu"        # SSH user for the instance
    private_key = file("key.pem") # Path to your private key
  }

  provisioner "remote-exec" {
    inline = [
      # Create workspace directory if it doesn't exist
      "mkdir -p /home/ubuntu/workspace",
      "cd /home/ubuntu/workspace",

      # Clone the repository if it doesn't exist
      "if [ -d nest-blog-api ]; then echo 'Repo exists. Pulling...'; cd nest-blog-api && git pull && cd ..; else echo 'Cloning repo...'; git clone https://github.com/luongtt-dipro/nest-blog-api.git; fi",

      # Run docker-compose at file in repo
      "cd /home/ubuntu/workspace/nest-blog-api",
      "docker-compose -f docker-compose.prod.yaml down || true",
      "docker-compose --env-file .env.prod -f docker-compose.prod.yaml up -d"
    ]
  }
}
