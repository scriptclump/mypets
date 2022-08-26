import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SubmitButton extends StatelessWidget {
  String text;
  Function act;

  SubmitButton(Function act, String text) {
    this.text = text;
    this.act = act;
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: Padding(
        padding: const EdgeInsets.only(top: 24.0, left: 24.0, right: 24.0),
        child: RaisedButton(
          child: new Text(text),
          onPressed: act,
          color: Colors.red,
          textColor: Colors.white,
          shape:
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
          padding: EdgeInsets.all(20),
        ),
      ),
    );
  }
}
