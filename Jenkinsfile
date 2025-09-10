pipeline{
    agent {label 'build-agent'}
    environment {
        ECR_REGISTRY="361769563073.dkr.ecr.ap-south-1.amazonaws.com"
        ECR_REPOSITORY="crypto"
        IMAGE_TAG="v${BUILD_NUMBER}"
    }
    
    stages{
        stage(" OWASP Dependency Check"){
            steps{
                echo "Running OWASP Dependency Check...."
                dependencyCheck additionalArguments: '--scan . --format ALL --prettyPrint', odcInstallation: 'OWASP'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage("SonarQube Quality Gate Analysis"){
            steps{
                withSonarQubeEnv('MySonarQube'){
                    sh '''
                    /opt/sonar-scanner/bin/sonar-scanner \
                    -Dsonar.projectKey=crypto \
                    -Dsonar.projectName=crypto \
                    -Dsonar.sources=.
                    '''
                }
                timeout(time: 10, unit: 'MINUTES'){
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        stage(' Build Docker Image'){
            steps{
                script{
                    docker.build("${ECR_REPOSITORY}:${IMAGE_TAG}",".")
                }
            }
        }
        stage(' Scan Image with Trivy'){
            steps{
                sh 'trivy image ${ECR_REPOSITORY}:${IMAGE_TAG}'
            }
        }
        stage(' Push Image to ECR'){
            steps{
                script{
                    docker.withRegistry("https://${ECR_REGISTRY}", 'ecr:ap-south-1:aws-ecr-credentials') {
                        docker.image("${ECR_REPOSITORY}:${IMAGE_TAG}").push()
                    }
                }
            }
        }
        stage(' Deploy'){
            steps{
                script{
                    docker.withRegistry("https://${ECR_REGISTRY}", 'ecr:ap-south-1:aws-ecr-credentials'){
                        def fullImageName="${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}"
                    
                        sh """
                        docker pull ${fullImageName}
                        docker rm -f crypto || true
                        docker run -d --name crypto -p 5173:5173 ${fullImageName}
                        """
                    }
                    echo "Deploy Successfully"
                }
            }
        }
    }
    
    post{
        always{
            cleanWs()
        }
    }
}
