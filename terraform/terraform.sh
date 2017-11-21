#!/bin/sh

usage () {
    echo >&2 "$@"
    echo >&2 ""
    echo >&2 "Program usage :"
    echo >&2 "    Parameter 1 = Operation (Ex: plan, apply, destroy)"
    echo >&2 "    Parameter 2 = Environment (Ex: prod, staging)"

    exit 1
}

[ "$#" -eq 2 ] || usage "2 argument required, $# provided"

VARFILE=environment/$2/terraform.tfvars

rm -rf .terraform
terraform init \
  -backend=true \
  -backend-config="region=us-east-1" \
  -backend-config="bucket=terraform-badge-parking-app" \
  -backend-config="key=badge-parking-api/$2/terraform.tfstate"

terraform ${1} -var-file=$VARFILE