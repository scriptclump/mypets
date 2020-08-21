import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart' hide Headers;
import 'package:factail/config/api.dart';
import 'package:factail/core/model/task.dart';
import 'package:factail/core/model/task_group.dart';
import 'package:factail/core/network/response/login_response.dart';
import 'package:http_parser/http_parser.dart' show MediaType;
import 'package:retrofit/dio.dart';
import 'package:retrofit/http.dart';

part 'retrofit_client.g.dart';

@RestApi(baseUrl: "https://5d42a6e2bc64f90014a56ca0.mockapi.io/api/v1/")
abstract class RestClient {
  factory RestClient(Dio dio, {String baseUrl}) = _RestClient;

  @POST(Api.login)
  @FormUrlEncoded()
  Future<LoginResponse> login(@Field("data") String data);

  @Headers(
      <String, String>{"Content-type": "application/x-www-form-urlencoded"})
  @POST(Api.getOtp)
  @FormUrlEncoded()
  Future<LoginResponse> getOtp(@Field("data") String data);

  @POST(Api.register)
  @FormUrlEncoded()
  Future<LoginResponse> register(@Field("data") String data);

  @GET("/tags")
  Future<List<String>> getTags();

  @GET("/tasks")
  Future<List<Task>> getTasks();

  @GET("/tasks/{id}")
  Future<Task> getTask(@Path("id") String id);

  @PATCH("/tasks/{id}")
  Future<Task> updateTaskPart(
      @Path() String id, @Body() Map<String, dynamic> map);

  @PUT("/tasks/{id}")
  Future<Task> updateTask(@Path() String id, @Body() Task task);

  @DELETE("/tasks/{id}")
  Future<void> deleteTask(@Path() String id);

  @POST("/tasks")
  Future<Task> createTask(@Body() Task task);

  @POST("http://httpbin.org/post")
  Future<void> createNewTaskFromFile(@Part() File file);

  @Headers(<String, String>{"accept": "image/jpeg"})
  @GET("http://httpbin.org/image/jpeg")
  @DioResponseType(ResponseType.bytes)
  Future<List<int>> getFile();

  @POST("http://httpbin.org/post")
  @FormUrlEncoded()
  Future<String> postUrlEncodedFormData(@Field() String hello);

  @HEAD('/')
  Future<String> headRequest();

  @HEAD('/')
  Future headRquest2();

  @HEAD('/')
  Future<HttpResponse> headRquest3();

  @GET("/task/group")
  Future<List<TaskGroup>> grouppedTaskByDate();

  @GET("/task")
  Future<HttpResponse<List<Task>>> getTasksWithReponse();

  @DELETE("/tasks/{id}")
  Future<HttpResponse<void>> deleteTaskWithResponse(@Path() String id);

  @POST("/post")
  Future<String> postFormData(@Part() Task task, {@Part() File file});

  @POST("/post")
  Future<String> postFormData2(@Part() List<Map<String, dynamic>> task,
      @Part(contentType: 'application/json') File file);

  @POST("/post")
  Future<String> postFormData3(
      {@Part(value: "customfiles", contentType: 'application/json')
          List<File> files,
      @Part()
          File file});

  @POST("/post")
  Future<String> postFormData4(@Part() List<Task> tasks, @Part() File file);

  @POST("/post")
  Future<String> postFormData5(
    @Part() List<Task> tasks,
    @Part() Map<String, dynamic> map,
    @Part() int a, {
    @Part() bool b,
    @Part() double c,
    @Part() String d,
  });

  @GET('/demo')
  Future<String> queries(@Queries() Map<String, dynamic> queries);

  @GET("/get")
  Future<String> namedExample(@Query("apikey") String apiKey,
      @Query("scope") String scope, @Query("type") String type,
      {@Query("from") int from});

  @POST("/postfile")
  @Headers(<String, dynamic>{
    "Content-Type": "application/octet-stream",
    "Ocp-Apim-Subscription-Key": "abc"
  })
  Future<String> postFile({@Body() File file});

  @GET("")
  Future<String> testCustomOptions(@DioOptions() Options options);
}
