resource "aws_iam_role" "default" {
  name = "badge-api-${var.environment}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "default" {
  name = "badge-api-${var.environment}"
  role = "${aws_iam_role.default.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ec2:DescribeInstances",
        "s3:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_instance_profile" "default" {
  name = "badge-api-${var.environment}"
  role = "${aws_iam_role.default.id}"
  depends_on = [ "aws_iam_role.default" ]
}

resource "aws_security_group" "instances" {
  name = "badge-api-security-group-instances-${var.environment}"

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 8080
    to_port = 8080
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = "${var.cadvisor_port}"
    to_port = "${var.cadvisor_port}"
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "random_id" "default" {
  byte_length = 16
}

data "template_file" "userdata" {
  template = "${file("${path.module}/cloud-config.yaml")}"
  vars {
    region                = "${var.aws_region}"
    cadvisor_port         = "${var.cadvisor_port}"
    cadvisor_url          = "${var.cadvisor_url}"
    environment           = "${var.environment}"
    random                = "${random_id.default.hex}"
    docker_image_tag      = "${var.environment}"
  }
}

resource "aws_eip" "service_ip" {
  instance = "${aws_instance.api_instance.id}"
  vpc      = true
}

resource "aws_instance" "api_instance" {
  ami           = "ami-ad593cbb"
  instance_type = "${var.instance_type}"
  user_data     = "${data.template_file.userdata.rendered}"
  key_name      = "${var.key_name}"

  vpc_security_group_ids = ["${aws_security_group.instances.id}"]
  iam_instance_profile = "${aws_iam_instance_profile.default.name}"

  depends_on = ["data.template_file.userdata"]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_s3_bucket" "data_bucket" {
  bucket = "badge-files-${var.environment}"
  acl    = "public-read"
}



