import 'package:dio/dio.dart';
import 'core/viewmodel/login_vm.dart';
import 'package:get_it/get_it.dart';

import 'core/network/datasource/user_datasource.dart';
import 'core/network/retrofit_client.dart';
import 'core/repository/user_repository.dart';

GetIt locator = GetIt.instance;

void setupLocator() {
  locator.registerLazySingleton(() => Dio());
  locator.registerLazySingleton(() => RestClient(locator<Dio>()));

  locator.registerLazySingleton(() => UserDatasource());
  locator.registerLazySingleton(() => UserRepository());

  locator.registerFactory(() => LoginViewModel());

  /*locator.registerLazySingleton(() => UserRepository());
  locator.registerFactory(() => CommentsViewModel());

  locator.registerLazySingleton(() => AuthenticationService());
  locator.registerFactory(() => CommentsModel());*/
}
