# Inventory
QR code scanner that helps to speed up and simplify the inventory checking process. 

## What is inventory checking or stocktaking?
Stocktaking or inventory checking is the physical verification of the quantities and condition of items held in a store or warehouse. It is a critical part of your inventory control and affects purchasing, production and sales. Verification is used in almost every company where stock-keeping units can't be easily calculated. 
### Main features:
- login and logout with ```JWT``` tokens
- scan and edit information:
  - Item status (works or not etc.)
  - Where it is located
  - Who is responsible for this item
  - Additional information such as ip, password
- instantly view changes of exact qr code in [web app](https://github.com/iliapnmrv/inventory-web)

Everything about web features (client and server) you can learn [here](https://github.com/iliapnmrv/inventory-web) 
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
