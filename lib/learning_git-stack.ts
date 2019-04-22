import cdk = require('@aws-cdk/cdk');
import s3 = require('@aws-cdk/aws-s3');

export class LearningGitStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const bucket = new s3.Bucket(this,'bucket',{
      encryption: s3.BucketEncryption.Kms
    });

    bucket.grantPublicAccess();
    bucket.addLifecycleRule({abortIncompleteMultipartUploadAfterDays: 1});

       //to access low-level cfn resources
       const bucketResource = bucket.node.findChild('Resource') as s3.CfnBucket;
       bucketResource.options.metadata = {createdByHighLevelAbsraction: 'False'};

      //use addPropertyOverride method to configure resource properties not exposed in the L2 layer
      bucketResource.addPropertyOverride('corsConfiguration', {corsRules:
      [
        {
          allowedMethods: ['GET'],
          allowedOrigins: ['*']
        }
      ]
    }
    );
  }
}
