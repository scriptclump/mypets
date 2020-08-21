import 'package:dynamic_widget/dynamic_widget.dart';
import '../../config/theme.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class HeaderTextParser extends WidgetParser {
  @override
  Widget parse(Map<String, dynamic> map, BuildContext buildContext,
      ClickListener listener) {
    var text = map.containsKey("text") ? map["text"] : "";
    var textSize = map.containsKey("textSize") ? map["textSize"] : 20;
    var bgColor =
        _colorFromHex(map.containsKey("bgColor") ? map["bgColor"] : "#FFFFFF");

    print("Header Text Parser");
    print(text);
    print("Header Text Parser");

    return Container(
      padding: EdgeInsets.all(AppSizes.padding5),
      child: Card(
        elevation: 8,
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(30),
              topRight: Radius.circular(30),
              bottomLeft: Radius.circular(30),
              bottomRight: Radius.circular(30),
            ),
            side: BorderSide(width: 5, color: Colors.green)),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(30.0),
          child: Container(
            child: Align(
              alignment: Alignment.topLeft,
              widthFactor: 1.0,
              heightFactor: 1.0,
              child: Image.network('https://i.ibb.co/1vXpqVs/flutter-logo.jpg'),
            ),
          ),
        ),
      ),
    );
  }

  @override
  String get widgetName => "HeaderText";

  static Color _colorFromHex(String hexColor) {
    final hexCode = hexColor.replaceAll('#', '');
    return Color(int.parse('FF$hexCode', radix: 16));
  }
}
