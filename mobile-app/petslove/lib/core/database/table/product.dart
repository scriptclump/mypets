import 'package:floor/floor.dart';

@entity
class Product {
  @primaryKey
  String id;
  String imagePath;
  String title;
  String description;
  double price;
  String color;
  String size;
  int quantity;
  String department;
  String category;
  int itemCount = 0;
  bool isInWishList = false;

  Product(
      this.id,
      this.imagePath,
      this.title,
      this.description,
      this.price,
      this.color,
      this.size,
      this.quantity,
      this.department,
      this.category,
      this.itemCount);

  @ignore
  Product.fromJson(Map<String, dynamic> json) {
    this.id = json["id"];
    this.imagePath = json["imagePath"];
    this.title = json["title"];
    this.description = json["description"];
    this.price = json["price"];
    this.color = json["color"];
    this.size = json["size"];
    this.quantity = json["quantity"];
    this.department = json["department"];
    this.category = json["category"];
  }

  @ignore
  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['imagePath'] = this.imagePath;
    data['title'] = this.title;
    data['description'] = this.description;
    data['price'] = this.price;
    data['color'] = this.color;
    data['size'] = this.size;
    data['quantity'] = this.quantity;
    data['department'] = this.department;
    data['category'] = this.category;
    return data;
  }

  @ignore
  @override
  String toString() {
    return 'Product{id: $id, imagePath: $imagePath, title: $title, description: $description, price: $price, color: $color, size: $size, quantity: $quantity, department: $department, category: $category, itemCount: $itemCount}';
  }
}
