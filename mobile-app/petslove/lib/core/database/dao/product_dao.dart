import 'package:factail/core/database/table/product.dart';
import 'package:floor/floor.dart';

@dao
abstract class ProductDao {
  @Query('SELECT * FROM Product WHERE id = :id')
  Future<Product> findProductById(String id);

  @Query('SELECT * FROM Product')
  Future<List<Product>> findAllProducts();

  @Query('SELECT * FROM Product')
  Stream<List<Product>> findAllProductsAsStream();

  @insert
  Future<void> insertProduct(Product Product);

  @insert
  Future<void> insertProducts(List<Product> Products);

  @update
  Future<void> updateProduct(Product Product);

  @update
  Future<void> updateProducts(List<Product> Product);

  @delete
  Future<void> deleteProduct(Product Product);

  @delete
  Future<void> deleteProducts(List<Product> Products);
}
