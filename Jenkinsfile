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
        sh "rustup toolchain install nightly-2022-04-18"
        sh "rustup run nightly-2022-04-18 cargo -V"
        sh "rustup run nightly-2022-04-18 cargo test"
        sh "rustup run nightly-2022-04-18 cargo build"
      }
    }
    stage('package') {
      steps {
        sh 'tar -czvf blog-server.tar.gz *.toml src README.md'
        archiveArtifacts artifacts: '*.tar.gz,**/*.html',
                   allowEmptyArchive: false,
                   fingerprint: true,
                   onlyIfSuccessful: true
      }
    }
  }
}
