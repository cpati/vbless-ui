pipeline {
    agent any
    
    parameters {
        string(name: 'app', defaultValue: 'vblessimg/vbless-ui', description: 'vbless ui docker image')
    }

    stages {
        stage('Build') {
            steps {
            		sh '''
                 /usr/local/bin/docker build -t vbless-ui .
                 /usr/local/bin/docker tag vbless-ui chidanandapati/vbless-ui;
                 /usr/local/bin/docker push chidanandapati/vbless-ui;
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