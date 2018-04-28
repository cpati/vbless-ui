pipeline {
    agent any
    
    parameters {
        string(name: 'app', defaultValue: 'vblessimg/vbless-ui', description: 'vbless ui docker image')
    }

    stages {
        stage('Build') {
            steps {
            		sh '''
                    docker login --username=$dockeruserid --password=$dockeruserpw
                 docker build -t vbless-ui .
                 docker tag vbless-ui chidanandapati/vbless-ui;
                 docker push chidanandapati/vbless-ui;
                 '''
            }
        }
        stage('Test') {
            steps {
                sh '''
                echo "testing successful";
                echo $dockeruserid
                echo $app
                '''
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                export KUBERNETES_MASTER=ec2-34-209-195-209.us-west-2.compute.amazonaws.com:8080
                kubectl apply -f ui-deployment.yaml
                kubectl apply -f ui-service.yaml
                '''
            }
        }
    }
}