pipeline {
    agent any
    
    parameters {
        string(name: 'app', defaultValue: 'vblessimg/vbless-ui', description: 'vbless ui docker image')
    }

    stages {
        stage('Build') {
            steps {
            		sh '''
                 docker build -t vbless-ui .
                 docker tag vbless-ui chidanandapati/vbless-ui;
                 docker push chidanandapati/vbless-ui;
                 '''
            }
        }
        stage('Test') {
            steps {
                sh '''
                mvn test;   
                echo "testing successful";
                '''
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                pwd
                '''
            }
        }
    }
}