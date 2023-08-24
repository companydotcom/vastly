import type { AWS } from "@serverless/typescript";
import { functions } from "./../deploy/functions/index";

const serverlessConfiguration: AWS = {
  service: "deploy",
  frameworkVersion: "3.34.0",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    stage: "prod",
    region: "us-east-1",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    deploymentMethod: "direct",
    apiGateway: {
      restApiId: {
        "Fn::ImportValue": "ApiRestId",
      },
      restApiRootResourceId: {
        "Fn::ImportValue": "ApiRootResourceId",
      },
      websocketApiId: {
        "Fn::ImportValue": "ApiWsId",
      },
    },
  },
  functions: { ...functions },
  package: { individually: true },
  custom: {
    domain: "api.vastly.is",
    "serverless-offline": {
      httpPort: 4000,
      useChildProcesses: true,
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    sharedAuthorizer: {
      "Fn::ImportValue": "SharedAuthorizerArn",
    },
  },
  resources: {
    Resources: {
      deployAssumeRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "DeployAssumeRole",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: ["lambda.amazonaws.com", "apigateway.amazonaws.com"],
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
          Policies: [
            {
              PolicyName: "DeploymentPolicy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  //  Permissions to deploy the bootstrap stack once for each AWS account
                  {
                    Sid: "AllowCDKManageToolkitStack",
                    Effect: "Allow",
                    Action: [
                      "cloudformation:CreateChangeSet",
                      "cloudformation:DeleteChangeSet",
                      "cloudformation:DeleteStack",
                      "cloudformation:DescribeChangeSet",
                      "cloudformation:DescribeStacks",
                      "cloudformation:DescribeStackEvents",
                      "cloudformation:ExecuteChangeSet",
                      "cloudformation:GetTemplate",
                    ],
                    Resource: ["arn:aws:cloudformation:us-east-1:112233445566:stack/CDKToolkit/*"],
                  },
                  // Permissions to create the CDK bootstrap roles
                  {
                    Sid: "AllowCDKManageToolkitRoles",
                    Effect: "Allow",
                    Action: [
                      "iam:AttachRolePolicy",
                      "iam:CreateRole",
                      "iam:DeleteRole",
                      "iam:DeleteRolePolicy",
                      "iam:DetachRolePolicy",
                      "iam:GetRole",
                      "iam:GetRolePolicy",
                      "iam:PutRolePolicy",
                      "iam:TagRole",
                    ],
                    Resource: [
                      "arn:aws:iam::112233445566:role/cdk-hnb659fds-cfn-exec-role-*",
                      "arn:aws:iam::112233445566:role/cdk-hnb659fds-file-publishing-role-*",
                      "arn:aws:iam::112233445566:role/cdk-hnb659fds-image-publishing-role-*",
                      "arn:aws:iam::112233445566:role/cdk-hnb659fds-lookup-role-*",
                      "arn:aws:iam::112233445566:role/cdk-hnb659fds-deploy-role-*",
                    ],
                  },
                  // Permissions to create the CDK bootstrap bucket
                  {
                    Sid: "AllowCDKManageToolkitBucket",
                    Effect: "Allow",
                    Action: [
                      "s3:CreateBucket",
                      "s3:DeleteBucketPolicy",
                      "s3:GetEncryptionConfiguration",
                      "s3:GetBucketPolicy",
                      "s3:PutBucketPolicy",
                      "s3:PutBucketVersioning",
                      "s3:PutEncryptionConfiguration",
                      "s3:PutLifecycleConfiguration",
                      "s3:PutBucketPublicAccessBlock",
                    ],
                    Resource: ["arn:aws:s3:::cdk-hnb659fds-assets-*"],
                  },
                  // Permissions to create CDK bootstrap ECR repository
                  {
                    Sid: "AllowCDKManageToolkitRepository",
                    Effect: "Allow",
                    Action: [
                      "ecr:CreateRepository",
                      "ecr:DeleteRepository",
                      "ecr:DescribeRepositories",
                      "ecr:PutLifecyclePolicy",
                      "ecr:SetRepositoryPolicy",
                    ],
                    Resource: [
                      "arn:aws:ecr:us-east-1:112233445566:repository/cdk-hnb659fds-container-assets-*",
                    ],
                  },
                  // Permissions to create CDK bootstrap version SSM parameter -- stores version of the deployed CDK bootstrap stack, checks if it has been bootstrapped
                  {
                    Sid: "AllowCDKManageToolkitVersionParameter",
                    Effect: "Allow",
                    Action: [
                      "ssm:DeleteParameter",
                      "ssm:GetParameters",
                      "ssm:PutParameter",
                      "ssm:GetParameter",
                    ],
                    Resource: [
                      "arn:aws:ssm:us-east-1:112233445566:parameter/cdk-bootstrap/hnb659fds/version",
                    ],
                  },
                  // Permissions for SST to monitor the bootstrap progress.
                  {
                    Sid: "AllowSSTManageBootstrapStack",
                    Effect: "Allow",
                    Action: ["cloudformation:DescribeStacks", "cloudformation:DescribeStackEvents"],
                    Resource: [
                      "arn:aws:cloudformation:us-east-1:112233445566:stack/SSTBootstrap/*",
                    ],
                  },
                  // Permissions for SST to assume CDK roles to deploy your application to AWS
                  {
                    Sid: "AllowSSTAssumeCDKToolkitRoles",
                    Effect: "Allow",
                    Action: "sts:AssumeRole",
                    Resource: [
                      "arn:aws:iam::112233445566:role/cdk-hnb659fds-cfn-exec-role-*",
                      "arn:aws:iam::112233445566:role/cdk-hnb659fds-file-publishing-role-*",
                      "arn:aws:iam::112233445566:role/cdk-hnb659fds-image-publishing-role-*",
                      "arn:aws:iam::112233445566:role/cdk-hnb659fds-lookup-role-*",
                      "arn:aws:iam::112233445566:role/cdk-hnb659fds-deploy-role-*",
                    ],
                  },
                  // Permissions for SST to monitor the deployment progress of your application
                  {
                    Sid: "AllowSSTMonitorStackDeployment",
                    Effect: "Allow",
                    Action: [
                      "cloudformation:DeleteStack",
                      "cloudformation:DescribeStacks",
                      "cloudformation:DescribeStackEvents",
                      "cloudformation:DescribeStackResources",
                      "cloudformation:GetTemplate",
                    ],
                    Resource: ["arn:aws:cloudformation:us-east-1:112233445566:stack/*"],
                  },
                  // Permissions for SST to store metadata about your application
                  {
                    Sid: "AllowSSTManageBootstrapBucket",
                    Effect: "Allow",
                    Action: ["s3:DeleteObject", "s3:GetObject", "s3:ListBucket", "s3:PutObject"],
                    Resource: ["arn:aws:s3:::sstbootstrap-*"],
                  },
                  // Permissions for SST to connect to IoT endpoint for Live Lambda development
                  {
                    Sid: "AllowSSTLiveLambdaSocketConnection",
                    Effect: "Allow",
                    Action: [
                      "iot:DescribeEndpoint",
                      "iot:Connect",
                      "iot:Subscribe",
                      "iot:Publish",
                      "iot:Receive",
                    ],
                    Resource: ["*"],
                  },
                  // If you are using the RDS construct, to let SST Console to run migrations, you need the following permission
                  {
                    Sid: "AllowSSTCLIManageRDSMigrations",
                    Effect: "Allow",
                    Action: ["rds-data:ExecuteStatement"],
                    Resource: ["arn:aws:rds:us-east-1:112233445566:cluster:*"],
                    Condition: {
                      Null: {
                        "aws:ResourceTag/sst:app": "false",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      // SharedAuthorizer: {
      //   Type: "AWS::ApiGateway::Authorizer",
      //   Properties: {
      //     Name: "auth",
      //   },
      // },
    },
    Outputs: {
      DeployAssumeRoleOutput: {
        Value: { Ref: "deployAssumeRole" },
        Export: { Name: "DeployAssumeRoleArn-${self:provider.stage}" },
      },
    },
  },
};

module.exports = serverlessConfiguration;
