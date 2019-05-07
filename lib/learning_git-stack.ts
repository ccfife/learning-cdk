import cdk = require('@aws-cdk/cdk');
import s3 = require('@aws-cdk/aws-s3');
import s3deploy = require('@aws-cdk/aws-s3-deployment');

export class LearningGitStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
  const bucket = new s3.Bucket(this,'staticWebsite_v1',{
      //encryption: s3.BucketEncryption.KmsManaged,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'about-me.html'
    });

    //bucket.grantPublicAccess();

    new s3deploy.BucketDeployment(this, 'deployWebsite', {
      source: s3deploy.Source.asset('static_website/sonar-master'),
      destinationBucket: bucket,
      destinationKeyPrefix: 'web/static' 
    });
    
    //bucket.addLifecycleRule({abortIncompleteMultipartUploadAfterDays: 1});

       //to access low-level cfn resources
       //const bucketResource = bucket.node.findChild('Resource') as s3.CfnBucket;
       //bucketResource.options.metadata = {createdByHighLevelAbsraction: 'False'};

  }
}
