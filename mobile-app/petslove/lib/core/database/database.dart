import 'dart:async';

import 'package:factail/core/database/table/product.dart';
import 'package:floor/floor.dart';
import 'package:sqflite/sqflite.dart' as sqflite;

import 'dao/product_dao.dart';

part 'database.g.dart';

@Database(version: 1, entities: [
  Product,
])
abstract class AppDataBase extends FloorDatabase {
  ProductDao get productDao;
}
