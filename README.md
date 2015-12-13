# MIM

MIM stands for **M**obile **I**nventory **M**anager.

**MIM** is a mobile phone application for a shopkeeper. This application is
designed to help a shopkeeper to manage his/her small shop inventory. A shopkeeper
usually takes inventory activities into a notebook. We looked it is so hard to
handle some cases: knowing the number of item in inventory or reporting monthly
statistic into a chart, for example. This is a motivation why we build MIM. We
hope MIM is not only helping a shopkeeper make a decision he/she should take
but also growing his/her business.

This project originally came from [natsumiaya][natsumiaya]. We collaborated in a
team to develop this project. But, it got stuck in the middle 2015 because some
reasons. I am eager to continue this project.

## Installation

If you want to build and/or test yourself while this project is under development,
make sure you have passed following the requirements.

Note: I run and test this project on **Ubuntu** operating system. So, you have
to adjust the environment for development.

### Requirements

You have to install **[node.js][nodejs]**. I would recommend node.js **v0.12.x**
or any latest version.

After that, don't forget to install [SQLite][sqlite].

```bash
$ sudo apt-get update
$ sudo apt-get install sqlite3 libsqlite3-dev
```

### Dependencies

Dependencies are used in this project:
- [Cordova SQLite Storage][sqlite-storage]
- [SQLite dbcopy][sqlite-dbcopy]

Please, read theirs documentation about how to install two plugins above into
your `ionic` project before you start moving forward.

MIM also uses [Angular Chart][angularchart] to generate chart.

### Building from Source

If you have passed the requirements above, now, you can follow the steps below:

1. Install [Cordova][cordova] and [Ionic Framework][ionic] via npm, you can use
   this command

   ```bash
   $ npm install -g cordova ionic
   ```

2. Create a blank start Ionic project in folder/location where you want and then
   change directory into your project name, MIM,
   in this case.

   ```bash
   $ ionic start MIM blank
   ```

3. Download the [latest][download] `.zip` version of this project and put them
   into your project directory (replacing some files on root and `www`
   folders).
4. Add Android platform into your ionic project, for example.

   ```bash
   $ cd MIM
   $ ionic platform add android
   ```
5. Make a database along with tables, you can give a name, `MIM.db`, for example.
   Database schema is available in a plain text [MIM.txt][schema].

  ```bash
  $ cd www/
  $ cat MIM.txt | sqlite3 MIM.db
  ```

6. Back to root folder of your project and build the source code until you get
   success message.

   ```bash
   $ cd ../
   $ ionic build android
   ```

7. You can either emulate or install the `.apk` file in your device.

   ```bash
   $ ionic emulate android
   ```

## Status

Currently, this project is being developed and maintained by [meisyal][meisyal].
There are still many requirements that have not been finished yet. Documentation
is not available for now.

If you face any problems or find a bug, feel free to submit an [issue][issue] or
[pull request][pr]. Your contributions are very welcome.

## License

This project is released under GNU General Public License Version 3. Please, check
[LICENSE][license] for more information. All other contents (dependencies etc.)
are redistributed under their original license terms.

The side menu icons (add-inventory.svg, customers.svg, inventory-item.svg,
sales-order.svg, sales.svg, and statistic.svg) were created by
[natsumiaya][natsumiaya]. Its **copyright** is addressed to her. You can find
these side menu icons [here][sidemenu-icon].

[natsumiaya]: https://github.com/natsumiaya
[nodejs]: https://nodejs.org/
[sqlite]: http://sqlite.org/
[schema]: https://github.com/meisyal/MIM/blob/master/www/MIM.txt
[sqlite-storage]:  https://github.com/litehelpers/Cordova-sqlite-storage
[sqlite-dbcopy]: https://github.com/an-rahulpandey/cordova-plugin-dbcopy
[angularchart]: http://jtblin.github.io/angular-chart.js/
[cordova]: https://cordova.apache.org/
[ionic]: http://ionicframework.com/
[download]: https://github.com/meisyal/MIM/archive/master.zip
[meisyal]: https://github.com/meisyal
[issue]: https://github.com/meisyal/MIM/issues
[pr]: https://github.com/meisyal/MIM/pulls
[license]: https://github.com/meisyal/MIM/blob/master/LICENSE
[sidemenu-icon]: https://github.com/meisyal/MIM/tree/master/www/img
