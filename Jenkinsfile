pipeline {
    agent any

    environment {
        PROJECT_DIR = '/srv/workspace/iot-molding/fe-iot-molding'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout code from repository
                dir(env.PROJECT_DIR) {
                    echo "Checkout code from repository"
                    checkout scm
                }
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    // Get env file from credentials copy to project directory
                    dir(env.PROJECT_DIR) {
                        withCredentials([file(credentialsId: 'iot-molding-fe-env', variable: 'ENV_CONTENT')]) {
                            sh 'cp $ENV_CONTENT .env'
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Build and run container service
                    dir(env.PROJECT_DIR) {
                        echo 'Building and running container service...'
                        sh "docker compose up -d --build"
                    }
                }
            }
        }

        stage('Cleanup') {
            steps {
                dir(env.PROJECT_DIR) {
                    script {
                        // Remove dangling images
                        echo 'Removing dangling images...'
                        sh 'docker image prune -f || true'
                        echo 'Dangling images cleanup complete...'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment success!'
        }
        failure {
            echo 'Deployment failed. Please check logs.'
        }
    }
}
