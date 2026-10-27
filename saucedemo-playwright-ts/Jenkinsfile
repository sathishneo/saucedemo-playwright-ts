// Jenkins declarative pipeline. Works on Windows agents (bat) and Linux agents (sh).
def run(String command) {
  if (isUnix()) {
    sh command
  } else {
    bat command
  }
}

pipeline {
  agent any

  tools {
    nodejs 'NodeJS-20' // Must match the name in Manage Jenkins > Tools
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
        run('npm ci')
      }
    }

    stage('Install browsers') {
      steps {
        run('npx playwright install --with-deps chromium firefox webkit')
      }
    }

    stage('Lint (type check)') {
      steps {
        run('npm run lint')
      }
    }

    stage('Run tests') {
      steps {
        run('npx playwright test')
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
