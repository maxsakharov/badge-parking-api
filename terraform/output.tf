output "service_ip" {
  value = "${aws_eip.service_ip.public_ip}"
}