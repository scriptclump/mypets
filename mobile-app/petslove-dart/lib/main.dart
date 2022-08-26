import 'package:dynamic_widget/dynamic_widget.dart';
import 'ui/widgetparser/header_text_parser.dart';
import 'ui/widgetparser/slider_widget_parser.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'config/routes.dart';
import 'config/theme.dart';
import 'core/database/database.dart';
import 'locator.dart';

AppDataBase database;
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  setupLocator();

  database =
      await $FloorAppDataBase.databaseBuilder('flutter_database.db').build();

  DynamicWidgetBuilder.addParser(HeaderTextParser());
  DynamicWidgetBuilder.addParser(SliderWidgetParser());

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
        providers: [Provider<AppDataBase>(create: (_) => database)],
        child: MaterialApp(
          title: 'MyPet',
          theme: ThemeData(
            appBarTheme: AppBarTheme(
              color: AppColors.red, // status bar color
              brightness: Brightness.light,
            ),
          ),
          initialRoute: 'mobile',
          onGenerateRoute: Router.generateRoute,
        ));
  }
}
