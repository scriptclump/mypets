import '../../core/enums/status.dart';
import 'package:factail/core/network/Result.dart';
import 'package:factail/core/network/response/login_response.dart';
import 'package:factail/core/network/retrofit_client.dart';
import 'package:factail/core/repository/user_repository.dart';
import 'package:factail/locator.dart';
import 'package:flutter/cupertino.dart';

class LoginViewModel extends ChangeNotifier {
  UserRepository _userRepository = locator<UserRepository>();
  RestClient _restClient = locator<RestClient>();

  bool isLoading = false;
  String message = "";

  Future<bool> login(String username, String password) async {
    isLoading = true;

    Result<LoginResponse> resp =
        await _userRepository.login(username, password);
    bool success = false;
    if (resp.status == Status.SUCCESS) {
      success = true;
    } else {}
    isLoading = false;

    notifyListeners();
    return success;
  }

  Future<bool> getOtp(String phonenumber) async {
    isLoading = true;
    notifyListeners();

    String json =
        {"telephone": phonenumber, "business_type_id": "3014"}.toString();
    var resp = await _userRepository.getOtp(json.toString());

    print(resp);
    print(resp.status);
    print(resp.data);
    print(resp.message);

    message = resp.message;
    isLoading = false;
    notifyListeners();
    return resp.status == Status.SUCCESS;
  }
}
