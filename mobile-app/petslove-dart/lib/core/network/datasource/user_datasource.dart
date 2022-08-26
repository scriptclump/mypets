import '../Result.dart';
import '../response/login_response.dart';
import 'base_datasource.dart';

class UserDatasource extends BaseDataSource {
  Future<Result<LoginResponse>> login(String username, String password) async =>
      getResult(retroClient
          .login({"username": username, "password": password}.toString()));

  Future<Result<LoginResponse>> register(String data) async =>
      getResult(retroClient.register(data));

  Future<Result<LoginResponse>> getOTP(String data) async {
    return getResult(retroClient.getOtp(data));
  }
}

/*
ViewModel -> Repository -> Datasource -> Network
                        -> DAO -> Local Database*/
