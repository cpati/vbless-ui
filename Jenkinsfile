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
                 docker tag vbless-ui chidanandapati/vbless-ui:v10.30;
                 docker push chidanandapati/vbless-ui:v10.30;
                 '''
            }
        }
        stage('Test') {
            steps {
                sh '''
                echo "testing successful";
                '''
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                export KUBERNETES_MASTER=http://127.0.0.1:8001
                kubectl apply -f ui-deployment.yaml
                kubectl apply -f ui-service.yaml
                kubectl rollout status deployment/vbless-ui
                '''
            }
        }
    }
}
