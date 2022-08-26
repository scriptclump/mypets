import 'package:cached_network_image/cached_network_image.dart';
import 'package:carousel_slider/carousel_controller.dart';
import 'package:carousel_slider/carousel_slider.dart';
import '../../../config/theme.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SliderWidget extends StatefulWidget {
  var autoPlay;
  var enlargeCenterPage;
  var viewportFraction;
  var aspectRatio;
  var initialPage;
  var fit;
  var shape;
  var imgList = [];

  SliderWidget(
    this.imgList, {
    this.autoPlay: false,
    this.enlargeCenterPage: false,
    this.viewportFraction: 1.0,
    this.aspectRatio: 2.0,
    this.initialPage: 1,
    this.fit: BoxFit.fill,
    this.shape: BoxShape.rectangle,
  });

  @override
  State<StatefulWidget> createState() => _SliderWidget();
}

class _SliderWidget extends State<SliderWidget> {
  CarouselController buttonCarouselController = CarouselController();

  @override
  Widget build(BuildContext context) {
    return CarouselSlider(
      items: widget.imgList
          .map((item) => Padding(
              padding: EdgeInsets.all(AppSizes.padding3),
              child: ClipRRect(
                  borderRadius: BorderRadius.circular(10.0),
                  child: Container(
                      child: InkWell(
                    onTap: () {},
                    child: CachedNetworkImage(
                      imageUrl: item,
                      placeholder: (context, url) => Center(
                        child: Container(
                          height: 30,
                          width: 30,
                          child: CircularProgressIndicator(),
                        ),
                      ),
                      imageBuilder: (context, imageProvider) => Container(
                        decoration: BoxDecoration(
                          shape: widget.shape,
                          image: DecorationImage(
                            image: imageProvider,
                            fit: widget.fit,
                          ),
                        ),
                      ),
                      errorWidget: (context, url, error) => Icon(Icons.error),
                    ),
                  )))))
          .toList(),
      carouselController: buttonCarouselController,
      options: CarouselOptions(
        autoPlay: widget.autoPlay,
        aspectRatio: widget.aspectRatio,
        initialPage: widget.initialPage,
        viewportFraction: widget.viewportFraction,
        enlargeCenterPage: widget.enlargeCenterPage,
      ),
    );
  }
}
