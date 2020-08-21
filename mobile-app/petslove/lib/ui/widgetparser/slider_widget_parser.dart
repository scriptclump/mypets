import 'package:dynamic_widget/dynamic_widget.dart';
import '../component/slider/slider_widget.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SliderWidgetParser extends WidgetParser {
  @override
  Widget parse(Map<String, dynamic> map, BuildContext buildContext,
      ClickListener listener) {
    var autoPlay = true;
    var enlargeCenterPage = false;
    var viewportFraction = 1.0;
    var aspectRatio = 2.0;
    var initialPage = 1;

    var imgList = [];

    imgList = map.containsKey("imgList") ? map['imgList'] : [];

    autoPlay = map.containsKey("autoPlay") ? map['autoPlay'] : false;
    enlargeCenterPage =
        map.containsKey("enlargeCenterPage") ? map['enlargeCenterPage'] : false;
    viewportFraction =
        map.containsKey("viewportFraction") ? map['viewportFraction'] : 1.0;
    aspectRatio = map.containsKey("aspectRatio") ? map['aspectRatio'] : 2.0;
    initialPage = map.containsKey("initialPage") ? map['initialPage'] : 1;

    return SliderWidget(imgList,
        autoPlay: autoPlay,
        enlargeCenterPage: enlargeCenterPage,
        viewportFraction: viewportFraction,
        aspectRatio: aspectRatio,
        initialPage: initialPage);
  }

  @override
  String get widgetName => "SliderWidget";
}
