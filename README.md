# README #

Please find all the necessary information about setting up the project and contribution guidelines.

## What is this repository for? ##

* BillBoards India project

## How do I get set up? ##
  * install git > 2.12
  * create a directory `BBIndia`(or any name you'd like to use)
  * `cd <your_path>/BBIndia`
  * `git init`
  * `git remote add origin https://bitbucket.org/mridulkashyap57/billboardsindia.git`(you can use any other name in place of `origin` you'd like) 
  * `git pull origin master`

### Angular ###  
  * install nodejs > 6.11
  * open cmd/terminal and run the following commands
    * `cd <your_path>/BBIndia/app`
    * `npm install`
	* `npm start`
  * open browser and go to `localhost:8000`. you should see the app running
  
### PHP ###
  * install vagrant > 1.9.7
  * install virtualbox > 5.1
  * open cmd/terminal and run the following commands
    * `cd <your_path>/BBIndia/api`
    * `vagrant up --provision` (_Do not panic, it might take upto 30-40 minutes_)
  * open browser and go to `localhost:8001`. you should see the phpinfo file. it means the setup was successful.
  
## Contribution guidelines ##

* Please create a new local git branch to for the feature you're working on, and push it to the remote repo(this). 
* create a pull request to notify other contributors of your changes.
* `master` will be the main branch where the deployment ready code will stay. please **DO NOT PUSH INTO THIS(master) BRANCH**. You can only take a pull from it.

## Who do I talk to? ##

* for any query or concern, please send an email to `mridulkashyap57@gmail.com`

## Using Issue Tracker ##
Issues or feature requests will be created here. The lifecycle of issue goes like following:

* issue created
* dev is assigned(by admin), and assigns label `Pending from dev`
* dev codes, completes it, pushes the branch and creates a pull request, comments about the same on the issue and changes the label to `Pending for testing`.
* moves to testing
  * if issues are found, the issue goes back to dev. the tester must comment issues found in issue thread, remove the label `Pending for testing` and attach `Pending from dev`.
  * if no issues are found, the issue goes to code reviewer. The tester should comment it on the issue thread, remove the label `Pending for testing` and attach `Pending for code review`.
* moves to code review
  * if issues are found in code review, the issue goes back to dev. The reviewer must comment the issues found in issue thread and **code review**. Also, the label `Pending for code review` will be removed and `Pending for dev` will be attached.
  * if no issues are found the issue is closed and merged with main branch. also the code will be moved to production. all the labels will be removed.

At any point in the life-cycle of an issue, for any change we have to update the status in comments on issue thread so to make sure everyone knows the status/requirements/complications involved.
