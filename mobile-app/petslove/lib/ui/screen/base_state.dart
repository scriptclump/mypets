import '../../config/theme.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

abstract class BaseState<T extends StatefulWidget> extends State<T> {
  @override
  void initState() {
    super.initState();
  }

  showToast(String message) {
    Fluttertoast.showToast(
        msg: message,
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        timeInSecForIosWeb: 1,
        backgroundColor: AppColors.red,
        textColor: Colors.white,
        fontSize: 16.0);
  }
}
