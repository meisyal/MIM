# MIM

MIM stands for **M**obile **I**nventory **M**anager.

**MIM** is a mobile phone application that will help a shopkeeper to manage his/her small shop inventory. A shopkeeper usually taking inventory activities into a notebook. We looked it is so hard to handle some cases: searching history of sales order or making a monthly report, for example. This is a motivation why we build MIM (short version). We hope MIM is not only helping a shopkeeper make a decision he/she should take but also growing his/her business.

This project originally came from [natsumiaya][natsumiaya]. We collaborated in a team to develop this project. But, it got stuck in the middle 2015. I don't want to leave it. I am eager to continue this project.

## Installation

If you want to build and/or test yourself while this project is under development, make sure you have installed **[node.js][nodejs] or [io.js][iojs]** (I would recommend node.js **v0.12.x**/io.js **v1.6.x** or any latest version). After that, don't forget to install [SQLite][sqlite] and make a database along with tables, you can give a name, `MIM.db`, for example. I will provide the database schema soon. I run this project on **Ubuntu** operating system. So, you have to adjust the environment for development.

```bash
$ sudo apt-get update
$ sudo apt-get install sqlite3 libsqlite3-dev
$ sqlite3 MIM.db
```

Beside that, this project requires two Cordova plugins:
- [Cordova SQLite Storage][sqlite-storage]
- [SQLite dbcopy][sqlite-dbcopy]

Please, read the documentation of two plugins above before you start moving forward.

If you have passed the requirements above, now, you can follow the steps below:

1. Install [Cordova][cordova] and [Ionic Framework][ionic] via npm, you can use this command

   ```bash
   $ npm install -g cordova ionic
   ```

2. Create a blank start Ionic project in folder/location where you want and then change directory into your project name, MIM,
   in this case.

   ```bash
   $ ionic start MIM blank
   ```

3. Download the [latest][download] `.zip` version of this project and put them into your project directory (replacing `www`
   folder and some files, like `config.xml`).
4. Add Android platform into your ionic project, for example.

   ```bash
   $ cd MIM
   $ ionic platform add android
   ```

5. Build the source code until you get success message.

   ```bash
   $ ionic build android
   ```

6. You can either emulate or install the `.apk` file.

   ```bash
   $ ionic emulate android
   ```

## Status

Currently, this project is being developed and maintained by [meisyal][meisyal]. There are still many requirements that have not been finished yet. Documentation is not available for now.

If you face any problems or have something to say, feel free to contact me or submit an [issue][issue]. Your responses are very welcome.

## License

This is **unclear**. I chose MIT License when this project was started. Now, I change my mind from MIT License to unclear license. Please, check [LICENSE][license] for more information.

The side menu icons (add-inventory.svg, customers.svg, inventory-item.svg, sales-order.svg, sales.svg, and statistic.svg) were created by [natsumiaya][natsumiaya]. Its **copyright** is addressed to her. You can find the side menu icons [here][sidemenu-icon].

[natsumiaya]: https://github.com/natsumiaya
[nodejs]: https://nodejs.org/
[iojs]: https://iojs.org/
[sqlite]: http://sqlite.org/
[sqlite-storage]:  https://github.com/litehelpers/Cordova-sqlite-storage
[sqlite-dbcopy]: https://github.com/an-rahulpandey/cordova-plugin-dbcopy
[cordova]: https://cordova.apache.org/
[ionic]: http://ionicframework.com/
[download]: https://github.com/meisyal/MIM/archive/master.zip
[meisyal]: https://github.com/meisyal
[issue]: https://github.com/meisyal/MIM/issues
[license]: https://github.com/meisyal/MIM/blob/master/LICENSE
[sidemenu-icon]: https://github.com/meisyal/MIM/tree/master/www/img
