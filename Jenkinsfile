pipeline {
  agent any

  tools {
    nodejs 'NodeJs'
  }

  environment {
    BASE_URL = 'https://www.saucedemo.com'
    CI = 'true'
  }

  options {
    timestamps()
    timeout(time: 60, unit: 'MINUTES')
  }

  stages {
    stage('Install dependencies') {
      steps {
        bat 'npm ci'
      }
    }

    stage('Install browsers') {
      steps {
        bat 'npx playwright install --with-deps chromium firefox webkit'
      }
    }

    stage('Lint (type check)') {
      steps {
        bat 'npm run lint'
      }
    }

    stage('Run tests') {
      steps {
        bat 'npx playwright test'
      }
    }
  }

  post {
    always {
      junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
      archiveArtifacts artifacts: 'playwright-report/**,test-results/**', allowEmptyArchive: true, fingerprint: true
    }
  }
}
