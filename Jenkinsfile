pipeline {
    agent any

    environment {
        TOMCAT_HOME = 'C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1'
        FRONTEND_DIR = 'E:\\Todo-List-Spring-Boot-Full-Stack-Project\\Frontend\\todo'
        BACKEND_DIR = 'E:\\Todo-List-Spring-Boot-Full-Stack-Project\\ToDoList\\demo'
        FRONTEND_DEPLOY = 'todolist-frontend'
        BACKEND_DEPLOY = 'todolist-backend.war'
    }

    stages {
        // ===== FRONTEND BUILD ===== //
        stage('Build Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    echo "Installing dependencies..."
                    bat """
                        if exist package-lock.json (
                            npm ci
                        ) else (
                            npm install
                        )
                    """
                    echo "Updating Vite base path..."
                    bat """
                        powershell -Command ^
                        "(Get-Content vite.config.js) -replace 'base: .*,', 'base: \\'/${env:FRONTEND_DEPLOY}/\\',' | Set-Content vite.config.js -Encoding UTF8"
                    """
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
                    echo "Building backend..."
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
            echo 'Deployment Successful!'
        }
        failure {
            echo 'Pipeline Failed.'
        }
    }
}
