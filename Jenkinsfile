pipeline {
    agent any

    environment {
        // Tomcat location
        TOMCAT_HOME = 'C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1'

        // Frontend & Backend paths
        FRONTEND_DIR = 'E:\\Todo-List-Spring-Boot-Full-Stack-Project\\Frontend\\todo'
        BACKEND_DIR  = 'E:\\Todo-List-Spring-Boot-Full-Stack-Project\\ToDoList\\demo'

        // Tomcat deployment folders
        FRONTEND_DEPLOY = 'todolist-frontend'
        BACKEND_DEPLOY  = 'todolist-backend.war'
    }

    stages {

        // ===== FRONTEND BUILD ===== //
        stage('Build Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    echo "Updating Vite base path..."
                    // Update vite.config.js to set correct base path
                    bat '''
                    powershell -Command "(gc vite.config.js) -replace 'base: .*,', 'base: \\'/${env:FRONTEND_DEPLOY}/\\',' | Out-File vite.config.js -Encoding UTF8"
                    '''

                    echo "Installing frontend dependencies..."
                    bat 'if exist package-lock.json (npm ci) else (npm install)'

                    echo "Building frontend..."
                    bat 'npm run build'
                }
            }
        }

        // ===== FRONTEND DEPLOY ===== //
        stage('Deploy Frontend to Tomcat') {
            steps {
                bat """
                setlocal
                if exist "${TOMCAT_HOME}\\webapps\\${FRONTEND_DEPLOY}" (
                    rmdir /S /Q "${TOMCAT_HOME}\\webapps\\${FRONTEND_DEPLOY}"
                )
                mkdir "${TOMCAT_HOME}\\webapps\\${FRONTEND_DEPLOY}"
                xcopy /E /I /Y "${FRONTEND_DIR}\\dist\\*" "${TOMCAT_HOME}\\webapps\\${FRONTEND_DEPLOY}"
                endlocal
                """
            }
        }

        // ===== BACKEND BUILD ===== //
        stage('Build Backend') {
            steps {
                dir(BACKEND_DIR) {
                    bat 'mvn -B clean package'
                }
            }
        }

        // ===== BACKEND DEPLOY ===== //
        stage('Deploy Backend to Tomcat') {
            steps {
                bat """
                setlocal
                if exist "${TOMCAT_HOME}\\webapps\\${BACKEND_DEPLOY}" (
                    del /Q "${TOMCAT_HOME}\\webapps\\${BACKEND_DEPLOY}"
                )
                for %%F in (${BACKEND_DIR}\\*.war) do (
                    copy "%%F" "${TOMCAT_HOME}\\webapps\\${BACKEND_DEPLOY}"
                )
                endlocal
                """
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful! Access frontend at: http://localhost:8080/${FRONTEND_DEPLOY}/'
        }
        failure {
            echo 'Pipeline Failed.'
        }
    }
}
