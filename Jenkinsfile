pipeline {
  agent any
  stages {
    stage('build') {
      agent {
          docker {
              image 'rust:latest'
          }
      }
      steps {
        sh "rustup default nightly"
        sh "cargo test"
        sh "cargo build"
      }
    }
    stage('tag') {
      steps {
        sh '''
          if [ $GIT_BRANCH = "main" ]; then
            git pull --tags
            version=$(git describe --tags)
            sed -e 's/<!--build_number-->/${version}/g' $WORKSPACE/www/index.html
          fi
          zip -r blog-server.zip *.toml src README.md
        '''
      }
    }
    stage('package') {
      steps {
        archiveArtifacts artifacts: '*.zip,**/*.html',
                   allowEmptyArchive: false,
                   fingerprint: true,
                   onlyIfSuccessful: true
      }
    }
  }
}
