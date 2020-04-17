# The Investigative Dashboard project web app 🕵️

[![Translation status](https://hosted.weblate.org/widgets/occrp/-/investigative-dashboard/svg-badge.svg)](https://hosted.weblate.org/engage/occrp/?utm_source=widget)

[OCCRP](https://tech.occrp.org/projects/) research desk application front-end.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Docker and docker-compose](https://docs.docker.com/compose/install/)

## Installation

* `git clone <repository-url>` this repository
* `cd id-frontend`
* `docker-compose run ember npm install`

## Running / Development

* `./ember-serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `./ember help generate` for more
details.

### Running Tests

* `./ember test`
* `./ember test --server`

### Linting

* `docker-compose run ember npm run lint:hbs`
* `docker-compose run ember npm run lint:js`
* `docker-compose run ember npm run lint:js -- --fix`

### Building

* `./ember build` (development)
* `./ember build --environment production` (production)

### Deploying

Deployments are done using our CI/CD.

#### Translations

Translations are managed on [Weblate](https://hosted.weblate.org/projects/occrp/investigative-dashboard/).

To sync the translations add the git repository and rebase Weblate commits:

```
$ git remote add weblate https://hosted.weblate.org/git/occrp/investigative-dashboard/
$ git fetch -all
$ git rebase weblate/master
