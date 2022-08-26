import '../../core/viewmodel/login_vm.dart';
import '../../locator.dart';
import '../../ui/screen/base_state.dart';
import '../../ui/widget/input-field.dart';
import '../../ui/widget/loader_widget.dart';
import '../../ui/widget/submit-button.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class LoginPage extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => LoginPageState();
}

class LoginPageState extends BaseState<LoginPage> {
  LoginViewModel loginViewModel = locator<LoginViewModel>();

  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

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
                        hint: "Email/Phone Number", validator: null),
                    EditText(
                      _passwordController,
                      hint: "Password",
                      inputType: TextInputType.visiblePassword,
                      validator: null,
                    ),
                    SubmitButton(() async {
                      print('==>Login clicked');
                      handleLoginAction();
                    }, "Login"),
                    SubmitButton(() {
                      print('==>register clicked');
                      //Navigator.pushNamed(context, 'register');
                    }, "Register"),
                    Padding(
                      padding: const EdgeInsets.only(
                          top: 24.0, left: 24.0, right: 24.0),
                      child: Text(" action performed"),
                    )
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
