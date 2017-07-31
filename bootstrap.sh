#!/usr/bin/env bash

# disable stdin
export DEBIAN_FRONTEND=noninteractive

# Determine if this machine has already been provisioned
# Basically, run everything after this command once, and only once
if ! [ -f "/var/vagrant_provision" ]; then 
	
	#install nodejs
	curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
	sudo apt-get install -y nodejs
	sudo ln -sf /usr/bin/nodejs /usr/bin/node
	
	# installing apache2
	apt-get update
	apt-get install -y apache2
	
	#installing mongodb
	sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
	echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
	sudo apt-get update
	sudo apt-get install -y mongodb-org

	#install mysql
	echo 'mysql-server mysql-server/root_password password mysql' | sudo debconf-set-selections
	echo 'mysql-server mysql-server/root_password_again password mysql' | sudo debconf-set-selections
	sudo apt-get -y install mysql-server

	#install php
	sudo apt-get autoremove --purge php5-*
	sudo LC_ALL=C.UTF-8 add-apt-repository ppa:ondrej/php
	sudo apt-get update
	sudo apt-get install php7.0 php7.0-fpm php7.0-cli php-mbstring php7.0-xml php7.0-mysql php7.0-mongodb libapache2-mod-php7.0 php-xml -y
	sudo a2enmod libapache2-mod-php
	sudo phpenmod -v 7.0 xml
	sudo service apache2 restart
	
	#installing unzip
	sudo apt-get install -y unzip
	
	#install composer
	sudo apt-get install curl
	curl -sS https://getcomposer.org/installer -o composer-setup.php
	sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer

	#install Lumen
	composer global require "laravel/lumen-installer"

	#global node dependencies
	# sudo npm install -gy webpack webpack-dev-server typescript @angular/cli --no-bin-links
	
	# check if the public html directory exists
	if [-L /var/www/html]; then 
		sudo rm -rf /var/www/html
	fi

	if [ -d /var/www/html ]; 
		then
			#creating symlink for application
			sudo rm -rf /var/www/html
			ln -fs /vagrant/api /var/www/html
		else
			sudo mkdir /var/www
			ln -fs /vagrant/api /var/www/html
	fi
		
	#making sure the installations part doesn't run again
	sudo touch /var/vagrant_provision
fi

# configuration	
################

# Enable mod_rewrite
a2enmod rewrite

# start mongo service
sudo service mongod start

#update Lumen project dependencies
cd /vagrant/api
composer update

php -S localhost:8000 -t api/public &
# update angular app dependencies
# cd /vagrant/app
# npm install --no-bin-links
# ng serve &