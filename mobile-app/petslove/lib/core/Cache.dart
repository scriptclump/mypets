import 'package:shared_preferences/shared_preferences.dart';

class Cache {
  Cache._privateConstructor();

  static final Cache _instance = Cache._privateConstructor();

  factory Cache() => _instance;

  final String WishList = 'wishList';
  SharedPreferences prefs;
  String userToken;

  saveUserToken(String user_token) async {
    if (prefs == null) {
      prefs = await SharedPreferences.getInstance();
    }
    prefs.setString("USER_TOKEN", user_token);
    user_token = user_token;
  }

  getUserToken() async {
    if (userToken == null) {
      if (prefs == null) {
        prefs = await SharedPreferences.getInstance();
      }
      userToken = prefs.getString("USER_TOKEN");
    }
    return userToken;
  }
}
