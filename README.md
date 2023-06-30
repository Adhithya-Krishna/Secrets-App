# Secrets App

Welcome to Secrets App! This is a simple web application that allows users to anonymously share their secrets with the world. Users can submit their secrets, and other users can view and comment on them without knowing who posted them.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Start the Application](#start-the-application)
- [Contributing](#contributing)

## Introduction

The Secrets App provides a platform for users to express their thoughts and feelings without revealing their identities. It aims to create a space where people can share their secrets, receive support from the community, and engage in discussions without any judgment or fear of exposure.

## Features

- User Registration: Users can create new accounts to start sharing their secrets.
- Submit Secrets: Registered users can submit their secrets anonymously.
- Anonymous Viewing: Users can view secrets posted by others without knowing who posted them.
- Commenting: Users can comment on secrets and engage in discussions.
- User Authentication: Secure authentication system for user login and logout.
- MongoDB Integration: Secrets and user data are stored in a MongoDB database.

## Technologies

The Secrets App is built using the following technologies:

- Node.js: JavaScript runtime environment for server-side development.
- Express.js: Web application framework for Node.js.
- MongoDB: NoSQL database for storing user and secret data.
- Passport.js: Authentication middleware for Node.js.
- EJS: Templating engine for rendering dynamic web pages.
- HTML5 and CSS3: Markup and styling for the web application.

## Installation

1. Install the dependencies(shell):
    ```bash
    cd Secrets-App
    npm install
    ```

2. Set up the MongoDB database:
    - Install MongoDB if you haven't already. Visit the official MongoDB website for installation instructions.
    - Create a new MongoDB database.
    - Update the `config.js` file with your MongoDB connection details.

## Start the Application

Open your browser and visit [https://localhost:3000](https://localhost:3000) to access the Secrets-App.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to submit a pull request.

