import 'package:factail/ui/screen/home_page.dart';
import 'package:factail/ui/screen/login_page.dart';
import 'package:factail/ui/screen/mobile_number_page.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class AppRoutes {
  static const home = '/';
  static const categories = 'categories';
  static const cart = 'cart';
  static const productList = 'productList';
  static const product = 'product';
  static const profile = 'profile';
  static const checkout = 'checkout';
  static const signup = 'signup';
  static const signin = 'signin';
  static const forgotPassword = 'forgot_pass';
  static const filters = 'filters';

  _() {}
  static AppRoutes _instance;

  static AppRoutes get instance {
    if (_instance == null) _instance = new AppRoutes()._();
    return _instance;
  }

  factory AppRoutes() => instance;
}

class Router {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case 'home':
        return MaterialPageRoute(builder: (_) => HomePage());
      case 'login':
        return MaterialPageRoute(builder: (_) => LoginPage());
      case 'mobile':
        return MaterialPageRoute(builder: (_) => MobileNumberPage());

      /*case 'products':
        return MaterialPageRoute(builder: (_) => ProductPage());
      case 'widgets':
        return MaterialPageRoute(builder: (_) => WidgetList());
      case 'cart':
        return MaterialPageRoute(builder: (_) => CartPage());
      case 'category':
        return MaterialPageRoute(builder: (_) => CategoriesPage());
      case 'login':
        return MaterialPageRoute(builder: (_) => LoginPage());
      case 'register':
        return MaterialPageRoute(builder: (_) => RegisterPage());
      case 'post':
        var post = settings.arguments as Post;
        return MaterialPageRoute(builder: (_) => PostView(post: post));*/

      default:
        return MaterialPageRoute(
            builder: (_) =>
                Scaffold(
                  body: Center(
                    child: Text('No route defined for ${settings.name}'),
                  ),
                ));
    }
  }
}
