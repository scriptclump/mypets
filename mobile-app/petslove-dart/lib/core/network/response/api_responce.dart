class ApiResponse {
  String status;
  String message;

  ApiResponse.fromJson(Map<String, dynamic> json) {
    try {
      status = json['status'];
      message = json['message'];
    } catch (e) {}
  }

  bool isOK() {
    return status == "success";
  }
}
