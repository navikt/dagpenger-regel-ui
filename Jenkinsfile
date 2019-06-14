pipeline {
  agent any
  environment {
    DEPLOYMENT = readYaml(file: './nais/base/kustomization.yaml')
    APPLICATION_NAME = "${DEPLOYMENT.commonLabels.app}"
    ZONE = "${DEPLOYMENT.commonAnnotations.zone}"
    VERSION = sh(label: 'Get git sha1 as version', script: 'git rev-parse --short HEAD', returnStdout: true).trim()
  }

  stages {
    stage('Build') {
      // Create tested artifacts that can be used for later stages
      environment {
        DOCKER_REPO = 'repo.adeo.no:5443'
        DOCKER_IMAGE_VERSION = '${DOCKER_REPO}/${APPLICATION_NAME}:${VERSION}'
      }

      steps {
        sh label: 'Install dependencies', script: """
          npm install
        """

        sh label: 'Build artifact', script: """
          npm run build
          cp ~/.npmrc .npmrc
        """

        withDockerRegistry(
          credentialsId: 'repo.adeo.no',
          url: "https://${DOCKER_REPO}"
        ) {
          sh label: 'Build and push Docker image', script: """
            docker build  --build-arg http_proxy=http://webproxy-internett.nav.no:8088 --build-arg https_proxy=http://webproxy-internett.nav.no:8088 . --pull -t ${DOCKER_IMAGE_VERSION}
            docker push ${DOCKER_IMAGE_VERSION} || true
          """
        }

        sh label: 'Set image version on base overlay', script: """
          sed -i 's/latest/${VERSION}/' ./nais/base/nais.yaml
        """
        sh label: 'Prepare dev service contract', script: """
           kustomize build ./nais/dev -o ./nais/nais-dev-deploy.yaml &&  cat ./nais/nais-dev-deploy.yaml
        """
        sh label: 'Prepare prod service contract', script: """
           kustomize build ./nais/prod -o ./nais/nais-prod-deploy.yaml &&  cat ./nais/nais-prod-deploy.yaml
        """
      }


    }

    stage('Acceptance testing') {
      stages {
        stage('Deploy to pre-production') {
          when { branch 'master' }
          steps {
            sh label: 'Deploy with kubectl', script: """
              kubectl config use-context dev-${env.ZONE}
              kubectl apply -f ./nais/nais-dev-deploy.yaml --wait
              kubectl rollout status -w deployment/${APPLICATION_NAME}
            """

            archiveArtifacts artifacts: 'nais/nais-dev-deploy.yaml', fingerprint: true
          }
        }

        stage('Run tests') {
          // Since these tests usually are quite expensive, running them as
          // separate stages allows distributing them on seperate agents
          failFast true

          parallel {
            stage('User Acceptance Tests') {
              agent any

              when {
                beforeAgent true
                expression {
                  sh(
                    label: 'Does the repository define any UAT tests?',
                    script: 'test -f ./scripts/test/uat',
                    returnStatus: true
                  ) == 0
                }
              }

              steps {
                sh label: 'User Acceptance Tests', script: """
                  ./scripts/test/uat || true
                """
              }
            }

            stage('Integration Tests') {
              agent any

              when {
                beforeAgent true
                expression {
                  sh(
                    label: 'Does the repository define any integration tests?',
                    script: 'test -f ./scripts/test/integration',
                    returnStatus: true
                  ) == 0
                }
              }

              steps {
                sh label: 'Integration Tests', script: """
                  ./scripts/test/integration || true
                """
              }
            }

            stage('Benchmark Tests') {
              agent any

              when {
                beforeAgent true
                expression {
                  sh(
                    label: 'Does the repository define any benchmark tests?',
                    script: 'test -f ./scripts/test/benchmark',
                    returnStatus: true
                  ) == 0
                }
              }

              steps {
                sh label: 'Run benchmark', script: """
                  ./scripts/test/benchmark || true
                """
              }
            }
          }
        }
      }
    }

    stage('Deploy') {
      when { branch 'master' }

      steps {
        sh label: 'Deploy with kubectl', script: """
          kubectl config use-context prod-${env.ZONE}
          kubectl apply  -f ./nais/nais-prod-deploy.yaml --wait
          kubectl rollout status -w deployment/${APPLICATION_NAME}
        """

        archiveArtifacts artifacts: 'nais/nais-prod-deploy.yaml', fingerprint: true

      }
    }

    stage('Release') {
      when { branch 'master' }

      steps {
        sh "echo true"
      }
    }
  }
}
