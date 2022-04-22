pipeline {
  agent any
  stages {
    stage('checkout') {
      agent {
          docker {
              image 'rust:latest'
              args '--entrypoint="rustup default nightly && cargo build"'
          }
      }
      steps {

      }
    }
    stage('deploy') {
      steps {
        sh '''
          if [ $GIT_BRANCH = "main" ]; then
            git pull --tags
            version=$(git describe)
            sed -i '' -e "s/<!--build_number-->/${version}/g" $WORKSPACE/www/index.html
            cp -r $WORKSPACE/www/* /var/www/html/manage.blog.ienza.tech/
          fi
          zip -r blog-server-$version.zip *.toml src README.md
        '''
        archiveArtifacts artifacts: '*.zip',
                   allowEmptyArchive: false,
                   fingerprint: true,
                   onlyIfSuccessful: true
      }
    }
  }
}
