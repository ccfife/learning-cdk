#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { LearningGitStack } from '../lib/learning_git-stack';

const app = new cdk.App();
new LearningGitStack(app, 'LearningGitStack');
