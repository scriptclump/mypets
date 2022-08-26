
import 'package:factail/core/network/Result.dart';
import 'package:factail/core/network/datasource/user_datasource.dart';
import 'package:factail/core/network/response/login_response.dart';

import '../../locator.dart';

class UserRepository {
  UserDatasource userDS = locator<UserDatasource>();

  Future<Result<LoginResponse>> login(String username, String password) async =>
      userDS.login(username, password);

  Future<Result<LoginResponse>> register(String data) async =>
      userDS.register(data);

  Future<Result<LoginResponse>> getOtp(String data) async =>
      userDS.getOTP(data);
}
