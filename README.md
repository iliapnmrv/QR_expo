# Inventory
QR code scanner that helps to speed up and simplify the inventory checking process. 
## What is inventory checking or stocktaking?
Stocktaking or inventory checking is the physical verification of the quantities and condition of items held in a store or warehouse. It is a critical part of your inventory control and affects purchasing, production and sales. Verification is used in almost every company where stock-keeping units can't be easily calculated. 
## Development process - from idea to implementation
During my work in company I'vre already developed an optimization of process of sending employee to medical examination. You can learn more about the project 
[here](https://github.com/iliapnmrv/med). As I finished my first problem at work using ```PHP```, ```MySQL```, ```JS``` and ```HTML```, I was given a new task: to develop an android application. It was decided to make a QR code scanner that will help to find and mark stock-keeping unit and then display an information to user. I had complete freedom in the choice of technologal stack so after a bit of research I decided to go with JavaScript's framework ```React Native``` and it's framework and a platform for universal React applications ```Expo```. I knew nothing about ```React Native``` and Android development itself. I just knew JavaScript and React basics and I've been given 2 month to learn a new technology and create a working application.
### Main features:
- Application works offline and don't depend on the internet
- Is it possible to open and close inventory session
If session is closed, it's only possible to read QR code but an entire database will not be available
- You can manage a download link while a session is closed. 'Download link' is a link from where a special csv file is downloaded and processed into json and a database
- View all scanned information in left menu, which inventory items are insufficient and which are in excess.
## Instalation
#### For development
If you would want to run an application, edit and test in development mode, you need to follow these steps carefully
1. First of all you need to have [node.js](https://nodejs.org/en/) installed.
2. Clone this repository
```
git clone https://github.com/iliapnmrv/inventory.git
```
3. And then run
```
npm install
```
4. Now you have everything install on your device, as an application uses Expo, you can run
```
expo start
```
to start developing and using this application
#### Install to use
Simply follow [this link](https://play.google.com/store/apps/details?id=com.inventory.appname) and download an application, you also need to provide a permission to ```camera``` and ```device's internal storage```
https://play.google.com/store/apps/details?id=com.inventory.appname

## Usage
