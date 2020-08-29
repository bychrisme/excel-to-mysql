# Excel-MySQL

Small API to extract data on XLS file to generate SQL syntax and store in database.

### Tech

* NodeJs
* Express
* ExcelJs
* MySQL


### Installation

Clone repository
```
$ git clone https://github.com/bychrisme/excel-to-mysql.git <project_name>
```

Install the dependencies.

```sh
$ cd <project_name>
$ npm install 
```

Configure environments file and edit it with your database configuration

```sh
$ cp .env.example .env
$ nano .env
```

### Usage

Use postman to test api, you can also pass `name` in request to specify table name you want to create

![Image of simple usage](https://github.com/bychrisme/excel-to-mysql/blob/master/app/assets/img/usage.png)

