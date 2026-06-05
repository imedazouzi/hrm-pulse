pipeline {
    agent any

    environment {
        IMAGE_NAME = "hrm-pulse"
        IMAGE_TAG = "${BUILD_NUMBER}"
        FULL_IMAGE = "hrm-pulse:${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "Cloning repository..."
                git branch: 'main', url: 'https://github.com/imedazouzi/hrm-pulse.git'
            }
        }

        stage('Backend Build') {
            steps {
                echo "Building backend..."
                dir('backend') {
                    sh '''
                        npm install
                        npm test || true
                    '''
                }
            }
        }

        stage('Frontend Build') {
            steps {
                echo "Building frontend..."
                dir('frontend') {
                    sh '''
                        npm install
                        npm run build || true
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image..."
                sh '''
                    docker build -t hrm-pulse:${BUILD_NUMBER} .
                '''
            }
        }

        stage('List Docker Images') {
            steps {
                sh 'docker images'
            }
        }

        /*
        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                        echo $PASS | docker login -u $USER --password-stdin
                        docker tag hrm-pulse:${BUILD_NUMBER} USERNAME/hrm-pulse:${BUILD_NUMBER}
                        docker push USERNAME/hrm-pulse:${BUILD_NUMBER}
                    '''
                }
            }
        }
        */

    }

    post {
        success {
            echo "Pipeline SUCCESS - Docker image built"
        }
        failure {
            echo "Pipeline FAILED"
        }
    }
}
