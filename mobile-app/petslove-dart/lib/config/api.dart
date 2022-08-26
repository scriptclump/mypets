const String BASE_URL = 'http://192.168.0.111:3000';
const String BASE_URL1 = "http://qc-cp-mgr-v2-api.ebutor.com/mobileapi/v2";

class Api {
  static const String getOtp = "$BASE_URL1/sendOtp";

  static const String login = "$BASE_URL/users/login";
  static const String register = "$BASE_URL/users/register";

  static final String products = "$BASE_URL/products/";
  static final String productById = "$BASE_URL/products/";

  static final String variants = "$BASE_URL/variants/";
  static final String variantsById = "$BASE_URL/variants/";

  static final String departments = "$BASE_URL/departments";
  static final String categories = "$BASE_URL/categories";
  static final String search = "$BASE_URL/search";
  static final String filter = "$BASE_URL/filter";

  static final String cart = "$BASE_URL/users/cart-list";
  static final String add2cart = "$BASE_URL/users/create-cart";
  static final String updateCart = "$BASE_URL/users/update-cart";

  static final String checkoutByCartId = "$BASE_URL/checkout/";
  static final String paymentSuccess = "$BASE_URL/payment/success";

}
