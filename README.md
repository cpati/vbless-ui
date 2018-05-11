Kubernetes and Jenkins set up in AWS EC2 - Amazon Linux
-------------------------------------------------------
--Kubernetes----
1. Create an AWS EC2 instance with Amazon Linux
2. Login to AWS console, the details can be obtained by clicking on connect button in AWS EC2 console
3. Create Kubernetes Cluster:
   a. Route53 - Required for kops setup:
      #. Route53 register domain: themodestwhite.com
   b. ssh-keygen
   c. get kops tool:
    curl -LO https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-linux-amd64
    
    chmod +x kops-linux-amd64
    
    sudo mv kops-linux-amd64 /usr/local/bin/kops
   d. get kubectl
    wget -O kubectl https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
    chmod +x ./kubectl
    sudo mv ./kubectl /usr/local/bin/kubectl
   e. create a Route53 hosted zone
    aws route53 create-hosted-zone --name k8.themodestwhite.com --caller-reference 1
   f. Create S3 bucket for storing cluster info:
    aws s3 mb s3://clusters.k8.themodestwhite.com

    export KOPS_STATE_STORE=s3://clusters.k8.themodestwhite.com
   g. Create K8 Cluster:
    kops create cluster --cloud=aws --zones=us-west-2b --name=c1.themodestwhite.com
    kops update cluster c1.themodestwhite.com --yes
    
    It creates 1 EC2 master instance (Node) and 2 worker instances (Nodes) and autoscaling groups
   f. kubectl proxy : This is required for Jenkins (not sure if there is a   
      better way) if it does not return 8001 port , we need to update Jenkinsfile for vbless-server with the correct port
   
4. Re-starting kubernetes:
    a. export KOPS_STATE_STORE=s3://clusters.k8.themodestwhite.com
    b. kops update cluster c1.themodestwhite.com --yes
        - It will recreate master and worker nodes
    c. kubectl proxy
         - kubectl proxy --port=8001

5.  Stop Kubernetes Cluster:
   a. Delete Auto scaling group in EC2 console
   b. Stop first EC2 instance
   c. Stop Master instance , this will automatically stop worker instances


6. Some Kubernetes Commands:
   a. deployments
      -  kubectl get deployment
      -  kubectl describe deployment <deployment name>
      -  kubectl delete deployment <deployment name>
   b. Pods:
      - kubectl get pods
      - kubectl describe pod <pod name>
      - kubectl delete pod <pod name>        
   c. services:
      - kubectl get service
      - kubectl describe service <service name>
      - kubectl delete service <service name>
   d. Create artifacts (any kind) using yaml file:
      - kubectl apply -f <yaml file name> 

7. In our project all artifacts are created using yaml file present in      
   respective github repo, except secret data like mysql, aws credentials etc which is present in secret-data.yaml not checked in into any github repo


--Jenkins----
1. Install Java 8
    - sudo yum install java-1.8.0
    - sudo yum remove java-1.7.0-openjdk

2. Install git and docker
    - sudo yum install git
    - sudo yum install docker

3. Install maven
    - wget  
    http://apache.mirrors.tds.net/maven/maven-3/3.5.3/binaries/apache-maven-3.5.3-bin.zip
    - unzip apache-maven-3.5.3-bin.zip
    - sudo cp apache-maven-3.5.3/bin/mvn /usr/bin
    - mvn --version

4. install jenkins
    - sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat/jenkins.repo
    - sudo rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key
    - sudo yum install -y jenkins
    - vi /etc/sysconfig/jenkins . - change JENKINS_PORT="3535" (I have not 
    done it, Jenkins is running on 8080)

5. In EC2 security group that can be found out in the description section     
    below in EC2 console, add following inbound rules:
    Type : Http , port:80, source:anywhere (This is for web application)
    Type : ssh , port:22, source:anywhere (This is for ssh, it might be there)
    Type : custom tcp , port:8080, source:anywhere (This is for jenkins)

6. start jenkins server
    - sudo service jenkins status
    - sudo service jenkins start
    - sudo service jenkins stop

7. start docker
    - sudo service docker start

8. give jenkins user privilege to run commands
    - sudo usermod -a -G docker ec2-user
    - sudo usermod -a -G docker jenkins

9. Jenkins Job details
    Pipeline details is present in Jenkinsfile in github project
    How to create Job details I will add