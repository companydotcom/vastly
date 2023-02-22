/* eslint-disable no-template-curly-in-string */
const iamSqsResources = {
  bulkFetch: `
        - "arn:aws:sqs:\${self:custom.region}:\${self:custom.config.accountId}:\${self:custom.config.service}-bulkfq"`,
  bulkTransition: `
        - "arn:aws:sqs:\${self:custom.region}:\${self:custom.config.accountId}:\${self:custom.config.service}-bulktq"`,
  webhook: `
        - "arn:aws:sqs:\${self:custom.region}:\${self:custom.config.accountId}:\${self:custom.config.service}-webhook"`,
}

const functionConfigs = {
  bulkFetch: `
  bulkFetch:
    environment:
      stage: \${self:custom.stage}
    handler: handler.bulkFetchHandler
    events:
      - schedule: rate(5 minutes)`,
  bulkTransition: `
  bulkTransition:
    environment:
      stage: \${self:custom.stage}
    handler: handler.bulkTransitionHandler
    events:
      - schedule: rate(5 minutes)`,
  webhook: `
  webhook:
    environment:
      stage: \${self:custom.stage}
    handler: handler.webhookHandler
    events:
      - sqs:
          arn: "arn:aws:sqs:\${self:custom.region}:\${self:custom.region}:\${self:custom.config.service}-webhook"
          enabled: true
          batchSize: 1`,
}

const resourceQueueConfigs = {
  bulkFetch: `
    bulkFQCreate:
      Type: "AWS::SQS::Queue"
      Properties:
        DelaySeconds: 0
        MaximumMessageSize: 262144
        MessageRetentionPeriod: 345600
        QueueName: "\${self:custom.config.service}-bulkfq"
        ReceiveMessageWaitTimeSeconds: 0
        VisibilityTimeout: 900
        RedrivePolicy:
          deadLetterTargetArn:
            Fn::GetAtt:
              - "dlqCreate"
              - "Arn"
          maxReceiveCount: 2`,
  bulkTransition: `
    bulkTQCreate:
      Type: "AWS::SQS::Queue"
      Properties:
        DelaySeconds: 0
        MaximumMessageSize: 262144
        MessageRetentionPeriod: 345600
        QueueName: "\${self:custom.config.service}-bulktq"
        ReceiveMessageWaitTimeSeconds: 0
        VisibilityTimeout: 900
        RedrivePolicy:
          deadLetterTargetArn:
            Fn::GetAtt:
              - "dlqCreate"
              - "Arn"
          maxReceiveCount: 10`,
  webhook: `
    webhookQCreate:
      Type: "AWS::SQS::Queue"
      Properties:
        DelaySeconds: 0
        MaximumMessageSize: 262144
        MessageRetentionPeriod: 345600
        QueueName: "\${self:custom.config.service}-webhook"
        ReceiveMessageWaitTimeSeconds: 0
        VisibilityTimeout: 900
        RedrivePolicy:
          deadLetterTargetArn:
            Fn::GetAtt:
              - "dlqCreate"
              - "Arn"
          maxReceiveCount: 3`,
}

const resourceSubscriptionConfigs = {
  bulkFetch: `
    subscribeFBQSToTriggerSns:
      Type: "AWS::SNS::Subscription"
      Properties:
        TopicArn: "arn:aws:sns:\${self:custom.region}:\${self:custom.region}:event-bus"
        Endpoint: "arn:aws:sqs:\${self:custom.region}:\${self:custom.region}:\${self:custom.config.service}-bulkfq"
        Protocol: sqs
        FilterPolicy:
          status:
            - "trigger"
          entityId:
            - \${self:custom.config.productId}
          eventType:
            - "fetch"
          requestQuantity:
            - "bulk"`,
  bulkTransition: `
    subscribeTBQSToTriggerSns:
      Type: "AWS::SNS::Subscription"
      Properties:
        TopicArn: "arn:aws:sns:\${self:custom.region}:\${self:custom.region}:event-bus"
        Endpoint: "arn:aws:sqs:\${self:custom.region}:\${self:custom.region}:\${self:custom.config.service}-bulktq"
        Protocol: sqs
        FilterPolicy:
          status:
            - "trigger"
          entityId:
            - \${self:custom.config.productId}
          eventType:
            - "transition"
          requestQuantity:
            - "bulk"`,
  webhook: `
    subscribeWebhookToTriggerSns:
      Type: "AWS::SNS::Subscription"
      Properties:
        TopicArn: "arn:aws:sns:\${self:custom.region}:\${self:custom.region}:event-bus"
        Endpoint: "arn:aws:sqs:\${self:custom.region}:\${self:custom.region}:\${self:custom.config.service}-webhook"
        Protocol: sqs
        FilterPolicy:
          status:
            - "trigger"
          entityId:
            - \${self:custom.config.productId}
          eventType:
            - "webhook"
          requestQuantity:
            - "single"
            - "exists": false`,
}

const queueRefPolicyConfigs = {
  bulkFetch: `
          - Ref: bulkFQCreate`,
  bulkTransition: `
          - Ref: bulkTQCreate`,
  webhook: `
          - Ref: webhookQCreate`,
}

module.exports = {
  iamSqsResources,
  functionConfigs,
  resourceQueueConfigs,
  resourceSubscriptionConfigs,
  queueRefPolicyConfigs,
}
