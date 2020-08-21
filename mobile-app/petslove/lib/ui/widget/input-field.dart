import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class EditText extends StatelessWidget {
  String hint;
  TextInputType inputType;
  String text;
  TextStyle hintStyle;
  Function validator;
  final TextEditingController controller;

  EditText(this.controller,
      {String hint: "",
        TextInputType inputType: TextInputType.text,
        String text: "",
        this.validator}) {
    this.hint = hint;
    this.inputType = inputType;
    this.text = text;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 24.0, left: 24.0, right: 24.0),
      child: TextFormField(
        textAlign: TextAlign.left,
        keyboardType: inputType,
        validator: validator,
        textInputAction: TextInputAction.next,
        controller: controller,
        decoration: InputDecoration(
          fillColor: Theme
              .of(context)
              .dividerColor,
          hintText: hint,
          //hintStyle: ,
          //labelStyle: Theme.of(context).textTheme.subtitle1,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(30),
            borderSide: BorderSide(
              width: 0,
              style: BorderStyle.none,
            ),
          ),
          filled: true,
          contentPadding: EdgeInsets.all(20),
        ),
      ),
    );
  }
}
