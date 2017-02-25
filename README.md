# foundador-cli
Found a startup instantly

- [Get started]()

## Getting started
Install the CLI globally using NPM

- `npm install -g foundador-cli`

Initialize a new foundador project

- `foundador init`

After the project is initalized all commands are assumed to be running in the base directory created by the init command.

### Backend
Designed to use [AWS API Gateway](https://aws.amazon.com/api-gateway/) and [AWS Lambda](https://aws.amazon.com/lambda/details/). A very simplistic alternative to the

The following commands are available:

#### Test
Test a lambda function

- `foundador backend test <functionPath> [eventData...]`

  **<functionPath>**  api/get
  **[eventData..]**  event=Data

### Mobile
A vanilla mobile application build on React-Native and Redux.

#### Test iOS
To test iOS this documentation assumes you are running on a Mac with OSX with the latest xcode installed.
- `foundador mobile run-ios`

#### Test Android
To test the Android you will need to have the [Android SDK / Android Studio](https://developer.android.com/studio/index.html) installed and a valid [AVD setup](https://developer.android.com/studio/run/managing-avds.html).
- `foundador mobile run-android`

### Web
A vanilla web application built on React and Redux. Comes with a directory structure and basic homepage component.

#### Start development server
This will start a webpack-dev-server on port 8040. The port can be changed by editing the **npm start** script command in *package.json*.
- `foundador web dev`
