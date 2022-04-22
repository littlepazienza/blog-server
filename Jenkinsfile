pipeline {
  agent none
  stages {
    stage('checkout') {
      steps {
        sh "rustup default nightly"
        sh "cargo test"
        sh "cargo build"
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
        '''
      }
    }
  }
}
