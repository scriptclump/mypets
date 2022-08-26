// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'database.dart';

// **************************************************************************
// FloorGenerator
// **************************************************************************

class $FloorAppDataBase {
  /// Creates a database builder for a persistent database.
  /// Once a database is built, you should keep a reference to it and re-use it.
  static _$AppDataBaseBuilder databaseBuilder(String name) =>
      _$AppDataBaseBuilder(name);

  /// Creates a database builder for an in memory database.
  /// Information stored in an in memory database disappears when the process is killed.
  /// Once a database is built, you should keep a reference to it and re-use it.
  static _$AppDataBaseBuilder inMemoryDatabaseBuilder() =>
      _$AppDataBaseBuilder(null);
}

class _$AppDataBaseBuilder {
  _$AppDataBaseBuilder(this.name);

  final String name;

  final List<Migration> _migrations = [];

  Callback _callback;

  /// Adds migrations to the builder.
  _$AppDataBaseBuilder addMigrations(List<Migration> migrations) {
    _migrations.addAll(migrations);
    return this;
  }

  /// Adds a database [Callback] to the builder.
  _$AppDataBaseBuilder addCallback(Callback callback) {
    _callback = callback;
    return this;
  }

  /// Creates the database and initializes it.
  Future<AppDataBase> build() async {
    final path = name != null
        ? await sqfliteDatabaseFactory.getDatabasePath(name)
        : ':memory:';
    final database = _$AppDataBase();
    database.database = await database.open(
      path,
      _migrations,
      _callback,
    );
    return database;
  }
}

class _$AppDataBase extends AppDataBase {
  _$AppDataBase([StreamController<String> listener]) {
    changeListener = listener ?? StreamController<String>.broadcast();
  }

  ProductDao _productDaoInstance;

  Future<sqflite.Database> open(String path, List<Migration> migrations,
      [Callback callback]) async {
    final databaseOptions = sqflite.OpenDatabaseOptions(
      version: 1,
      onConfigure: (database) async {
        await database.execute('PRAGMA foreign_keys = ON');
      },
      onOpen: (database) async {
        await callback?.onOpen?.call(database);
      },
      onUpgrade: (database, startVersion, endVersion) async {
        await MigrationAdapter.runMigrations(
            database, startVersion, endVersion, migrations);

        await callback?.onUpgrade?.call(database, startVersion, endVersion);
      },
      onCreate: (database, version) async {
        await database.execute(
            'CREATE TABLE IF NOT EXISTS `Product` (`id` TEXT, `imagePath` TEXT, `title` TEXT, `description` TEXT, `price` REAL, `color` TEXT, `size` TEXT, `quantity` INTEGER, `department` TEXT, `category` TEXT, `itemCount` INTEGER, `isInWishList` INTEGER, PRIMARY KEY (`id`))');

        await callback?.onCreate?.call(database, version);
      },
    );
    return sqfliteDatabaseFactory.openDatabase(path, options: databaseOptions);
  }

  @override
  ProductDao get productDao {
    return _productDaoInstance ??= _$ProductDao(database, changeListener);
  }
}

class _$ProductDao extends ProductDao {
  _$ProductDao(this.database, this.changeListener)
      : _queryAdapter = QueryAdapter(database, changeListener),
        _productInsertionAdapter = InsertionAdapter(
            database,
            'Product',
            (Product item) => <String, dynamic>{
                  'id': item.id,
                  'imagePath': item.imagePath,
                  'title': item.title,
                  'description': item.description,
                  'price': item.price,
                  'color': item.color,
                  'size': item.size,
                  'quantity': item.quantity,
                  'department': item.department,
                  'category': item.category,
                  'itemCount': item.itemCount,
                  'isInWishList': item.isInWishList == null
                      ? null
                      : (item.isInWishList ? 1 : 0)
                },
            changeListener),
        _productUpdateAdapter = UpdateAdapter(
            database,
            'Product',
            ['id'],
            (Product item) => <String, dynamic>{
                  'id': item.id,
                  'imagePath': item.imagePath,
                  'title': item.title,
                  'description': item.description,
                  'price': item.price,
                  'color': item.color,
                  'size': item.size,
                  'quantity': item.quantity,
                  'department': item.department,
                  'category': item.category,
                  'itemCount': item.itemCount,
                  'isInWishList': item.isInWishList == null
                      ? null
                      : (item.isInWishList ? 1 : 0)
                },
            changeListener),
        _productDeletionAdapter = DeletionAdapter(
            database,
            'Product',
            ['id'],
            (Product item) => <String, dynamic>{
                  'id': item.id,
                  'imagePath': item.imagePath,
                  'title': item.title,
                  'description': item.description,
                  'price': item.price,
                  'color': item.color,
                  'size': item.size,
                  'quantity': item.quantity,
                  'department': item.department,
                  'category': item.category,
                  'itemCount': item.itemCount,
                  'isInWishList': item.isInWishList == null
                      ? null
                      : (item.isInWishList ? 1 : 0)
                },
            changeListener);

  final sqflite.DatabaseExecutor database;

  final StreamController<String> changeListener;

  final QueryAdapter _queryAdapter;

  static final _productMapper = (Map<String, dynamic> row) => Product(
      row['id'] as String,
      row['imagePath'] as String,
      row['title'] as String,
      row['description'] as String,
      row['price'] as double,
      row['color'] as String,
      row['size'] as String,
      row['quantity'] as int,
      row['department'] as String,
      row['category'] as String,
      row['itemCount'] as int);

  final InsertionAdapter<Product> _productInsertionAdapter;

  final UpdateAdapter<Product> _productUpdateAdapter;

  final DeletionAdapter<Product> _productDeletionAdapter;

  @override
  Future<Product> findProductById(String id) async {
    return _queryAdapter.query('SELECT * FROM Product WHERE id = ?',
        arguments: <dynamic>[id], mapper: _productMapper);
  }

  @override
  Future<List<Product>> findAllProducts() async {
    return _queryAdapter.queryList('SELECT * FROM Product',
        mapper: _productMapper);
  }

  @override
  Stream<List<Product>> findAllProductsAsStream() {
    return _queryAdapter.queryListStream('SELECT * FROM Product',
        queryableName: 'Product', isView: false, mapper: _productMapper);
  }

  @override
  Future<void> insertProduct(Product Product) async {
    await _productInsertionAdapter.insert(Product, OnConflictStrategy.abort);
  }

  @override
  Future<void> insertProducts(List<Product> Products) async {
    await _productInsertionAdapter.insertList(
        Products, OnConflictStrategy.abort);
  }

  @override
  Future<void> updateProduct(Product Product) async {
    await _productUpdateAdapter.update(Product, OnConflictStrategy.abort);
  }

  @override
  Future<void> updateProducts(List<Product> Product) async {
    await _productUpdateAdapter.updateList(Product, OnConflictStrategy.abort);
  }

  @override
  Future<void> deleteProduct(Product Product) async {
    await _productDeletionAdapter.delete(Product);
  }

  @override
  Future<void> deleteProducts(List<Product> Products) async {
    await _productDeletionAdapter.deleteList(Products);
  }
}
