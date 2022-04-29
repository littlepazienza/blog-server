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
    stage('package') {
      steps {
        sh 'zip -r blog-server.zip *.toml src README.md'
        archiveArtifacts artifacts: '*.zip,**/*.html',
                   allowEmptyArchive: false,
                   fingerprint: true,
                   onlyIfSuccessful: true
      }
    }
  }
}
