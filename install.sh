sudo apt -y install curl
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt -y install yarn
sudo yarn
sudo yarn migrate
sudo yarn watch
