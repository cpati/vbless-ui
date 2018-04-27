pipeline {
    agent any
    
    parameters {
        string(name: 'app', defaultValue: 'vblessimg/vbless-ui', description: 'vbless ui docker image')
    }

    stages {
        stage('Build') {
            steps {
            		sh '''
                    mvn test;
                    export PATH=$PATH:$MVN_HOME:$GF_HOME:~/Documents/Chida/Mobile\ Development/ant/bin/:/Users/chidanandapati/Library/Group\ Containers/group.com.docker/bin/
                    echo "chida" $PATH
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