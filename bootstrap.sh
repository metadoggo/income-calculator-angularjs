#!/usr/bin/env bash

sudo apt-get update
sudo apt-get upgrade
sudo apt-get install -y apache2 nodejs npm
gem install compass
gem install breakpoint
npm install -g testacular
sudo rm -rf /var/www
sudo ln -fs /vagrant /var/www
cd /vagrant
#compass compile
