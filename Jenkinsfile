pipeline {
  agent any

  environment {
    APPLICATION_NAME = 'dagpenger-regel-ui'
    ZONE = 'fss'
    NAMESPACE = 'default'
    VERSION = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
  }

  stages {
    stage('Install dependencies') {
      steps {
        sh "npm install"
        sh "cp ~/.npmrc .npmrc"
      }
    }

    stage('Build') {
      steps {
        sh "docker build . --build-arg NODE_ENV=production --pull -t repo.adeo.no:5443/dagpenger-regel-ui:${VERSION}"
      }
    }

    stage('Publish') {
      steps {
        /*timeout(10) {
                input 'Keep going?'
        }*/

        withCredentials([usernamePassword(
          credentialsId: 'repo.adeo.no',
          usernameVariable: 'REPO_USERNAME',
          passwordVariable: 'REPO_PASSWORD'
        )]) {
            sh "docker login -u ${REPO_USERNAME} -p ${REPO_PASSWORD} repo.adeo.no:5443"
        }

        script {
           sh "docker push repo.adeo.no:5443/dagpenger-regel-ui:${VERSION}"
        }
      }
    }

    stage("Publish service contract") {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'repo.adeo.no',
          usernameVariable: 'REPO_USERNAME',
          passwordVariable: 'REPO_PASSWORD'
        )]) {
          sh "curl -vvv --user ${REPO_USERNAME}:${REPO_PASSWORD} --upload-file nais.yaml https://repo.adeo.no/repository/raw/nais/${APPLICATION_NAME}/${VERSION}/nais.yaml"
        }
      }
    }

    stage('Deploy to non-production') {
      steps {
        script {
          response = naisDeploy.createNaisAutodeployment(env.APPLICATION_NAME, env.VERSION,"t0",env.ZONE ,env.NAMESPACE, "")
        }
      }
    }

    stage('Deploy to production') {
      steps {
        script {
          response = naisDeploy.createNaisAutodeployment(env.APPLICATION_NAME, env.VERSION,"p", env.ZONE ,env.NAMESPACE, "")
        }
      }
    }
  }
}
