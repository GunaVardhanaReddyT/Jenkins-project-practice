pipeline {
    agent any

    environment {
        // Centralize Tomcat path for easier edits
        TOMCAT_HOME = 'C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1'
        FRONTEND_DIST = 'Frontend\\todo\\dist'
        BACKEND_WAR = 'ToDoList\\target'
        PROJECT_DIR = 'E:\\Todo-List-Spring-Boot-Full-Stack-Project'
    }

    stages {
        // ===== FRONTEND BUILD ===== //
        stage('Build Frontend') {
            steps {
                dir("${PROJECT_DIR}\\Frontend\\todo") {
                    // Use npm install if no lockfile exists
                    bat 'if exist package-lock.json (npm ci) else (npm install)'
                    bat 'npm run build'
                }
            }
        }

        // ===== FRONTEND DEPLOY ===== //
        stage('Deploy Frontend to Tomcat') {
            steps {
                bat """
                setlocal
                if exist "${TOMCAT_HOME}\\webapps\\todolist-frontend" (
                    rmdir /S /Q "${TOMCAT_HOME}\\webapps\\todolist-frontend"
                )
                mkdir "${TOMCAT_HOME}\\webapps\\todolist-frontend"
                xcopy /E /I /Y "${PROJECT_DIR}\\${FRONTEND_DIST}\\*" "${TOMCAT_HOME}\\webapps\\todolist-frontend"
                endlocal
                """
            }
        }

        // ===== BACKEND BUILD ===== //
        stage('Build Backend') {
            steps {
                dir("${PROJECT_DIR}\\ToDoList") {
                    bat 'mvn -B clean package'
                }
            }
        }

        // ===== BACKEND DEPLOY ===== //
        stage('Deploy Backend to Tomcat') {
            steps {
                bat """
                setlocal
                if exist "${TOMCAT_HOME}\\webapps\\todolist.war" (
                    del /Q "${TOMCAT_HOME}\\webapps\\todolist.war"
                )
                if exist "${TOMCAT_HOME}\\webapps\\todolist" (
                    rmdir /S /Q "${TOMCAT_HOME}\\webapps\\todolist"
                )
                for %%F in ("${PROJECT_DIR}\\${BACKEND_WAR}\\*.war") do (
                    copy "%%F" "${TOMCAT_HOME}\\webapps\\todolist.war"
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
