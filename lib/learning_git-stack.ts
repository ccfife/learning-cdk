import cdk = require('@aws-cdk/cdk');
import s3 = require('@aws-cdk/aws-s3');
import s3deploy = require('@aws-cdk/aws-s3-deployment');
import cloudfront = require('@aws-cdk/aws-cloudfront');
import iam = require('@aws-cdk/aws-iam');

export class LearningGitStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // s3 bucket with support for website hosting
  const bucket = new s3.Bucket(this,'staticWebsite_v1',{
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html'
    });

    new s3deploy.BucketDeployment(this, 'deployWebsite', {
      source: s3deploy.Source.asset('static_website/sonar-master'),
      destinationBucket: bucket,
      destinationKeyPrefix: 'web/static' 
    });
    
    //restrict access to S3 bucket to CloudFront
    // bucket.grantPublicAccess(); <- dont do this
    const origin = new cloudfront.CfnCloudFrontOriginAccessIdentity(this, 'BucketOrigin', {
      cloudFrontOriginAccessIdentityConfig: {
        comment: 'sonar master'
      }
    });

    bucket.grantRead(new iam.CanonicalUserPrincipal(
      origin.cloudFrontOriginAccessIdentityS3CanonicalUserId
    ));

    //create cloudfront distribution
    const cdn = new cloudfront.CloudFrontWebDistribution(this, 'cloudfront', {
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.AllowAll,
      priceClass: cloudfront.PriceClass.PriceClassAll,
      originConfigs: [
        {
          behaviors: [
            {
              isDefaultBehavior: true,
              maxTtlSeconds: undefined,
              allowedMethods:
                cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS
            }
          ],
          originPath: 'web/static',
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentityId: origin.cloudFrontOriginAccessIdentityId
          }
        }
      ]
    })

    //bucket.addLifecycleRule({abortIncompleteMultipartUploadAfterDays: 1});

       //to access low-level cfn resources
       //const bucketResource = bucket.node.findChild('Resource') as s3.CfnBucket;
       //bucketResource.options.metadata = {createdByHighLevelAbsraction: 'False'};

       //output cloudfront URL
        new cdk.CfnOutput(this, 'CloudFrontURL', {
          description: 'CDN URL',
          value: "https://" + cdn.domainName
        })
  }
}
