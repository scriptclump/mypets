import '../../core/viewmodel/login_vm.dart';
import '../../locator.dart';
import '../../ui/screen/base_state.dart';
import '../../ui/widget/input-field.dart';
import '../../ui/widget/loader_widget.dart';
import '../../ui/widget/submit-button.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class MobileNumberPage extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => MobileNumberPageState();
}

class MobileNumberPageState extends BaseState<MobileNumberPage> {
  LoginViewModel loginViewModel = locator<LoginViewModel>();

  final TextEditingController _usernameController = TextEditingController();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [ChangeNotifierProvider(create: (context) => loginViewModel)],
      child: Consumer<LoginViewModel>(
          builder: (BuildContext context, LoginViewModel model, Widget child) {
        if (model.message != null && model.message.trim() != "") {
          showToast(model.message);
        }
        return getView(model);
      }),
    );
  }

  getView(LoginViewModel model) => Scaffold(
          body: Center(
              child: SingleChildScrollView(
        child: model.isLoading
            ? LoaderView()
            : Form(
                child: Column(
                  children: <Widget>[
                    EditText(_usernameController,
                        hint: "Mobile Number", validator: null),
                    SubmitButton(() async {
                      handleLoginAction();
                    }, "Proceed"),
                  ],
                ),
              ),
      )));

  void handleLoginAction() async {
    print('==>Login clicked');
    var success = await loginViewModel.getOtp(_usernameController.text);
    if (success) {
      Navigator.pushNamed(context, 'category');
    } else {}
  }
}
