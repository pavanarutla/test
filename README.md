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