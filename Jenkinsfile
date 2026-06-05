pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/imedazouzi/hrm-pulse.git'
            }
        }

        stage('Test') {
            steps {
                echo 'Jenkins OK - pipeline working'
            }
        }
    }
}
