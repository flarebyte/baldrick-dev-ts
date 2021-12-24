# Maintenance of the code

## Overall workflow

The typical developer workflow goes as follow:

| Mode                   | Code analysis | Testing                    | Building          | Publishing          |
| ---------------------- | ------------- | -------------------------- | ----------------- | ------------------- |
| Checking               | yarn lint     | yarn test or yarn test:cov | yarn build        | yarn ready          |
| Fixing                 | yarn lint:fix | yarn test:fix              | Fix the code      | Update dependencies |
| Continuous integration | yarn lint:ci  | yarn test:ci               | Not available yet | Not available yet   |

## Commands

### Static code analysis

> Find problems in Typescript code

__Motivation:__ Make the code more consistent and avoid bugs

__When to use it:__ Before compilation

__Run:__ ```yarn lint```

__From package:__ [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of [npm](https://www.npmjs.com/) :  Zero-config CLI for TypeScript package development

---

### Fix static code analysis

> Fix problems in Typescript code

__Motivation:__ Facilitate routine maintenance of code

__When to use it:__ Before compilation

__Run:__ ```yarn lint:fix```

__From package:__ [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of [npm](https://www.npmjs.com/) :  Zero-config CLI for TypeScript package development

---

### Static code analysis for continuous integration

> Find problems in Typescript code

__Motivation:__ Make the code more consistent and avoid bugs

__When to use it:__ When pushing code to github, before testing

__Run:__ ```yarn lint:ci```

__From package:__ [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of [npm](https://www.npmjs.com/) :  Zero-config CLI for TypeScript package development

---

### Unit testing

> Run the unit tests

__Motivation:__ Check that the units of code behave as intended

__When to use it:__ After compilation, before build

__Run:__ ```yarn test```

__From package:__ [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of [npm](https://www.npmjs.com/) :  Zero-config CLI for TypeScript package development

---

### Fix unit testing snapshots

> Run the unit tests and update the snapshots

__Motivation:__ Facilitate routine maintenance of unit test snapshots

__When to use it:__ After compilation, before build

__Run:__ ```yarn test:fix```

__From package:__ [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of [npm](https://www.npmjs.com/) :  Zero-config CLI for TypeScript package development

---

### Unit testing code coverage

> Verify the extent to which the code has been executed. This does not include any threshold, but it is recommended to maximize the coverage

__Motivation:__ Ensure that every code branch and function is executed 

__When to use it:__ After compilation, before build

__Run:__ ```yarn test:cov```

__From package:__ [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of [npm](https://www.npmjs.com/) :  Zero-config CLI for TypeScript package development

---

### Unit testing code and coverage for continuous integration

> Test and verify the coverage of the code

__Motivation:__ Check that the units of code behave as intended and ensure that every code branch and function is executed 

__When to use it:__ When pushing code to github

__Run:__ ```yarn test:ci```

__From package:__ [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of [npm](https://www.npmjs.com/) :  Zero-config CLI for TypeScript package development

---

### Reset distribution and report folders

> Delete the dist and report folder

__Motivation:__ Start from a clean slate

__When to use it:__ Before building

__Run:__ ```yarn reset```

__From package:__ [yarn](https://classic.yarnpkg.com/en/) of [npm](https://www.npmjs.com/) :  Dependency management

---

### Build the library

> Transpile all the typescript source code to javascript

__Motivation:__ ESM library should be written in javascript

__When to use it:__ Before building

__Run:__ ```yarn build```

__From package:__ [yarn](https://classic.yarnpkg.com/en/) of [npm](https://www.npmjs.com/) :  Dependency management

---

### Ready for publishing

> Run a sequence of commands to check that the library is ready to be published

__Motivation:__ Detect quality flaws before pushing the code

__When to use it:__ Before pushing a branch

__Run:__ ```yarn ready```

__From package:__ [yarn](https://classic.yarnpkg.com/en/) of [npm](https://www.npmjs.com/) :  Dependency management

---

### Versioning

> Checks that the code is ready for versioning and version it

__Motivation:__ Normalize the steps involved in versioning

__When to use it:__ Before publishing

__Run:__ ```yarn version```

__From package:__ [yarn](https://classic.yarnpkg.com/en/) of [npm](https://www.npmjs.com/) :  Dependency management

---

### Run GitHub Actions locally

> Run GitHub Actions inside a docker container

__Motivation:__ Test GitHub Actions locally

__When to use it:__ When changing github actions

__Run:__ ```act```

__From package:__ [act](https://github.com/nektos/act) of [brew](https://docs.brew.sh/) :  Run GitHub Actions locally

---

### Install the local project globally

> Install this local project/script globally on the dev machine for development or testing purpose

__Motivation:__ Test global project locally before publishing

__When to use it:__ When testing locally

__Run:__ ```yarn global add `pwd````

__From package:__ [yarn](https://classic.yarnpkg.com/en/) of [npm](https://www.npmjs.com/) :  Dependency management

---

### Normalize the code structure using latest

> Normalize the code structure using baldrick (npx version)

__Motivation:__ Create a consistent developer experience

__When to use it:__ When changing github actions

__Run:__ ```yarn norm```

__From package:__ [baldrick-ts](https://github.com/flarebyte/baldrick-ts) of [npm](https://www.npmjs.com/) :  Typescript scaffolding assistant

---

### Normalize the code structure

> Normalize the code structure using baldrick (global version)

__Motivation:__ Create a consistent developer experience

__When to use it:__ When changing github actions

__Run:__ ```yarn norm:g```

__From package:__ [baldrick-ts](https://github.com/flarebyte/baldrick-ts) of [npm](https://www.npmjs.com/) :  Typescript scaffolding assistant

---