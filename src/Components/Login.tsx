import {
  DefaultButton,
  DefaultEffects,
  Label,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React from "react";
import { useDispatch } from "react-redux";
import DataService from "../Helpers/DataService";

const Login = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = React.useState<string | undefined>(undefined);
  const [password, setPassword] = React.useState<string | undefined>(undefined);

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const onChangeEmail = (_, value: string | undefined) => {
    setEmail(value);
  };

  const onChangePassword = (_, value?: string | undefined) => {
    setPassword(value);
  };

  const onClickRegister = async () => {
    dispatch({
      type: "SetShowRegistrationDialog",
      showRegistrationDialog: true,
    });
  };

  const onClickSignIn = async () => {
    if (email && password) {
      DataService.logInWithEmailAndPassword(auth, email, password);
    } else {
      window.alert("Email and/or password required");
    }
  };

  return (
    <Stack
      styles={{ root: { boxShadow: DefaultEffects.elevation16, padding: 16 } }}
    >
      <Text>Into the West</Text>
      <Text>Login Required</Text>
      <TextField label="Email" onChange={onChangeEmail} />
      <TextField
        label="Password"
        type="password"
        onChange={onChangePassword}
        canRevealPassword={false}
      />
      <DefaultButton text="Sign In" onClick={onClickSignIn} />
      <Label>No account? Register here:</Label>
      <PrimaryButton text="Register" onClick={onClickRegister} />
    </Stack>
  );
};

export default Login;
