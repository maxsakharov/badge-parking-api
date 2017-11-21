# badge-parking-api

### API
Please refer to the `swagger.yml` regarding api endpoints. Copy [swagger.yml](https://github.com/maxsakharov/badge-parking-api/blob/dev/swagger.yml) content to the [swagger editor](https://editor.swagger.io/) to check endpoints information

### Deployment
We deploy badge-parking-api to AWS. AWS infra created with help of terraform. For AWS & SSH and Docker hub keys ask owner of the repo.
 
#### Deploy the code
You can easily deploy code just running `./deploy.sh` script. It will automatically recognize what branch you're in and deploy 
code to prod if you're on master branch, otherwise to dev

Under the hood process looks like this:

* create Docker image
* push Docker image to dockerhub.io
* remotely restart process on EC2 box. Which will pull latest image and restart the service
 
#### Deploy the infrastructure
Go to the `terraform` folder and execute `./terraform.sh` like below

To create DEV infra
```
./terraform apply dev
```

To create PROD infra
```
./terraform apply prod
```

After terraform finish its job it will output IP of the box where your service will be located 