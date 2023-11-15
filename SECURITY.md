# Security

Highsoft takes security seriously. If you believe you have found a security vulnerability in Highcharts, Highcharts Gantt, Highcharts Stock, or Highcharts Maps, we encourage you to report it to us as described below. We will investigate all legitimate reports and do our best to quickly fix the problem. Before reporting, please read the Secure Usage section below.

## Reporting Security Issues

Issues should be reported to security@highsoft.com.

You should receive a response within 48 hours on business days. If you have not gotten any response by that time, please follow up to ensure we’ve received your original message.

Please include the information listed below (when applicable and possible) to help us identify and understand the scope of the issue:

  * What kind of issue is it (e.g. XSS injection)?
  * Which modules/source files are impacted?
  * Step-by-step instructions on how to reproduce the issue
  * Proof-of-concept or exploit code
  * Issue impact

## Secure Usage

The Highcharts product family is a set of client-side visualization libraries. As such, much is left to the implementer and the specific implementation, similarly to when using other web-libraries or frameworks. Correct usage is a prerequisite for ensuring secure operations of our products.

  * Best practice is to always [perform sanitation on data](https://www.highcharts.com/docs/chart-concepts/security) added to the configuration that originates from user input, either directly (e.g. a user can impact the chart title in real-time), or indirectly (e.g. the chart title is fetched from a database, and was originally entered by a user in a form). Sanitation should happen in multiple stages to avoid single points of failure.
  * The chart configurations have optional event hooks and other functions that can be attached to the chart (such as for custom formatters) - these are not validated, as it would not be feasible to retain the functionality they offer while also making sure the code contained in custom functions were not malicious. As such, extra care should be taken in terms of sanitation and validation when utilizing function hooks in the configuration, especially if the functions do something with user supplied data in order to avoid potential XSS attack vectors.

## Process

We utilize GitHubs workflow for managing security vulnerabilities. This means that GitHub Security Advisories are used to privately discuss, fix, and publish information about security vulnerabilities in our various repositories.

## Bounties

We do not have a bounty system for bugs or security issues for the time being.

## Contact

Our security main point-of-contact is security@highsoft.com. 

