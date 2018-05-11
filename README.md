Kubernetes and Jenkins set up in AWS EC2 - Amazon Linux<br />
-------------------------------------------------------<br />
--Kubernetes----<br />
1. Create an AWS EC2 instance with Amazon Linux<br />
2. Login to AWS console, the details can be obtained by clicking on connect button in AWS EC2 console<br />
3. Create Kubernetes Cluster:<br />
   a. Route53 - Required for kops setup:<br />
      #. Route53 register domain: themodestwhite.com<br />
   b. ssh-keygen<br />
   c. get kops tool:<br />
    curl -LO https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-linux-amd64<br />
    <br />
    chmod +x kops-linux-amd64<br />
    <br />
    sudo mv kops-linux-amd64 /usr/local/bin/kops<br />
   d. get kubectl<br />
    wget -O kubectl https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl<br />
    chmod +x ./kubectl<br />
    sudo mv ./kubectl /usr/local/bin/kubectl<br />
   e. create a Route53 hosted zone<br />
    aws route53 create-hosted-zone --name k8.themodestwhite.com --caller-reference 1<br />
   f. Create S3 bucket for storing cluster info:<br />
    aws s3 mb s3://clusters.k8.themodestwhite.com<br />
<br />
    export KOPS_STATE_STORE=s3://clusters.k8.themodestwhite.com<br />
   g. Create K8 Cluster:<br />
    kops create cluster --cloud=aws --zones=us-west-2b --name=c1.themodestwhite.com<br />
    kops update cluster c1.themodestwhite.com --yes<br />
    <br />
    It creates 1 EC2 master instance (Node) and 2 worker instances (Nodes) and autoscaling groups<br />
   f. kubectl proxy : This is required for Jenkins (not sure if there is a   <br />
      better way) if it does not return 8001 port , we need to update Jenkinsfile for vbless-server with the correct port<br />
   <br />
4. Re-starting kubernetes:<br />
    a. export KOPS_STATE_STORE=s3://clusters.k8.themodestwhite.com<br />
    b. kops update cluster c1.themodestwhite.com --yes<br />
        - It will recreate master and worker nodes<br />
    c. kubectl proxy<br />
         - kubectl proxy --port=8001<br />
<br />
5.  Stop Kubernetes Cluster:<br />
   a. Delete Auto scaling group in EC2 console<br />
   b. Stop first EC2 instance<br />
   c. Stop Master instance , this will automatically stop worker instances<br />
<br />
<br />
6. Some Kubernetes Commands:<br />
<br />
   a. deployments<br />
      -  kubectl get deployment<br />
      -  kubectl describe deployment <deployment name><br />
      -  kubectl delete deployment <deployment name><br />
   b. Pods:<br />
      - kubectl get pods<br />
      - kubectl describe pod <pod name><br />
      - kubectl delete pod <pod name>        <br />
   c. services:<br />
      - kubectl get service<br />
      - kubectl describe service <service name><br />
      - kubectl delete service <service name><br />
   d. Create artifacts (any kind) using yaml file:<br />
      - kubectl apply -f <yaml file name> <br />
<br />
7. In our project all artifacts are created using yaml file present in      <br />
   respective github repo, except secret data like mysql, aws credentials etc which is present in secret-data.yaml not checked in into any github repo<br />
<br />
<br />
--Jenkins----<br />
1. Install Java 8<br />
    - sudo yum install java-1.8.0<br />
    - sudo yum remove java-1.7.0-openjdk<br />
<br />
2. Install git and docker<br />
    - sudo yum install git<br />
    - sudo yum install docker<br />
<br />
3. Install maven<br />
    - wget  <br />
    http://apache.mirrors.tds.net/maven/maven-3/3.5.3/binaries/apache-maven-3.5.3-bin.zip<br />
    - unzip apache-maven-3.5.3-bin.zip<br />
    - sudo cp apache-maven-3.5.3/bin/mvn /usr/bin<br />
    - mvn --version<br />
<br />
4. install jenkins<br />
    - sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat/jenkins.repo<br />
    - sudo rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key<br />
    - sudo yum install -y jenkins<br />
    - vi /etc/sysconfig/jenkins . - change JENKINS_PORT="3535" (I have not <br />
    done it, Jenkins is running on 8080)<br />
<br />
5. In EC2 security group that can be found out in the description section     <br />
    below in EC2 console, add following inbound rules:<br />
    Type : Http , port:80, source:anywhere (This is for web application)<br />
    Type : ssh , port:22, source:anywhere (This is for ssh, it might be there)<br />
    Type : custom tcp , port:8080, source:anywhere (This is for jenkins)<br />
<br />
6. start jenkins server<br />
    - sudo service jenkins status<br />
    - sudo service jenkins start<br />
    - sudo service jenkins stop<br />
<br />
7. start docker<br />
    - sudo service docker start<br />
<br />
8. give jenkins user privilege to run commands<br />
    - sudo usermod -a -G docker ec2-user<br />
    - sudo usermod -a -G docker jenkins<br />
<br />
9. Jenkins Job details<br />
    Pipeline details is present in Jenkinsfile in github project<br />
    How to create Job details I will add<br />
