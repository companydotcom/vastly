# NOTE: update this with your service name
service: deploy-service

# Create an optimized package for our functions 
package:
  individually: true

plugins:
  - serverless-bundle # Package our functions with Webpack
  - serverless-offline
  - serverless-dotenv-plugin # Load .env as environment variables

provider:
  name: aws
  runtime: nodejs12.x
  stage: dev
  region: us-east-1
  # To load environment variables externally
  # rename env.example to .env and uncomment
  # the following line. Also, make sure to not
  # commit your .env.
  #
  #environment:
  #  SAMPLE_ENV_VAR: ${env:SAMPLE_ENV_VAR}

functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: hello
          method: get
