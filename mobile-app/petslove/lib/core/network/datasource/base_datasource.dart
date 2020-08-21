import 'package:factail/core/enums/status.dart';
import 'package:factail/core/network/response/api_responce.dart';

import '../../../locator.dart';
import '../Result.dart';
import '../retrofit_client.dart';

class BaseDataSource {
  var retroClient = locator<RestClient>();

  Future<Result<T>> getResult<T extends ApiResponse>(Future<T> apiCall) async {
    try {
      print("===>Api");
      var resp = await apiCall;
      print("===>Api end");
      print(resp);
      if (resp != null) {
        if (resp.isOK()) {
          return Result(Status.SUCCESS, resp, "sucess");
        } else {
          return Result(Status.ERROR, resp, resp.message);
        }
      } else {
        return Result(Status.ERROR, resp, "failed");
      }
    } catch (e) {
      print(e);
    }
    return Result(Status.ERROR, null, "failed");
  }
}
