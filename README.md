# Lambda Mediaconvert List Jobs

This Lambda function forwards AWS Mediaconvert's `listJobs` endpoint and
exposes only data relevant to a browser.

## Installation

Serverless uses AWS's Parameter store for secret environment variables. There's
one parameter that needs setting:

```bash
aws ssm put-parameter --name mediaconvertAccessPoint \
    --type String --value ommited
```

If you're having trouble setting the `mediaconvertAccessPoint` [consider adding
the following to your
`$HOME/.aws/config`](https://github.com/aws/aws-cli/issues/2507#issuecomment-421416600):

```bash
cli_follow_urlparam = false
```

Once you've set this and are logged into `awscli`, you can deploy by:

```bash
serverless deploy
```

## Limitations

- Only works for Jobs that have a single input.
