import 'package:cached_network_image/cached_network_image.dart';
import '../../config/theme.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class ImageView extends StatelessWidget {
  String url;

  ImageView(this.url);

  @override
  Widget build(BuildContext context) => Container(
        padding: EdgeInsets.all(AppSizes.padding5),
        color: AppColors.red,
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
              color: AppColors.red,
              child: Align(
                alignment: Alignment.topLeft,
                widthFactor: 1.0,
                heightFactor: 1.0,
                child:
                    Image.network('https://i.ibb.co/1vXpqVs/flutter-logo.jpg'),
              ),
            ),
          ),
        ),
      );

  getImage(String url) => CachedNetworkImage(
        placeholder: (context, url) => Center(
          child: Container(
            child: CircularProgressIndicator(),
            height: 20.0,
            width: 20.0,
          ),
        ),
        imageUrl: url,
      );
}
