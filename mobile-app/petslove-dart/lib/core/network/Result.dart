
import 'package:factail/core/enums/status.dart';

class Result<T> {
  Status status;
  T data;
  String message;

  Result(this.status, this.data, this.message);

  static Result<T> success<T>(T data) => Result(Status.SUCCESS, data, null);

  static Result<T> error<T>(T data, String message) =>
      Result(Status.ERROR, data, message);

/*
  static Result<T> loading<T>(T data, String message) => Result(Status.LOADING, null, null);

  static Result<T> session<T>(T data, String message) => Result(Status.SESSION, null, null);*/

}
